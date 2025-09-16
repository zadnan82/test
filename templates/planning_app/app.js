const db = require('./db.sqlite');
const {
  login, logout,
  listProjects, createProject,
  listIssues, createIssue, updateIssue,
  listSprints, createSprint, updateSprint,
  listComments, addComment,
} = require('./handlers');

const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const result = await login(req, res, req.session || null);
  return res.json(result);
});

app.post('/api/register', async (req, res) => {
  const result = await register(req, res, req.session || null);
  return res.json(result);
});

app.delete('/api/logout', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await logout(req, res, req.session || null);
  return res.json(result);
});

app.get('/api/me', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const item = await db.users.findById(req.params.id || req.query.id);
  if (!item) return res.status(401).send('users not found');
  return res.json(item);
});

app.get('/api/projects', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await listProjects(req, res, req.session || null);
  return res.json(result);
});

app.post('/api/projects', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await createProject(req, res, req.session || null);
  return res.json(result);
});

app.get('/api/projects/:id', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const item = await db.projects.findById(req.params.id || req.query.id);
  if (!item) return res.status(404).send('projects not found');
  return res.json(item);
});

app.get('/api/issues', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await listIssues(req, res, req.session || null);
  return res.json(result);
});

app.post('/api/issues', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await createIssue(req, res, req.session || null);
  return res.json(result);
});

app.get('/api/issues/:id', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const item = await db.issues.findById(req.params.id || req.query.id);
  if (!item) return res.status(404).send('issues not found');
  return res.json(item);
});

app.put('/api/issues/:id', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await updateIssue(req, res, req.session || null);
  return res.json(result);
});

app.get('/api/sprints', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await listSprints(req, res, req.session || null);
  return res.json(result);
});

app.post('/api/sprints', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await createSprint(req, res, req.session || null);
  return res.json(result);
});

app.get('/api/sprints/:id', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const item = await db.sprints.findById(req.params.id || req.query.id);
  if (!item) return res.status(404).send('sprints not found');
  return res.json(item);
});

app.put('/api/sprints/:id', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await updateSprint(req, res, req.session || null);
  return res.json(result);
});

app.get('/api/issues/:id/comments', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await listComments(req, res, req.session || null);
  return res.json(result);
});

app.post('/api/issues/:id/comments', async (req, res) => {
  const token = req.header('X-Auth-Token');
  const session = token ? await db.tokens.findById(token) : null;
  req.session = session;
  if (!session) return res.status(401).send('unauthorized');
  const result = await addComment(req, res, req.session || null);
  return res.json(result);
});

module.exports = app;