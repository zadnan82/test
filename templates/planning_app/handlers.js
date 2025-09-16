const db = require('./db.sqlite');
const bcrypt = require('bcryptjs');

module.exports = {
  async login(req) {
    const { name, password } = (req && req.body) || {};
    if (!name || !password) return { ok:false };
    const user = await db.users.findById(name);
    const ok = user && user.password_hash && bcrypt.compareSync(String(password), String(user.password_hash));
    if (!ok) return { ok:false };
    const token = 'tok_' + Math.random().toString(36).slice(2);
    const roles = user.role === 'admin' ? ['admin'] : [];
    db.tokens.put(token, name, roles);
    return { token };
  },
  async logout(req) {
    const token = req && req.headers && req.headers['x-auth-token'];
    if (token) db.tokens.delete(token);
    return { ok: true };
  },
  async register(req) {
    const { name, password } = (req && req.body) || {};
    if (!name || !password) return { ok: false };
    const existing = await db.users.findById(name);
    const hash = bcrypt.hashSync(String(password), 10);
    if (!existing) {
      db.users.put(name, name, '', hash);
    } else {
      db.users.put(name, existing.name || name, existing.role || '', hash);
    }
    const token = 'tok_' + Math.random().toString(36).slice(2);
    db.tokens.put(token, name, []);
    return { token };
  },
  async listProjects() { return db.projects.list(); },
  async createProject() { return { ok: true }; },
  async listIssues() { return db.issues.list(); },
  async createIssue() { return { ok: true }; },
  async updateIssue() { return { ok: true }; },
  async listSprints() { return db.sprints.list(); },
  async createSprint() { return { ok: true }; },
  async updateSprint() { return { ok: true }; },
  async listComments(req) { return db.comments.listByIssue(req.params.id); },
  async addComment() { return { ok: true }; },
};