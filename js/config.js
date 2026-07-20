/* PDMS Config — single source of truth for the backend URL, and the
   cache-first data bootstrap: pages render instantly from whatever's
   cached (or the seed data in js/data.js if there's no cache yet), while
   a background fetch refreshes the cache and notifies pages when fresh
   data lands. No page ever blocks on the network. */
(function (global) {
  const isLocalFile = location.protocol === 'file:';
  const isLocalHost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname);
  const isLocalMode = isLocalFile || isLocalHost;
  const LOCAL_RESET_KEY = 'pdms-local-reset-v2';
  global.PDMS_API_URL = 'https://script.google.com/macros/s/AKfycbx63abHDM6FNFJ092t02DDkCyFrsPz6k5Pi5vuYan2pybiEnyWkmPibKX5wgfkuE5aK/exec';

  var CACHE_KEY = 'pdms-cache';

  try {
    // Bypassing localStorage cache to ensure we always retrieve directly from the Google Sheet
  } catch (e) { /* corrupt cache — fall through to seed data */ }

  function resetLocalDataIfStale() {
    if (!isLocalMode) return;
    if (localStorage.getItem(LOCAL_RESET_KEY) === 'done') return;
    try {
      const raw = localStorage.getItem('pdms-local-data');
      if (raw) {
        localStorage.removeItem('pdms-local-data');
        localStorage.removeItem('pdms-user');
      } else {
        localStorage.removeItem('pdms-user');
      }
    } catch (e) {
      localStorage.removeItem('pdms-local-data');
      localStorage.removeItem('pdms-user');
    }
    localStorage.setItem(LOCAL_RESET_KEY, 'done');
  }

  if (isLocalMode) {
    localStorage.removeItem(CACHE_KEY);
    resetLocalDataIfStale();
    global.PDMS_REMOTE = null;
  }

  global.PDMS_REFRESH = function () {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) return;
    fetch(global.PDMS_API_URL + '?action=bootstrap')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.ok) throw new Error(json.error || 'Bootstrap failed');
        localStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
        global.PDMS_REMOTE = json.data;
        if (global.PDMS_DATA) {
          Object.keys(json.data).forEach(function (key) { global.PDMS_DATA[key] = json.data[key]; });
        }
        document.dispatchEvent(new CustomEvent('pdms:refresh', { detail: json.data }));
      })
      .catch(function () {
        /* keep showing cached/seed data if the backend is unreachable */
        document.dispatchEvent(new CustomEvent('pdms:loading-end'));
      });
  };

  global.PDMS_REFRESH();
})(window);
