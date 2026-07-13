/* PDMS API adapter — the only file that knows the backend is Apps Script + Sheets.
   Reads arrive already-loaded via the bootstrap <script> tag in js/config.js;
   this module only needs to handle writes and auth. */
(function (global) {
  const PDMS = global.PDMS = global.PDMS || {};

  function post(action, payload) {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) {
      return Promise.reject(new Error('Set PDMS_API_URL in js/config.js first'));
    }
    return fetch(global.PDMS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids a CORS preflight against Apps Script
      body: JSON.stringify(Object.assign({ action }, payload))
    })
      .then(res => res.json())
      .then(json => {
        if (!json.ok) throw new Error(json.error || 'Request failed');
        return json.data;
      });
  }

  PDMS.api = {
    create: (resource, record) => post('create', { resource, record }),
    update: (resource, id, patch) => post('update', { resource, id, patch }),
    remove: (resource, id) => post('remove', { resource, id }),
    login: (email, password) => post('login', { email, password }),
    register: (account) => post('register', { account })
  };
})(window);
