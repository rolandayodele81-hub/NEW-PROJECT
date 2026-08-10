/* PDMS Config — cache-first bootstrap.
   Pages render instantly from localStorage cache; a background fetch
   refreshes the cache and fires pdms:refresh when fresh data lands. */
(function (global) {
  global.PDMS_API_URL = 'https://script.google.com/macros/s/AKfycbx63abHDM6FNFJ092t02DDkCyFrsPz6k5Pi5vuYan2pybiEnyWkmPibKX5wgfkuE5aK/exec';

  var CACHE_KEY = 'pdms-cache';
  var CACHE_TS_KEY = 'pdms-cache-ts';
  var CACHE_TTL = 30 * 1000; // refresh in background if cache is older than 30s

  // ── 1. Serve cache immediately so the page renders without waiting ──────────
  try {
    var cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      var data = JSON.parse(cached);
      global.PDMS_REMOTE = data;
    }
  } catch (e) {
    try { localStorage.removeItem(CACHE_KEY); } catch(_) {}
  }

  // ── 2. Background refresh ───────────────────────────────────────────────────
  global.PDMS_REFRESH = function (force) {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) return;

    // Skip refresh if cache is fresh enough (unless forced)
    if (!force) {
      try {
        var ts = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
        if (Date.now() - ts < CACHE_TTL) return;
      } catch(_) {}
    }

    fetch(global.PDMS_API_URL + '?action=bootstrap')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.ok) throw new Error(json.error || 'Bootstrap failed');
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
          localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        } catch(_) {}
        global.PDMS_REMOTE = json.data;
        if (global.PDMS_DATA) {
          Object.keys(json.data).forEach(function (key) { global.PDMS_DATA[key] = json.data[key]; });
        }
        document.dispatchEvent(new CustomEvent('pdms:refresh', { detail: json.data }));
      })
      .catch(function () {
        if (!global.PDMS_REMOTE && global.PDMS_DATA) {
          global.PDMS_REMOTE = global.PDMS_DATA;
          document.dispatchEvent(new CustomEvent('pdms:refresh', { detail: global.PDMS_DATA }));
        } else if (global.PDMS_REMOTE) {
          // Already have cached data — just notify pages to render with it
          document.dispatchEvent(new CustomEvent('pdms:refresh', { detail: global.PDMS_REMOTE }));
        }
      });
  };

  global.PDMS_REFRESH();
})(window);
