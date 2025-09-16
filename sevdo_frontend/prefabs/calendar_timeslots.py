# sevdo_frontend/prefabs/calendar_timeslots.py
def render_prefab(args, props):
    title = props.get("title", "Book a Timeslot")
    slot_minutes = int(str(props.get("slotMinutes", "30")) or "30")
    open_time = props.get("open", "09:00")
    close_time = props.get("close", "17:00")
    start_date = props.get("start")
    storage_key = props.get("storageKey", "sevdoTimeslots")

    # Accept inline args like: cal(open=08:00, close=18:00, slotMinutes=30)
    if args and "=" in args:
        parts = [p.strip() for p in args.split(",") if p.strip()]
        inline = {}
        for p in parts:
            if "=" in p:
                k, v = p.split("=", 1)
                inline[k.strip()] = v.strip()
        if "slotMinutes" in inline:
            try:
                slot_minutes = int(str(inline["slotMinutes"]).strip() or "30")
            except Exception:
                slot_minutes = 30
        if "open" in inline:
            open_time = inline["open"]
        if "close" in inline:
            close_time = inline["close"]
        if "start" in inline:
            start_date = inline["start"]

    # Optional backend echo props (for future)
    book_path = props.get("bookPath") or "/api/echo"
    book_method = (props.get("bookMethod") or "POST").upper()
    unbook_path = props.get("unbookPath") or "/api/echo"
    unbook_method = (props.get("unbookMethod") or "POST").upper()
    book_action = props.get("bookAction") or ""
    unbook_action = props.get("unbookAction") or ""

    start_safe = (start_date or "").replace("'", "\\'")
    cfg_line = (
        "var CFG={slot:" + str(slot_minutes)
        + ", open:'" + open_time
        + "', close:'" + close_time
        + "', start:'" + start_safe
        + "', key:'" + storage_key + "'};"
    )
    book_path_safe = book_path.replace("'", "\\'")
    unbook_path_safe = unbook_path.replace("'", "\\'")
    book_act_safe = book_action.replace("\\", "\\\\").replace("'", "\\'")
    unbook_act_safe = unbook_action.replace("\\", "\\\\").replace("'", "\\'")

    init_handler = (
        " onLoad={() => {"
        + cfg_line
        + "var root=document.getElementById('cal-root'); if(!root) return;"
        + "if(!window.sevdoCal){ window.sevdoCal={} };"
        + "var ST=window.sevdoCal; if(!ST.state){ ST.state={weekOffset:0}; }"
        + "function parseHM(s){ var parts=String(s).split(':'); var hh=parseInt(parts[0]||'0',10); var mm=parseInt(parts[1]||'0',10); return hh*60+mm; }"
        + "function fmtHM(m){ var h=Math.floor(m/60); var mm=String(m%60).padStart(2,'0'); return (String(h).padStart(2,'0')+':'+mm); }"
        + "function startOfWeek(d){ var dt=new Date(d.getFullYear(),d.getMonth(),d.getDate()); var wd=(dt.getDay()+6)%7; dt.setDate(dt.getDate()-wd); dt.setHours(0,0,0,0); return dt; }"
        + "function weekKey(dt){ var y=dt.getFullYear(); var m=String(dt.getMonth()+1).padStart(2,'0'); var dd=String(dt.getDate()).padStart(2,'0'); return y+'-'+m+'-'+dd; }"
        + "function load(){ try{ var raw=localStorage.getItem(CFG.key); return raw?JSON.parse(raw):{} }catch(e){ return {} } }"
        + "function save(data){ try{ localStorage.setItem(CFG.key, JSON.stringify(data)); }catch(e){} }"
        + "var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];"
        + "var BOOK_ACT='" + book_act_safe +
        "'; var UNBOOK_ACT='" + unbook_act_safe + "';"
        + "var BOOK_PATH='" + book_path_safe +
        "'; var BOOK_METHOD='" + book_method + "';"
        + "var UNBOOK_PATH='" + unbook_path_safe +
        "'; var UNBOOK_METHOD='" + unbook_method + "';"
        + "function echo(kind,payload){ if(kind==='book' && BOOK_ACT){ window.sevdoAct(BOOK_ACT); return; } if(kind==='unbook' && UNBOOK_ACT){ window.sevdoAct(UNBOOK_ACT); return; } var path=(kind==='book'?BOOK_PATH:UNBOOK_PATH); var method=(kind==='book'?BOOK_METHOD:UNBOOK_METHOD); window.sevdoAct('api:'+method+' '+path+'|'+JSON.stringify(payload)); }"
        + "function render(delta){ ST.state.weekOffset += (delta||0); var grid=document.getElementById('cal-grid'); if(!grid) return; grid.innerHTML=''; var base = CFG.start ? new Date(CFG.start+'T00:00:00') : new Date(); var sow = startOfWeek(base); sow.setDate(sow.getDate()+7*ST.state.weekOffset); var wkLbl=document.getElementById('cal-week'); if(wkLbl){ var end=new Date(sow); end.setDate(end.getDate()+6); wkLbl.textContent = sow.toISOString().slice(0,10)+' - '+end.toISOString().slice(0,10); } var data=load(); var wkey=weekKey(sow); var week=data[wkey]||{}; var openM=parseHM(CFG.open), closeM=parseHM(CFG.close); var step=CFG.slot; var rows=Math.max(0, Math.floor((closeM-openM)/step)); for(var r=0; r<rows; r++){ var row=document.createElement('div'); row.className='grid grid-cols-8 gap-px bg-gray-100'; var tdiv=document.createElement('div'); tdiv.className='bg-white p-2 text-xs text-gray-500'; tdiv.textContent=fmtHM(openM+r*step); row.appendChild(tdiv); for(var d=0; d<7; d++){ var key='d'+d; var booked=(week[key]||[]).indexOf(r)>=0; var cell=document.createElement('button'); cell.className=(booked?'bg-green-600 text-white':'bg-white text-gray-700 hover:bg-gray-50')+' p-2 text-xs text-center'; cell.textContent=booked?'Booked':'Available'; (function(rr,dd,kk,cel){ cel.onclick=function(){ var data2=load(); var wk=data2[wkey]||{}; var arr=wk[kk]||[]; var idx=arr.indexOf(rr); if(idx>=0){ arr.splice(idx,1);} else { arr.push(rr);} wk[kk]=arr; data2[wkey]=wk; save(data2); cel.className=(idx>=0?'bg-white text-gray-700 hover:bg-gray-50':'bg-green-600 text-white')+' p-2 text-xs text-center'; cel.textContent=(idx>=0?'Available':'Booked'); var slotTime=fmtHM(openM+rr*step); var dayDate=new Date(sow); dayDate.setDate(sow.getDate()+dd); var payload={event:(idx>=0?'unbook':'book'), week:wkey, day:dd, time:slotTime, date:dayDate.toISOString().slice(0,10), ts:Date.now()}; echo(payload.event, payload); }; })(r,d,key,cell); row.appendChild(cell);} grid.appendChild(row);} }"
        + "var prev=document.getElementById('cal-prev'); if(prev){ prev.onclick=function(){ render(-1); }; }"
        + "var next=document.getElementById('cal-next'); if(next){ next.onclick=function(){ render(1); }; }"
        + "render(0);"
        + "}}"
    )

    return f"""<section className="py-6 bg-white rounded-lg border">
  <div className="max-w-5xl mx-auto px-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="flex items-center gap-2">
        <button id="cal-prev" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm">&larr; Prev</button>
        <div id="cal-week" className="text-sm text-gray-600 min-w-[220px] text-center"></div>
        <button id="cal-next" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm">Next &rarr;</button>
      </div>
    </div>
    <div id="cal-root">
      <div id="cal-grid" className="rounded-md overflow-hidden border"></div>
    </div>
    <div className="mt-3 text-xs text-gray-500">Slot: {slot_minutes}m • Open: {open_time} • Close: {close_time}</div>
    <img alt="" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" className="hidden"{init_handler} />
  </div>
</section>"""


