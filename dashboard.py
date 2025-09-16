"""
Simple Flask UI for Cursor task board.
Place this in WSL and run: python3 cursor_task_board_flask.py
It will create needed folders.
"""
from flask import Flask, render_template_string, request, jsonify, send_from_directory
import os, time, re, logging
import concurrent.futures as futures
import requests
from urllib.parse import quote_plus
from agent_system.coding_agent import solve_subtask
from agent_system.rag_integration import AgentRAGService

"""Path configuration

Defaults to using the repository-local `tasks` and `logs` directories so it
aligns with the task runner script. Can be overridden via environment vars:
- SEVDO_TASK_DIR
- SEVDO_OUTPUT_DIR
"""
BASE_DIR = os.path.realpath(os.path.dirname(__file__))
TASK_DIR = os.path.realpath(os.environ.get('SEVDO_TASK_DIR', os.path.join(BASE_DIR, 'tasks')))
OUTPUT_DIR = os.path.realpath(os.environ.get('SEVDO_OUTPUT_DIR', os.path.join(BASE_DIR, 'logs')))

os.makedirs(TASK_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

app = Flask(__name__)
# Reduce noisy HTTP request logs
logging.getLogger('werkzeug').setLevel(logging.ERROR)
app.logger.setLevel(logging.ERROR)

# HTML template (single-file app)
INDEX_HTML = '''
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Task Dashboard</title>
<style>
:root{
  --bg:#0b0f14; --panel:#111823; --muted:#9fb0c6; --fg:#e8eef7; --acc:#6aa6ff; --ok:#23c552; --warn:#f3b43a; --err:#ff5d5d; --border:#1e2b3a;
}
*{box-sizing:border-box}
html,body{height:100%}
body{font-family:Inter,system-ui,Segoe UI,Arial;background:var(--bg);color:var(--fg);margin:0;}
.shell{padding:20px;max-width:1200px;margin:0 auto}
.topbar{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.brand{font-weight:800;letter-spacing:.3px}
.spacer{flex:1}
.stat{background:var(--panel);border:1px solid var(--border);padding:8px 10px;border-radius:8px;font-size:12px;color:var(--muted)}
.layout{display:grid;grid-template-columns:360px 1fr;gap:16px}
.card{background:var(--panel);border:1px solid var(--border);border-radius:12px;overflow:hidden}
.card h3{margin:0;padding:12px 14px;border-bottom:1px solid var(--border);font-size:14px;color:var(--muted);font-weight:600}
.card .body{padding:14px}
textarea,input,select,button{font:inherit}
textarea{width:100%;min-height:110px;background:#0c1420;border:1px solid var(--border);color:var(--fg);border-radius:8px;padding:10px;resize:vertical}
input[type=text]{width:100%;background:#0c1420;border:1px solid var(--border);color:var(--fg);border-radius:8px;padding:10px}
button{background:var(--acc);border:none;color:#07101b;border-radius:8px;padding:10px 12px;font-weight:700;cursor:pointer}
button.secondary{background:transparent;border:1px solid var(--border);color:var(--fg)}
.row{display:flex;gap:10px;align-items:center}
.row + .row{margin-top:10px}
.actions{display:flex;gap:8px;flex-wrap:wrap}
.list{max-height:520px;overflow:auto}
.item{display:flex;gap:8px;align-items:center;padding:10px 12px;border-bottom:1px solid var(--border);cursor:pointer}
.item:hover{background:#0f1724}
.item .name{font-weight:600}
.item .meta{color:var(--muted);font-size:12px}
.badge{padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700}
.status-Active{background:rgba(243,180,58,.15);color:var(--warn)}
.status-Completed{background:rgba(35,197,82,.15);color:var(--ok)}
.status-Failed{background:rgba(255,93,93,.15);color:var(--err)}
.status-Pending{background:#0f1724;color:var(--muted)}
.detail .section{margin-bottom:14px}
.mono{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace}
.pre{white-space:pre-wrap;word-break:break-word;background:#0c1420;border:1px solid var(--border);padding:10px;border-radius:8px;max-height:320px;overflow:auto}
.inline-actions{display:flex;gap:8px;margin-top:8px}
.search{background:#0c1420;border:1px solid var(--border);color:var(--fg);border-radius:8px;padding:10px;width:100%}
.empty{color:var(--muted);font-style:italic}
</style>
</head>
<body>
  <div class="shell">
    <div class="topbar">
      <div class="brand">AI Task Dashboard</div>
      <div class="spacer"></div>
      <div class="stat"><span id="countTotal">0</span> total</div>
      <div class="stat"><span id="countActive">0</span> active</div>
      <div class="stat"><span id="countCompleted">0</span> done</div>
      <div class="stat"><span id="countFailed">0</span> failed</div>
    </div>

    <div class="layout">
      <div class="card">
        <h3>New Task</h3>
        <div class="body">
          <div class="row">
            <textarea id="taskInput" placeholder="Describe what the agent should do. The agent will produce a **SUMMARY** section."></textarea>
          </div>
          <div class="row">
            <input id="workdirInput" type="text" placeholder="Optional: working directory, e.g. /home/user/project" />
          </div>
          <div class="row">
            <input id="filesInput" type="text" value="sandbox/example_target.py" placeholder="Optional: files to edit (comma-separated, relative to WORKDIR)" />
          </div>
          <div class="row">
            <input id="modelTaskInput" type="text" placeholder="Optional: model override, e.g. llama3.2:3b" />
          </div>
          <div class="row actions">
            <button id="startBtn">Start Agent</button>
            <button class="secondary" id="clearBtn" type="button">Clear</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Tasks</h3>
        <div class="body">
          <input id="search" class="search" placeholder="Filter by name or status..." />
        </div>
        <div id="list" class="list"></div>
      </div>
    </div>

    <div style="height:16px"></div>

    <div class="card">
      <h3>Test solve_subtask</h3>
      <div class="body">
        <div class="row">
          <input id="subtaskInput" type="text" placeholder="Enter subtask, e.g. login form" />
        </div>
        <div class="row">
          <input id="modelInput" type="text" placeholder="Optional model (default llama3.2:3b)" />
        </div>
        <div class="row actions">
          <button id="runSolveSubtask">Run</button>
        </div>
        <div class="section">
          <div class="meta">Result</div>
          <div id="solveResult" class="pre mono"></div>
        </div>
      </div>
    </div>

    <div style="height:16px"></div>

    <div class="card">
      <h3>RAG-race</h3>
      <div class="body">
        <div class="row">
          <input id="raceTask" type="text" placeholder="Enter a task to race across models" />
        </div>
        <div class="row">
          <input id="raceModels" type="text" value="llama4:17b-scout-16e-instruct-q4_K_M, llama3.2:3b, gpt-oss:latest, gpt-oss:20b, gpt-oss:120b, gemma3:27b" placeholder="Optional: comma-separated models" />
        </div>
        <div class="row actions">
          <button id="runRagRace">Run Race</button>
        </div>
        <div class="section">
          <div class="meta">Results</div>
          <div id="raceResults" class="pre mono"></div>
        </div>
      </div>
    </div>

    <div style="height:16px"></div>

    <div class="card detail" id="detailCard" style="display:none">
      <h3>Task Detail</h3>
      <div class="body">
        <div class="section"><div id="detailName" class="name mono"></div><div class="meta" id="detailMeta"></div></div>
        <div class="section"><span id="detailStatus" class="badge status-Pending">Pending</span></div>
        <div class="section">
          <div class="meta">Task Prompt</div>
          <div id="detailTask" class="pre mono"></div>
        </div>
        <div class="section">
          <div class="meta">Timeline</div>
          <div id="detailEvents" class="pre mono"></div>
        </div>
        <div class="section">
          <div class="meta">Summary</div>
          <div id="detailSummary" class="pre mono"></div>
          <div class="inline-actions">
            <button class="secondary" id="copySummary">Copy</button>
            <a id="downloadSummary" class="secondary" href="#" download>Download</a>
            <a id="downloadNewFiles" class="secondary" href="#" download>New Files</a>
          </div>
        </div>
        <div class="section">
          <div class="inline-actions">
            <button class="secondary" id="viewLog">View Full Log</button>
            <a id="downloadLog" class="secondary" href="#" download>Download Log</a>
            <button class="secondary" id="retryBtn">Retry</button>
            <button class="secondary" id="clearAllBtn" type="button">Clear All</button>
          </div>
        </div>
        <div class="section" id="logSection" style="display:none">
          <div class="meta">Full Log</div>
          <div id="detailLog" class="pre mono" style="max-height:460px"></div>
        </div>
      </div>
    </div>

  </div>

<script>
let STATE = [];
let SELECTED = null;

function fmtTime(ts){
  if(!ts) return '';
  const d = new Date(ts*1000);
  return d.toLocaleString();
}

function renderList(){
  const el = document.getElementById('list');
  const q = document.getElementById('search').value.toLowerCase();
  el.innerHTML = '';
  let filtered = STATE.filter(x => (x.name.toLowerCase().includes(q) || x.status.toLowerCase().includes(q)));
  if(filtered.length===0){
    const div = document.createElement('div');
    div.className='body empty';
    div.textContent='No tasks match your filter.';
    el.appendChild(div);
    return;
  }
  filtered.forEach(x=>{
    const row = document.createElement('div');
    row.className='item';
    row.dataset.name = x.name;
    const hb = x.hb_ts ? ` · hb ${new Date(x.hb_ts*1000).toLocaleTimeString()}` : '';
    row.innerHTML = `
      <span class="badge status-${x.status}">${x.status}</span>
      <span class="name">${x.name}</span>
      <span class="meta">${fmtTime(x.created_ts)}${hb}</span>
    `;
    row.addEventListener('click',()=>selectTask(x.name));
    el.appendChild(row);
  });
}

async function fetchState(){
  const r = await fetch('/state');
  STATE = await r.json();
  document.getElementById('countTotal').textContent = STATE.length;
  document.getElementById('countActive').textContent = STATE.filter(x=>x.status==='Active').length;
  document.getElementById('countCompleted').textContent = STATE.filter(x=>x.status==='Completed').length;
  document.getElementById('countFailed').textContent = STATE.filter(x=>x.status==='Failed').length;
  renderList();
  if(SELECTED){ selectTask(SELECTED, true); }
}

async function selectTask(name, silent){
  SELECTED = name;
  const r = await fetch('/task/'+encodeURIComponent(name));
  if(!r.ok){ if(!silent){ alert('Task not found'); } return; }
  const d = await r.json();
  document.getElementById('detailCard').style.display='block';
  document.getElementById('detailName').textContent = d.name;
  let metaParts = [];
  if(d.workdir){ metaParts.push('WORKDIR: '+d.workdir); }
  if(d.created_ts){ metaParts.push('Created: '+fmtTime(d.created_ts)); }
  if(d.hb_ts){ metaParts.push('Last heartbeat: '+fmtTime(d.hb_ts)); }
  if(d.pid){ metaParts.push('PID: '+d.pid); }
  document.getElementById('detailMeta').textContent = metaParts.join(' · ');
  const st = document.getElementById('detailStatus');
  st.textContent = d.status;
  st.className = 'badge status-'+d.status;
  document.getElementById('detailTask').textContent = d.task_text || '';
  document.getElementById('detailSummary').textContent = d.summary || '';
  // Render timeline/events
  const evEl = document.getElementById('detailEvents');
  if(d.events && d.events.length){
    const lines = d.events.map(e => `${e.ts ? new Date(e.ts*1000).toLocaleTimeString() : ''} ${e.code}${e.message? ' — '+e.message:''}`);
    evEl.textContent = lines.join('\\n');
  } else {
    evEl.textContent = '(no events yet)';
  }
  document.getElementById('downloadSummary').href = '/download/'+encodeURIComponent(d.name)+'/summary';
  document.getElementById('downloadLog').href = '/download/'+encodeURIComponent(d.name)+'/full';
  document.getElementById('downloadNewFiles').href = '/download/'+encodeURIComponent(d.name)+'/newfiles';
  document.getElementById('logSection').style.display='none';
  document.getElementById('detailLog').textContent='';
  // Wire actions per selection
  document.getElementById('deleteBtn')?.remove();
  document.getElementById('killBtn')?.remove();
  const actions = document.querySelector('.detail .inline-actions');
  if(actions){
    const killBtn = document.createElement('button');
    killBtn.className='secondary';
    killBtn.id='killBtn';
    killBtn.textContent='Kill';
    killBtn.onclick = async ()=>{ await fetch('/kill/'+encodeURIComponent(d.name), {method:'POST'}); fetchState(); };
    const delBtn = document.createElement('button');
    delBtn.className='secondary';
    delBtn.id='deleteBtn';
    delBtn.textContent='Delete';
    delBtn.onclick = async ()=>{ await fetch('/delete/'+encodeURIComponent(d.name), {method:'POST'}); document.getElementById('detailCard').style.display='none'; fetchState(); };
    actions.appendChild(killBtn);
    actions.appendChild(delBtn);
  }
}

document.getElementById('startBtn').addEventListener('click', async ()=>{
  const txt = document.getElementById('taskInput').value.trim();
  const wd = document.getElementById('workdirInput').value.trim();
  const files = document.getElementById('filesInput').value.trim();
  const model = document.getElementById('modelTaskInput').value.trim();
  if(!txt) return;
  await fetch('/add', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({task:txt, workdir: wd, files, model})});
  document.getElementById('taskInput').value='';
  document.getElementById('workdirInput').value='';
  document.getElementById('filesInput').value='';
  document.getElementById('modelTaskInput').value='';
  // Show optimistic timeline note
  document.getElementById('detailCard').style.display='block';
  document.getElementById('detailEvents').textContent = 'Task created — awaiting runner...';
  fetchState();
});

document.getElementById('clearBtn').addEventListener('click', ()=>{
  document.getElementById('taskInput').value='';
  document.getElementById('workdirInput').value='';
  document.getElementById('filesInput').value='';
  document.getElementById('modelTaskInput').value='';
});

document.getElementById('search').addEventListener('input', renderList);

document.getElementById('copySummary').addEventListener('click', ()=>{
  const txt = document.getElementById('detailSummary').textContent;
  navigator.clipboard.writeText(txt);
});

document.getElementById('viewLog').addEventListener('click', async ()=>{
  if(!SELECTED) return;
  const r = await fetch('/log/'+encodeURIComponent(SELECTED));
  if(r.ok){
    const t = await r.text();
    document.getElementById('detailLog').textContent = t;
    document.getElementById('logSection').style.display='block';
  }
});

document.getElementById('retryBtn').addEventListener('click', async ()=>{
  if(!SELECTED) return;
  const r = await fetch('/task/'+encodeURIComponent(SELECTED));
  if(!r.ok) return;
  const d = await r.json();
  await fetch('/add', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({task:d.task_text || '', workdir: d.workdir || ''})});
  fetchState();
});

document.getElementById('clearAllBtn').addEventListener('click', async ()=>{
  if(!confirm('Delete all tasks and outputs?')) return;
  await fetch('/clear', {method:'POST'});
  document.getElementById('detailCard').style.display='none';
  fetchState();
});

document.getElementById('runSolveSubtask').addEventListener('click', async ()=>{
  const subtask = (document.getElementById('subtaskInput').value || '').trim();
  const model = (document.getElementById('modelInput').value || '').trim();
  if(!subtask) return;
  const r = await fetch('/api/test-solve-subtask', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({subtask, model})});
  const el = document.getElementById('solveResult');
  if(r.ok){
    const data = await r.json();
    el.textContent = JSON.stringify(data.result || data, null, 2);
  } else {
    const txt = await r.text();
    el.textContent = 'Error: ' + txt;
  }
});

document.getElementById('runRagRace').addEventListener('click', async ()=>{
  const task = (document.getElementById('raceTask').value || '').trim();
  const modelsRaw = (document.getElementById('raceModels').value || '').trim();
  if(!task) return;
  const el = document.getElementById('raceResults');
  el.textContent = 'Running race...';
  const models = modelsRaw ? modelsRaw.split(',').map(x=>x.trim()).filter(Boolean) : undefined;
  try{
    const r = await fetch('/api/rag-race', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({task, models})});
    if(!r.ok){
      const txt = await r.text();
      el.textContent = 'Error: ' + txt;
      return;
    }
    const data = await r.json();
    const results = (data.results || []).slice().sort((a,b)=>a.elapsed_ms-b.elapsed_ms);
    const header = 'Model'.padEnd(40) + 'Time (ms)'.padEnd(12) + 'Tok(total/in/out)'.padEnd(20) + 'Status  Code  Ep';
    const lines = [header, '-'.repeat(header.length)];
    for(const it of results){
      const status = it.ok ? 'ok' : 'error';
      const tok = (it.total_tokens ?? '').toString().padEnd(6) + '/' + (it.prompt_tokens ?? '').toString().padEnd(2) + '/' + (it.completion_tokens ?? '').toString().padEnd(3);
      const code = (it.status_code==null?'':String(it.status_code)).padEnd(6);
      const ep = (it.endpoint||'').padEnd(3);
      lines.push((it.model || '').padEnd(40) + String(it.elapsed_ms || 0).padEnd(12) + tok.padEnd(20) + status + '  ' + code + '  ' + ep);
    }
    if(typeof data.total_elapsed_ms === 'number'){
      lines.push('\\nTotal wall time: ' + data.total_elapsed_ms + ' ms');
    }
    el.textContent = lines.join('\\n');
  }catch(e){
    el.textContent = 'Error: ' + (e && e.message ? e.message : String(e));
  }
});

setInterval(fetchState, 2000);
fetchState();
</script>
</body>
</html>
'''

# Helpers

def slugify(text: str, max_words: int = 10, max_length: int = 80) -> str:
    """Generate a filesystem-safe, human-readable slug from text.

    - Lowercase, words joined by '-'
    - Only [a-z0-9-]
    - Limit to first max_words and max_length
    """
    text = text.strip().lower()
    # keep alphanumerics and spaces
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    words = [w for w in text.split() if w]
    if max_words:
        words = words[:max_words]
    slug = "-".join(words)
    # collapse multiple dashes
    slug = re.sub(r"-+", "-", slug).strip("-")
    if max_length and len(slug) > max_length:
        slug = slug[:max_length].rstrip("-")
    return slug or "task"

def generate_unique_task_name(task_text: str) -> str:
    """Create a descriptive, unique task filename stem based on the prompt."""
    # Use first non-empty line of the prompt
    first_line = ""
    for line in (task_text or "").splitlines():
        line = line.strip()
        if line:
            first_line = line
            break
    base = slugify(first_line or task_text or "task")
    candidate = base
    suffix = 2
    while os.path.exists(os.path.join(TASK_DIR, candidate + '.task')):
        candidate = f"{base}-{suffix}"
        suffix += 1
    return candidate

def _safe_read(path: str) -> str:
    try:
        with open(path, 'r', encoding='utf-8', errors='replace') as f:
            return f.read()
    except Exception:
        return ''

def list_tasks():
    files = [f for f in os.listdir(TASK_DIR) if f.endswith('.task')]
    files.sort(key=lambda fn: os.path.getmtime(os.path.join(TASK_DIR, fn)), reverse=True)
    items = []
    for fn in files:
        name = os.path.splitext(fn)[0]
        created_ts = int(os.path.getmtime(os.path.join(TASK_DIR, fn)))
        status_file = os.path.join(OUTPUT_DIR, f"{name}_status.txt")
        summary_file = os.path.join(OUTPUT_DIR, f"{name}_summary.txt")
        hb_file = os.path.join(OUTPUT_DIR, f"{name}.hb")
        pid_file = os.path.join(OUTPUT_DIR, f"{name}.pid")
        rc_file = os.path.join(OUTPUT_DIR, f"{name}.rc")
        status = 'Pending'
        if os.path.exists(status_file):
            status = _safe_read(status_file).strip() or 'Pending'
        summary = ''
        if os.path.exists(summary_file):
            summary = _safe_read(summary_file).strip()
        hb_ts = int(os.path.getmtime(hb_file)) if os.path.exists(hb_file) else None
        pid = (_safe_read(pid_file).strip() if os.path.exists(pid_file) else '')
        rc = (_safe_read(rc_file).strip() if os.path.exists(rc_file) else '')
        items.append({'name':name,'status':status,'summary':summary,'created_ts':created_ts,'hb_ts':hb_ts,'pid':pid,'rc':rc})
    return items

@app.route('/')
def index():
    return render_template_string(INDEX_HTML)

@app.route('/state')
def state():
    items = list_tasks()
    out = []
    for it in items:
        out.append({
            'name': it['name'],
            'status': it['status'],
            'summary': it['summary'],
            'created_ts': it.get('created_ts'),
            'hb_ts': it.get('hb_ts'),
            'pid': it.get('pid'),
            'rc': it.get('rc')
        })
    return jsonify(out)

@app.route('/add', methods=['POST'])
def add():
    js = request.get_json(force=True, silent=True) or {}
    txt = (js.get('task') or '').strip()
    workdir = (js.get('workdir') or '').strip()
    files = (js.get('files') or '').strip()
    model = (js.get('model') or '').strip()
    if not txt:
        return ('Empty task', 400)
    # Inject WORKDIR directive at the top if provided and not already in the task
    headers = []
    if workdir and not txt.startswith('# WORKDIR='):
        headers.append(f"# WORKDIR={workdir}")
    if files and '# FILES=' not in txt:
        headers.append(f"# FILES={files}")
    if model and '# MODEL=' not in txt:
        headers.append(f"# MODEL={model}")
    header = "\n".join(headers)
    if header:
        header += "\n"
    # Don't add automatic summary hints - let Aider handle output naturally
    summary_hint = ''
    # Generate human-friendly, unique task name from the prompt
    name_stem = generate_unique_task_name(txt)
    path = os.path.join(TASK_DIR, name_stem + '.task')
    with open(path,'w', encoding='utf-8') as f:
        f.write(header + txt + summary_hint)
    # Log event: task created
    try:
        ev_path = os.path.join(OUTPUT_DIR, f"{name_stem}.events")
        with open(ev_path, 'a', encoding='utf-8') as ef:
            ef.write(f"{int(time.time())}|TASK_CREATED|{path}\n")
    except Exception:
        pass
    return ('',201)

@app.route('/task/<name>')
def task_detail(name: str):
    # Validate filename
    safe_name = os.path.basename(name)
    task_path = os.path.join(TASK_DIR, safe_name + '.task')
    if not os.path.exists(task_path):
        return ('Not found', 404)
    status_file = os.path.join(OUTPUT_DIR, f"{safe_name}_status.txt")
    summary_file = os.path.join(OUTPUT_DIR, f"{safe_name}_summary.txt")
    full_file = os.path.join(OUTPUT_DIR, f"{safe_name}_full.txt")
    task_text = _safe_read(task_path)
    workdir = ''
    for line in task_text.splitlines()[:3]:
        if line.startswith('# WORKDIR='):
            workdir = line.split('=',1)[1].strip()
            break
    # Heartbeat / pid / rc
    hb_file = os.path.join(OUTPUT_DIR, f"{safe_name}.hb")
    pid_file = os.path.join(OUTPUT_DIR, f"{safe_name}.pid")
    rc_file = os.path.join(OUTPUT_DIR, f"{safe_name}.rc")
    hb_ts = int(os.path.getmtime(hb_file)) if os.path.exists(hb_file) else None
    ev_file = os.path.join(OUTPUT_DIR, f"{safe_name}.events")
    pid = _safe_read(pid_file).strip() if os.path.exists(pid_file) else ''
    rc = _safe_read(rc_file).strip() if os.path.exists(rc_file) else ''

    # Load timeline events
    events = []
    if os.path.exists(ev_file):
        try:
            for line in _safe_read(ev_file).splitlines():
                parts = line.split('|', 2)
                if len(parts) >= 2:
                    ts = int(parts[0]) if parts[0].isdigit() else None
                    code = parts[1]
                    msg = parts[2] if len(parts) >= 3 else ''
                    events.append({'ts': ts, 'code': code, 'message': msg})
        except Exception:
            pass

    resp = {
        'name': safe_name,
        'created_ts': int(os.path.getmtime(task_path)),
        'status': (_safe_read(status_file).strip() if os.path.exists(status_file) else 'Pending'),
        'summary': (_safe_read(summary_file).strip() if os.path.exists(summary_file) else ''),
        'task_text': task_text,
        'workdir': workdir,
        'task_path': task_path,
        'has_log': os.path.exists(full_file),
        'hb_ts': hb_ts,
        'pid': pid,
        'rc': rc,
        'events': events
    }
    return jsonify(resp)

@app.route('/log/<name>')
def task_log(name: str):
    safe_name = os.path.basename(name)
    full_file = os.path.join(OUTPUT_DIR, f"{safe_name}_full.txt")
    if not os.path.exists(full_file):
        return ('Not found', 404)
    return _safe_read(full_file)

@app.route('/download/<name>/<kind>')
def download(name: str, kind: str):
    safe_name = os.path.basename(name)
    if kind == 'summary':
        path = os.path.join(OUTPUT_DIR, f"{safe_name}_summary.txt")
    elif kind == 'full':
        path = os.path.join(OUTPUT_DIR, f"{safe_name}_full.txt")
    elif kind == 'status':
        path = os.path.join(OUTPUT_DIR, f"{safe_name}_status.txt")
    elif kind == 'wd':
        path = os.path.join(OUTPUT_DIR, f"{safe_name}.wd")
    elif kind == 'newfiles':
        path = os.path.join(OUTPUT_DIR, f"{safe_name}.files.new")
    else:
        return ('Invalid kind', 400)
    if not os.path.exists(path):
        return ('Not found', 404)
    return send_from_directory(OUTPUT_DIR, os.path.basename(path), as_attachment=True)

@app.route('/api/test-solve-subtask', methods=['POST'])
def api_test_solve_subtask():
    js = request.get_json(force=True, silent=True) or {}
    subtask = (js.get('subtask') or '').strip()
    model = (js.get('model') or 'llama3.2:3b').strip()
    if not subtask:
        return jsonify({'ok': False, 'error': 'subtask is required'}), 400
    try:
        rag_service = AgentRAGService()
        result = solve_subtask(subtask, rag_service, model)
        return jsonify({'ok': True, 'result': result})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500

@app.route('/api/rag-race', methods=['POST'])
def api_rag_race():
    js = request.get_json(force=True, silent=True) or {}
    task = (js.get('task') or '').strip()
    models = js.get('models')
    if not task:
        return jsonify({'ok': False, 'error': 'task is required'}), 400
    # Default model list
    if not models or not isinstance(models, list):
        models = [
            'llama4:17b-scout-16e-instruct-q4_K_M',
            'llama3.2:3b',
            'gpt-oss:latest',
            'gpt-oss:20b',
            'gpt-oss:120b',
            'gemma3:27b',
        ]

    # Measure real LLM gateway latency per model
    base_url = os.environ.get('LLM_GATEWAY_URL', 'http://user-backend:8000')
    prompt = task

    def run_one(model_name: str):
        t0 = time.time()
        endpoint_used = ''
        status_code = None
        try:
            url_fc = f"{base_url}/ollama_fc/{quote_plus(model_name)}/{quote_plus(prompt)}"
            url_simple = f"{base_url}/ollama/{quote_plus(model_name)}/{quote_plus(prompt)}"
            endpoint_used = 'ollama_fc'
            resp = requests.post(url_fc, timeout=120)
            status_code = resp.status_code
            if resp.status_code != 200:
                endpoint_used = 'ollama'
                resp = requests.post(url_simple, timeout=120)
                status_code = resp.status_code
            # Access body to ensure full receipt
            body_text = resp.text
            usage = {}
            prompt_tokens = None
            completion_tokens = None
            total_tokens = None
            try:
                data = resp.json()
                # Common usage shapes
                if isinstance(data, dict):
                    if isinstance(data.get('usage'), dict):
                        usage = data.get('usage') or {}
                        prompt_tokens = usage.get('prompt_tokens') or usage.get('input_tokens')
                        completion_tokens = usage.get('completion_tokens') or usage.get('output_tokens')
                        total_tokens = usage.get('total_tokens')
                    # Ollama-like fields
                    if prompt_tokens is None:
                        prompt_tokens = data.get('prompt_eval_count') or data.get('prompt_tokens')
                    if completion_tokens is None:
                        completion_tokens = data.get('eval_count') or data.get('completion_tokens')
                    if total_tokens is None:
                        total_tokens = data.get('total_tokens')
            except Exception:
                pass
            if total_tokens is None and (prompt_tokens is not None and completion_tokens is not None):
                try:
                    total_tokens = int(prompt_tokens) + int(completion_tokens)
                except Exception:
                    total_tokens = None
            elapsed_ms = int((time.time() - t0) * 1000)
            ok = resp.status_code == 200
            return {
                'model': model_name,
                'elapsed_ms': elapsed_ms,
                'ok': ok,
                'status_code': status_code,
                'endpoint': endpoint_used,
                'prompt_tokens': prompt_tokens,
                'completion_tokens': completion_tokens,
                'total_tokens': total_tokens,
            }
        except Exception as e:
            elapsed_ms = int((time.time() - t0) * 1000)
            return {
                'model': model_name,
                'elapsed_ms': elapsed_ms,
                'ok': False,
                'error': str(e),
                'status_code': status_code,
                'endpoint': endpoint_used,
                'prompt_tokens': None,
                'completion_tokens': None,
                'total_tokens': None,
            }

    start = time.time()
    results = []
    with futures.ThreadPoolExecutor(max_workers=min(len(models), 6)) as ex:
        future_to_model = {ex.submit(run_one, m): m for m in models}
        for fut in futures.as_completed(future_to_model):
            results.append(fut.result())
    total_elapsed_ms = int((time.time() - start) * 1000)
    return jsonify({'ok': True, 'results': results, 'total_elapsed_ms': total_elapsed_ms})

@app.route('/kill/<name>', methods=['POST'])
def kill(name: str):
    safe_name = os.path.basename(name)
    pid_file = os.path.join(OUTPUT_DIR, f"{safe_name}.pid")
    if not os.path.exists(pid_file):
        return ('No PID', 404)
    pid = _safe_read(pid_file).strip()
    if not pid.isdigit():
        return ('Invalid PID', 400)
    try:
        os.kill(int(pid), 9)
        return ('', 204)
    except Exception as e:
        return (str(e), 500)

@app.route('/delete/<name>', methods=['POST'])
def delete_task(name: str):
    safe_name = os.path.basename(name)
    # Remove task and outputs if exist
    paths = [
        os.path.join(TASK_DIR, safe_name + '.task'),
        os.path.join(OUTPUT_DIR, f"{safe_name}_status.txt"),
        os.path.join(OUTPUT_DIR, f"{safe_name}_summary.txt"),
        os.path.join(OUTPUT_DIR, f"{safe_name}_full.txt"),
        os.path.join(OUTPUT_DIR, f"{safe_name}.pid"),
        os.path.join(OUTPUT_DIR, f"{safe_name}.hb"),
        os.path.join(OUTPUT_DIR, f"{safe_name}.rc"),
        os.path.join(OUTPUT_DIR, f"{safe_name}.lock"),
        os.path.join(OUTPUT_DIR, f"{safe_name}.files.before"),
        os.path.join(OUTPUT_DIR, f"{safe_name}.files.after"),
        os.path.join(OUTPUT_DIR, f"{safe_name}.files.new"),
        os.path.join(OUTPUT_DIR, f"{safe_name}.files.modified"),
    ]
    for p in paths:
        try:
            if os.path.exists(p):
                os.remove(p)
        except Exception:
            pass
    return ('', 204)

@app.route('/clear', methods=['POST'])
def clear_all():
    # Remove all tasks and outputs. Danger!
    for fn in list(os.listdir(TASK_DIR)):
        if fn.endswith('.task'):
            try:
                os.remove(os.path.join(TASK_DIR, fn))
            except Exception:
                pass
    for fn in list(os.listdir(OUTPUT_DIR)):
        try:
            os.remove(os.path.join(OUTPUT_DIR, fn))
        except Exception:
            pass
    return ('', 204)

if __name__ == '__main__':
    # Run dev server
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
