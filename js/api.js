/* PDMS API adapter — the only file that knows the backend is Apps Script + Sheets.
   Reads arrive already-loaded via the bootstrap <script> tag in js/config.js;
   this module only needs to handle writes and auth. */
(function (global) {
  const PDMS = global.PDMS = global.PDMS || {};
  const isLocalFile = location.protocol === 'file:';
  const isLocalHost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname);
  const isLocalMode = isLocalFile || isLocalHost;
  const hasRemoteBackend = !!(global.PDMS_API_URL && global.PDMS_API_URL.indexOf('REPLACE_WITH') !== 0);
  const LOCAL_STORAGE_KEY = 'pdms-local-data';
  const ID_PREFIX = {
    users: 'U',
    consultants: 'C',
    clients: 'CL',
    projects: 'PSE-',
    departments: 'D',
    notifications: 'N',
    threads: 'T',
    activities: 'A',
    reviews: 'RV'
  };

  function persistLocalData() {
    if (!isLocalMode || hasRemoteBackend || !global.PDMS_DATA) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      users: global.PDMS_DATA.users,
      consultants: global.PDMS_DATA.consultants,
      clients: global.PDMS_DATA.clients,
      projects: global.PDMS_DATA.projects,
      departments: global.PDMS_DATA.departments,
      notifications: global.PDMS_DATA.notifications,
      threads: global.PDMS_DATA.threads,
      activities: global.PDMS_DATA.activities,
      reviews: global.PDMS_DATA.reviews
    }));
  }

  function loadLocalData() {
    if (!isLocalMode || hasRemoteBackend || !global.PDMS_DATA) return;
    try {
      const saved = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
      Object.keys(saved).forEach(key => {
        if (Array.isArray(saved[key])) {
          global.PDMS_DATA[key] = saved[key];
        }
      });
    } catch (e) {
      console.warn('Unable to load local PDMS data', e);
    }
  }

  function generateId(resource) {
    const prefix = ID_PREFIX[resource] || 'X';
    return prefix + Math.floor(1000 + Math.random() * 8999);
  }

  function getLocalResource(resource) {
    if (!global.PDMS_DATA) return [];
    if (!Array.isArray(global.PDMS_DATA[resource])) global.PDMS_DATA[resource] = [];
    return global.PDMS_DATA[resource];
  }

  function localPost(action, payload) {
    return new Promise((resolve, reject) => {
      const resource = payload.resource;
      if (action === 'login') {
        const user = PDMS.findLocalAuthUser(payload.email, payload.password);
        if (!user) return reject(new Error('Invalid login credentials.'));
        const copy = Object.assign({}, user);
        delete copy._localPassword;
        return resolve(copy);
      }
      if (action === 'register') {
        if (resource !== 'users') return reject(new Error('Local register only supports users.'));
        const account = Object.assign({}, payload.account);
        if (!account.password) return reject(new Error('A password is required for all new user accounts.'));
        const existing = PDMS.getUsers().find(u => String(u.email || '').trim().toLowerCase() === String(account.email || '').trim().toLowerCase());
        if (existing) return reject(new Error('An account with that email already exists.'));
        if (!account.id) account.id = generateId('users');
        account.status = account.status || 'Active';
        account.availability = account.availability || 'Available';
        account.workload = account.workload || 0;
        account.joined = account.joined || new Date().toISOString().slice(0, 10);
        account._localPassword = String(account.password);
        delete account.password;
        getLocalResource('users').unshift(account);
        persistLocalData();
        const copy = Object.assign({}, account);
        delete copy._localPassword;
        return resolve(copy);
      }
      if (action === 'create') {
        const record = Object.assign({}, payload.record);
        if (!record.id) record.id = generateId(resource);
        const collection = getLocalResource(resource);
        collection.unshift(record);
        persistLocalData();
        return resolve(record);
      }
      if (action === 'update') {
        const collection = getLocalResource(resource);
        const item = collection.find(item => String(item.id) === String(payload.id));
        if (!item) return reject(new Error('Record not found: ' + resource + '/' + payload.id));
        Object.assign(item, payload.patch);
        persistLocalData();
        return resolve(item);
      }
      if (action === 'remove') {
        const collection = getLocalResource(resource);
        const index = collection.findIndex(item => String(item.id) === String(payload.id));
        if (index === -1) return reject(new Error('Record not found: ' + resource + '/' + payload.id));
        collection.splice(index, 1);
        persistLocalData();
        return resolve({ id: payload.id });
      }
      reject(new Error('Unsupported local action ' + action));
    });
  }

  function post(action, payload) {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) {
      if (isLocalMode) return localPost(action, payload);
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
    register: (account) => post('register', { resource: 'users', account })
  };

  if (hasRemoteBackend) {
    // A real Apps Script backend is configured — data always comes from the
    // sheet, so drop any stale demo/offline data left over in this browser
    // from before the backend was wired up.
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } else if (isLocalMode) {
    loadLocalData();
  }
})(window);
