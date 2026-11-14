// All network calls live here so components stay clean.
// The browser NEVER sees an API key — it only talks to OUR Express server.

async function request(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(readError(data.error) || `Request failed (${res.status})`);
  return data;
}

// Turns a zod "flatten()" error object or a plain string into a readable message
function readError(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;
  const fields = Object.entries(error.fieldErrors || {}).map(([field, msgs]) => `${field}: ${msgs[0]}`);
  return [...(error.formErrors || []), ...fields].join(' · ');
}

export function getHealth() {
  return request('/api/health');
}

export function getCategories() {
  return request('/api/resources/categories');
}

export function getResources({ q = '', category = '' } = {}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  return request(`/api/resources?${params}`);
}

export function createResource(resource) {
  return request('/api/resources', { method: 'POST', body: JSON.stringify(resource) });
}

export function askGuide(message, history = []) {
  return request('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message, history }) });
}

export function compareModels(message) {
  return request('/api/ai/compare', { method: 'POST', body: JSON.stringify({ message }) });
}
