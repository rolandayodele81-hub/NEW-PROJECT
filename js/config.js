/* PDMS Config — single source of truth for the backend URL, and the
   cache-first data bootstrap: pages render instantly from whatever's
   cached (or the seed data in js/data.js if there's no cache yet), while
   a background fetch refreshes the cache and notifies pages when fresh
   data lands. No page ever blocks on the network. */
(function (global) {
  global.PDMS_API_URL = 'https://script.google.com/macros/s/AKfycbx63abHDM6FNFJ092t02DDkCyFrsPz6k5Pi5vuYan2pybiEnyWkmPibKX5wgfkuE5aK/exec';

  var CACHE_KEY = 'pdms-cache';

  try {
    var cached = localStorage.getItem(CACHE_KEY);
    if (cached) global.PDMS_REMOTE = JSON.parse(cached);
  } catch (e) { /* corrupt cache — fall through to seed data */ }

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
      .catch(function () { /* keep showing cached/seed data if the backend is unreachable */ });
  };

  global.PDMS_REFRESH();
})(window);
