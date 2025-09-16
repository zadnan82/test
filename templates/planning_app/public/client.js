const apiBase = '/api';

async function postApiLogin(hooks) {
  if (!hooks || typeof hooks.login !== 'function') throw new Error('Missing hook: login');
  const result = await hooks.login();
  return result;
}

async function postApiRegister(hooks) {
  if (!hooks || typeof hooks.register !== 'function') throw new Error('Missing hook: register');
  const result = await hooks.register();
  return result;
}

async function deleteApiLogout(hooks) {
  if (!hooks || typeof hooks.logout !== 'function') throw new Error('Missing hook: logout');
  const result = await hooks.logout();
  return result;
}

async function getApiMe(params = {}, body) {
  const url = `/api/me`;
  const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw Object.assign(new Error('request failed'), { status: res.status });
  return await res.json();
}

async function getApiProjects(params = {}, body) {
  const url = `/api/projects`;
  const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw Object.assign(new Error('request failed'), { status: res.status });
  return await res.json();
}

async function getApiIssues(params = {}, body) {
  const url = `/api/issues`;
  const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw Object.assign(new Error('request failed'), { status: res.status });
  return await res.json();
}

async function postApiIssues(hooks) {
  if (!hooks || typeof hooks.createIssue !== 'function') throw new Error('Missing hook: createIssue');
  const result = await hooks.createIssue();
  return result;
}

async function getApiSprints(params = {}, body) {
  const url = `/api/sprints`;
  const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw Object.assign(new Error('request failed'), { status: res.status });
  return await res.json();
}

if (typeof window !== 'undefined') { window.client = { postApiLogin, postApiRegister, deleteApiLogout, getApiMe, getApiProjects, getApiIssues, postApiIssues, getApiSprints }; }

if (typeof module !== 'undefined' && module.exports) { module.exports = { postApiLogin, postApiRegister, deleteApiLogout, getApiMe, getApiProjects, getApiIssues, postApiIssues, getApiSprints }; }