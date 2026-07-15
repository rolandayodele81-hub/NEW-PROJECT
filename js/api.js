/* PDMS API adapter — the only file that knows the backend URL. */
(function (global) {
  const PDMS = global.PDMS = global.PDMS || {};

  function request(path, method = 'GET', payload) {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) {
      return Promise.reject(new Error('Set PDMS_API_URL in js/config.js first'));
    }
    const headers = { 'Content-Type': 'application/json' };
    const token = PDMS.getToken();
    if (token) headers.Authorization = 'Bearer ' + token;

    return fetch(global.PDMS_API_URL + path, {
      method,
      headers,
      credentials: 'include',
      body: payload ? JSON.stringify(payload) : undefined
    })
      .then(res => res.json().then(json => ({ status: res.status, body: json })))
      .then(({ status, body }) => {
        if (!body || body.error) {
          throw new Error(body?.error || 'Request failed');
        }
        return body.data;
      });
  }

  PDMS.api = {
    login: (email, password) => request('/auth/login', 'POST', { email, password }),
    register: (account) => request('/auth/register', 'POST', account),
    get: (path) => request(path, 'GET'),
    create: (resource, record) => request(`/${resource}`, 'POST', record),
    update: (resource, id, patch) => request(`/${resource}/${id}`, 'PATCH', patch),
    remove: (resource, id) => request(`/${resource}/${id}`, 'DELETE')
  };
})(window);
