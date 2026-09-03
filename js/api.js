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
    reviews: 'RV',
    issues: 'IS'
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
      reviews: global.PDMS_DATA.reviews,
      issues: global.PDMS_DATA.issues
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
        const patch = Object.assign({}, payload.patch);
        if (resource === 'users' && patch.password) {
          patch._localPassword = String(patch.password);
          delete patch.password;
        }
        Object.assign(item, patch);
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

  const CACHE_KEY = 'pdms-cache';

  function fetchWithRetry(url, options, retries = 2) {
    return fetch(url, options).catch(err => {
      if (retries > 0) {
        return new Promise(resolve => setTimeout(resolve, 1000)).then(() => fetchWithRetry(url, options, retries - 1));
      }
      throw err;
    });
  }

  function post(action, payload) {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) {
      if (isLocalMode) return localPost(action, payload);
      return Promise.reject(new Error('Set PDMS_API_URL in js/config.js first'));
    }
    return fetchWithRetry(global.PDMS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids a CORS preflight against Apps Script
      body: JSON.stringify(Object.assign({ action }, payload))
    })
      .then(res => res.json())
      .then(json => {
        if (!json.ok) throw new Error(json.error || 'Request failed');
        try {
          const resKey = payload.resource;
          if (resKey) {
            const syncList = (list) => {
              if (!Array.isArray(list)) return;
              if (action === 'update') {
                const target = list.find(item => String(item.id) === String(payload.id));
                if (target) Object.assign(target, payload.patch, json.data);
              } else if (action === 'create' && json.data) {
                const exists = list.find(item => String(item.id) === String(json.data.id));
                if (!exists) list.unshift(json.data);
              } else if (action === 'remove') {
                const idx = list.findIndex(item => String(item.id) === String(payload.id));
                if (idx !== -1) list.splice(idx, 1);
              }
            };
            if (action === 'create' && json.data) {
              try {
                const recStr = sessionStorage.getItem('pdms_recent_creates') || '{}';
                const recs = JSON.parse(recStr);
                recs[resKey] = recs[resKey] || [];
                recs[resKey] = recs[resKey].filter(x => (Date.now() - (x._savedAt || 0)) < 180000 && String(x.id) !== String(json.data.id));
                recs[resKey].unshift(Object.assign({ _savedAt: Date.now() }, json.data));
                sessionStorage.setItem('pdms_recent_creates', JSON.stringify(recs));
              } catch (_) {}
            }
            if (action === 'update') {
              try {
                const updStr = sessionStorage.getItem('pdms_recent_updates') || '{}';
                const upds = JSON.parse(updStr);
                upds[resKey] = upds[resKey] || [];
                upds[resKey] = upds[resKey].filter(x => (Date.now() - (x._savedAt || 0)) < 180000 && String(x.id) !== String(payload.id));
                upds[resKey].push(Object.assign({ id: payload.id, _savedAt: Date.now() }, payload.patch, json.data));
                sessionStorage.setItem('pdms_recent_updates', JSON.stringify(upds));
              } catch (_) {}
            }
            if (global.PDMS_REMOTE) syncList(global.PDMS_REMOTE[resKey]);
            if (global.PDMS_DATA) syncList(global.PDMS_DATA[resKey]);
            const cachePayload = global.PDMS_REMOTE || global.PDMS_DATA;
            if (cachePayload) {
              localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
              localStorage.setItem('pdms-cache-ts', String(Date.now()));
            }
          }
        } catch (_) {}
        return json.data;
      });
  }

  PDMS.api = {
    create: (resource, record) => post('create', { resource, record }),
    update: (resource, id, patch) => post('update', { resource, id, patch }),
    remove: (resource, id) => post('remove', { resource, id }),
    login: (email, password) => post('login', { email, password }),
    register: (account) => post('register', { resource: 'users', account, appUrl: location.href.replace(/\/[^\/]*$/, '/') })
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
