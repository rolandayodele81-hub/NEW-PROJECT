/* PDMS Config — cache-first bootstrap.
   Pages render instantly from localStorage cache; a background fetch
   refreshes the cache and fires pdms:refresh when fresh data lands. */
(function (global) {

  global.PDMS_API_URL = 'https://script.google.com/macros/s/AKfycbzCX2HlT7jSxaBVIo2mdXZu7mcwIUbff0EVdtjHi3jNVTQRyMRrE9ftaum1NprQS8Fp/exec';


  var CACHE_KEY = 'pdms-cache';
  var CACHE_TS_KEY = 'pdms-cache-ts';

  global.PDMS_DATA_LOADED = false;
  global.PDMS_IS_LOADING = true;
  global.PDMS_REMOTE = null;

  // ── Network Fetch ───────────────────────────────────────────────────────────
  function fetchWithRetry(url, retries) {
    retries = retries || 2;
    return fetch(url).catch(function (err) {
      if (retries > 0) {
        return new Promise(function (resolve) { setTimeout(resolve, 800); }).then(function () {
          return fetchWithRetry(url, retries - 1);
        });
      }
      throw err;
    });
  }

  global.PDMS_REFRESH = function (force) {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) return;

    global.PDMS_IS_LOADING = true;
    document.dispatchEvent(new CustomEvent('pdms:loading-start'));

    fetchWithRetry(global.PDMS_API_URL + '?action=bootstrap')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.data) {
          try {
            var recStr = sessionStorage.getItem('pdms_recent_creates') || '{}';
            var recs = JSON.parse(recStr);
            Object.keys(recs).forEach(function(resKey) {
              if (Array.isArray(json.data[resKey]) && Array.isArray(recs[resKey])) {
                recs[resKey].forEach(function(item) {
                  if ((Date.now() - (item._savedAt || 0)) < 180000) {
                    var exists = json.data[resKey].some(function(x) { return String(x.id) === String(item.id); });
                    if (!exists) {
                      json.data[resKey].unshift(item);
                    }
                  }
                });
              }
            });
          } catch (_) {}
        }
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
          localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        } catch (_) { }
        global.PDMS_REMOTE = json.data;
        global.PDMS_DATA_LOADED = true;
        global.PDMS_IS_LOADING = false;
        if (global.PDMS_DATA) {
          Object.keys(json.data).forEach(function (key) { global.PDMS_DATA[key] = json.data[key]; });
        }
        document.dispatchEvent(new CustomEvent('pdms:refresh', { detail: json.data }));
        document.dispatchEvent(new CustomEvent('pdms:data-ready', { detail: json.data }));
        document.dispatchEvent(new CustomEvent('pdms:loading-end'));
      })
      .catch(function (err) {
        console.warn('Live fetch failed, attempting cache fallback:', err);
        global.PDMS_IS_LOADING = false;
        var fallback = null;
        try {
          var cached = localStorage.getItem(CACHE_KEY);
          if (cached) fallback = JSON.parse(cached);
        } catch (_) { }
        if (!fallback && global.PDMS_DATA) fallback = global.PDMS_DATA;
        if (fallback) {
          global.PDMS_REMOTE = fallback;
          global.PDMS_DATA_LOADED = true;
          document.dispatchEvent(new CustomEvent('pdms:refresh', { detail: fallback }));
          document.dispatchEvent(new CustomEvent('pdms:data-ready', { detail: fallback }));
        }
        document.dispatchEvent(new CustomEvent('pdms:loading-end'));
      });
  };

  global.PDMS_REFRESH(true);
})(window);
