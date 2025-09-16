const Database = require('better-sqlite3');
const path = require('path');
const sql = new Database(path.join(__dirname, 'app.db'));
sql.pragma('journal_mode = WAL');
sql.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  password_hash TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS tokens (
  token TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  roles TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  projectId TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo',
  assignee TEXT DEFAULT '',
  FOREIGN KEY(projectId) REFERENCES projects(id)
);
CREATE TABLE IF NOT EXISTS sprints (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start TEXT NOT NULL,
  end TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  issueId TEXT NOT NULL,
  body TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY(issueId) REFERENCES issues(id)
);
`);

if (sql.prepare('SELECT COUNT(*) c FROM users').get().c === 0) {
  sql.prepare('INSERT INTO users (id,name,role) VALUES (?,?,?)').run('alice', 'Alice', 'admin');
  sql.prepare('INSERT INTO users (id,name,role) VALUES (?,?,?)').run('bob', 'Bob', '');
}
if (sql.prepare('SELECT COUNT(*) c FROM projects').get().c === 0) {
  sql.prepare('INSERT INTO projects (id,name) VALUES (?,?)').run('demo', 'Demo Project');
  sql.prepare('INSERT INTO issues (id,projectId,title,status,assignee) VALUES (?,?,?,?,?)').run('ISS-1','demo','Setup repo','doing','alice');
  sql.prepare('INSERT INTO issues (id,projectId,title,status,assignee) VALUES (?,?,?,?,?)').run('ISS-2','demo','Create MVP','todo','');
  sql.prepare('INSERT INTO sprints (id,name,start,end) VALUES (?,?,?,?)').run('SPR-1','Sprint 1','2025-01-01','2025-01-15');
}

module.exports = {
  users: {
    findById: async (id) => sql.prepare('SELECT * FROM users WHERE id = ?').get(id) || null,
    put: (id, name, role, password_hash) => sql.prepare('INSERT OR REPLACE INTO users (id,name,role,password_hash) VALUES (?,?,?,?)').run(id, name, role || '', password_hash || ''),
  },
  tokens: {
    findById: async (t) => { const r = sql.prepare('SELECT * FROM tokens WHERE token = ?').get(t); return r ? { token:r.token, userId:r.userId, roles:r.roles? r.roles.split(','):[] } : null; },
    put: (t,u,roles)=> sql.prepare('INSERT OR REPLACE INTO tokens(token,userId,roles) VALUES (?,?,?)').run(t,u,(roles||[]).join(',')),
    delete: (t)=> sql.prepare('DELETE FROM tokens WHERE token=?').run(t),
  },
  projects: {
    findById: async (id) => sql.prepare('SELECT * FROM projects WHERE id = ?').get(id) || null,
    list: async () => sql.prepare('SELECT * FROM projects ORDER BY name').all(),
  },
  issues: {
    findById: async (id) => sql.prepare('SELECT * FROM issues WHERE id = ?').get(id) || null,
    list: async () => sql.prepare('SELECT * FROM issues ORDER BY rowid DESC').all(),
  },
  sprints: {
    findById: async (id) => sql.prepare('SELECT * FROM sprints WHERE id = ?').get(id) || null,
    list: async () => sql.prepare('SELECT * FROM sprints ORDER BY start DESC').all(),
  },
  comments: {
    listByIssue: async (issueId) => sql.prepare('SELECT * FROM comments WHERE issueId = ? ORDER BY createdAt DESC').all(issueId),
  },
};

// internal helpers for handlers
module.exports._insertUser = (id, role) => {
  sql.prepare('INSERT OR IGNORE INTO users (id,name,role) VALUES (?,?,?)').run(id, id, role || '');
};