COMPONENT_TOKEN = "cal"  # sevdo_frontend/prefabs/calendar_timeslots.py


def render_prefab(args, props):
    title = props.get("title", "Book a Timeslot")
    slot_minutes = int(str(props.get("slotMinutes", "30")) or "30")
    open_time = props.get("open", "09:00")
    close_time = props.get("close", "17:00")
    start_date = props.get("start")
    storage_key = props.get("storageKey", "sevdoTimeslots")

    # Accept inline args like: cal(open=08:00, close=18:00, slotMinutes=30)
    if args and "=" in args:
        parts = [p.strip() for p in args.split(",") if p.strip()]
        inline = {}
        for p in parts:
            if "=" in p:
                k, v = p.split("=", 1)
                inline[k.strip()] = v.strip()
        if "slotMinutes" in inline:
            try:
                slot_minutes = int(str(inline["slotMinutes"]).strip() or "30")
            except Exception:
                slot_minutes = 30
        if "open" in inline:
            open_time = inline["open"]
        if "close" in inline:
            close_time = inline["close"]
        if "start" in inline:
            start_date = inline["start"]

    # Optional backend echo props (for future)
    book_path = props.get("bookPath") or "/api/echo"
    book_method = (props.get("bookMethod") or "POST").upper()
    unbook_path = props.get("unbookPath") or "/api/echo"
    unbook_method = (props.get("unbookMethod") or "POST").upper()
    book_action = props.get("bookAction") or ""
    unbook_action = props.get("unbookAction") or ""

    start_safe = (start_date or "").replace("'", "\\'")
    cfg_line = (
        "var CFG={slot:" + str(slot_minutes)
        + ", open:'" + open_time
        + "', close:'" + close_time
        + "', start:'" + start_safe
        + "', key:'" + storage_key + "'};"
    )
    book_path_safe = book_path.replace("'", "\\'")
    unbook_path_safe = unbook_path.replace("'", "\\'")
    book_act_safe = book_action.replace("\\", "\\\\").replace("'", "\\'")
    unbook_act_safe = unbook_action.replace("\\", "\\\\").replace("'", "\\'")

    init_handler = (
        " onLoad={() => {"
        + cfg_line
        + "var root=document.getElementById('cal-root'); if(!root) return;"
        + "if(!window.sevdoCal){ window.sevdoCal={} };"
        + "var ST=window.sevdoCal; if(!ST.state){ ST.state={weekOffset:0}; }"
        + "function parseHM(s){ var parts=String(s).split(':'); var hh=parseInt(parts[0]||'0',10); var mm=parseInt(parts[1]||'0',10); return hh*60+mm; }"
        + "function fmtHM(m){ var h=Math.floor(m/60); var mm=String(m%60).padStart(2,'0'); return (String(h).padStart(2,'0')+':'+mm); }"
        + "function startOfWeek(d){ var dt=new Date(d.getFullYear(),d.getMonth(),d.getDate()); var wd=(dt.getDay()+6)%7; dt.setDate(dt.getDate()-wd); dt.setHours(0,0,0,0); return dt; }"
        + "function weekKey(dt){ var y=dt.getFullYear(); var m=String(dt.getMonth()+1).padStart(2,'0'); var dd=String(dt.getDate()).padStart(2,'0'); return y+'-'+m+'-'+dd; }"
        + "function load(){ try{ var raw=localStorage.getItem(CFG.key); return raw?JSON.parse(raw):{} }catch(e){ return {} } }"
        + "function save(data){ try{ localStorage.setItem(CFG.key, JSON.stringify(data)); }catch(e){} }"
        + "var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];"
        + "var BOOK_ACT='" + book_act_safe +
        "'; var UNBOOK_ACT='" + unbook_act_safe + "';"
        + "var BOOK_PATH='" + book_path_safe +
        "'; var BOOK_METHOD='" + book_method + "';"
        + "var UNBOOK_PATH='" + unbook_path_safe +
        "'; var UNBOOK_METHOD='" + unbook_method + "';"
        + "function echo(kind,payload){ if(kind==='book' && BOOK_ACT){ window.sevdoAct(BOOK_ACT); return; } if(kind==='unbook' && UNBOOK_ACT){ window.sevdoAct(UNBOOK_ACT); return; } var path=(kind==='book'?BOOK_PATH:UNBOOK_PATH); var method=(kind==='book'?BOOK_METHOD:UNBOOK_METHOD); window.sevdoAct('api:'+method+' '+path+'|'+JSON.stringify(payload)); }"
        + "function render(delta){ ST.state.weekOffset += (delta||0); var grid=document.getElementById('cal-grid'); if(!grid) return; grid.innerHTML=''; var base = CFG.start ? new Date(CFG.start+'T00:00:00') : new Date(); var sow = startOfWeek(base); sow.setDate(sow.getDate()+7*ST.state.weekOffset); var wkLbl=document.getElementById('cal-week'); if(wkLbl){ var end=new Date(sow); end.setDate(end.getDate()+6); wkLbl.textContent = sow.toISOString().slice(0,10)+' - '+end.toISOString().slice(0,10); } var data=load(); var wkey=weekKey(sow); var week=data[wkey]||{}; var openM=parseHM(CFG.open), closeM=parseHM(CFG.close); var step=CFG.slot; var rows=Math.max(0, Math.floor((closeM-openM)/step)); for(var r=0; r<rows; r++){ var row=document.createElement('div'); row.className='grid grid-cols-8 gap-px bg-gray-100'; var tdiv=document.createElement('div'); tdiv.className='bg-white p-2 text-xs text-gray-500'; tdiv.textContent=fmtHM(openM+r*step); row.appendChild(tdiv); for(var d=0; d<7; d++){ var key='d'+d; var booked=(week[key]||[]).indexOf(r)>=0; var cell=document.createElement('button'); cell.className=(booked?'bg-green-600 text-white':'bg-white text-gray-700 hover:bg-gray-50')+' p-2 text-xs text-center'; cell.textContent=booked?'Booked':'Available'; (function(rr,dd,kk,cel){ cel.onclick=function(){ var data2=load(); var wk=data2[wkey]||{}; var arr=wk[kk]||[]; var idx=arr.indexOf(rr); if(idx>=0){ arr.splice(idx,1);} else { arr.push(rr);} wk[kk]=arr; data2[wkey]=wk; save(data2); cel.className=(idx>=0?'bg-white text-gray-700 hover:bg-gray-50':'bg-green-600 text-white')+' p-2 text-xs text-center'; cel.textContent=(idx>=0?'Available':'Booked'); var slotTime=fmtHM(openM+rr*step); var dayDate=new Date(sow); dayDate.setDate(sow.getDate()+dd); var payload={event:(idx>=0?'unbook':'book'), week:wkey, day:dd, time:slotTime, date:dayDate.toISOString().slice(0,10), ts:Date.now()}; echo(payload.event, payload); }; })(r,d,key,cell); row.appendChild(cell);} grid.appendChild(row);} }"
        + "var prev=document.getElementById('cal-prev'); if(prev){ prev.onclick=function(){ render(-1); }; }"
        + "var next=document.getElementById('cal-next'); if(next){ next.onclick=function(){ render(1); }; }"
        + "render(0);"
        + "}}"
    )

    return f"""<section className="py-6 bg-white rounded-lg border">
  <div className="max-w-5xl mx-auto px-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="flex items-center gap-2">
        <button id="cal-prev" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm">&larr; Prev</button>
        <div id="cal-week" className="text-sm text-gray-600 min-w-[220px] text-center"></div>
        <button id="cal-next" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded text-sm">Next &rarr;</button>
      </div>
    </div>
    <div id="cal-root">
      <div id="cal-grid" className="rounded-md overflow-hidden border"></div>
    </div>
    <div className="mt-3 text-xs text-gray-500">Slot: {slot_minutes}m • Open: {open_time} • Close: {close_time}</div>
    <img alt="" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" className="hidden"{init_handler} />
  </div>
</section>"""


COMPONENT_TOKEN = "cal"
