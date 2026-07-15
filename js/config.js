/* PDMS Config — single source of truth for the backend URL, and the
   cache-first data bootstrap: pages render instantly from whatever's
   cached (or the seed data in js/data.js if there's no cache yet), while
   a background fetch refreshes the cache and notifies pages when fresh
   data lands. No page ever blocks on the network. */
(function (global) {
  global.PDMS_API_URL = 'http://localhost:4000/api';

  var CACHE_KEY = 'pdms-cache';

  global.PDMS_REFRESH = function () {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) return;
    fetch(global.PDMS_API_URL + '/bootstrap', { credentials: 'include' })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.error) throw new Error(json.error || 'Bootstrap failed');
        localStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
        global.PDMS_REMOTE = json.data;
        if (global.PDMS_DATA) {
          Object.keys(json.data).forEach(function (key) { global.PDMS_DATA[key] = json.data[key]; });
        }
        document.dispatchEvent(new CustomEvent('pdms:refresh', { detail: json.data }));
      })
      .catch(function () { /* keep showing cached/seed data if the backend is unreachable */ });
  };

  global.PDMS_REFRESH();
})(window);
