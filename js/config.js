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

  // Fold any just-created records (kept in sessionStorage by js/api.js for ~3min)
  // into a data payload, so a record the user created a moment ago shows up even
  // before the server round-trip that persists it has completed.
  function mergeRecentCreates(data) {
    if (!data) return data;
    try {
      var recs = JSON.parse(sessionStorage.getItem('pdms_recent_creates') || '{}');
      Object.keys(recs).forEach(function (resKey) {
        if (!Array.isArray(data[resKey]) || !Array.isArray(recs[resKey])) return;
        recs[resKey].forEach(function (item) {
          if ((Date.now() - (item._savedAt || 0)) >= 180000) return;
          if (!data[resKey].some(function (x) { return String(x.id) === String(item.id); })) {
            data[resKey].unshift(item);
          }
        });
      });
    } catch (_) { }
    return data;
  }

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

    // Cache-first paint: if we have a previous good payload, render from it
    // immediately so the user never stares at a blank screen while the
    // (sometimes slow) Apps Script bootstrap request is in flight. The network
    // response below overwrites it with fresh data when it lands.
    if (!global.PDMS_REMOTE) {
      try {
        var cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          var cachedData = JSON.parse(cachedRaw);
          if (cachedData && typeof cachedData === 'object') {
            mergeRecentCreates(cachedData);
            global.PDMS_REMOTE = cachedData;
            global.PDMS_DATA_LOADED = true;
            if (global.PDMS_DATA) {
              Object.keys(cachedData).forEach(function (key) { global.PDMS_DATA[key] = cachedData[key]; });
            }
            document.dispatchEvent(new CustomEvent('pdms:refresh', { detail: cachedData }));
            document.dispatchEvent(new CustomEvent('pdms:data-ready', { detail: cachedData }));
          }
        }
      } catch (_) { }
    }

    fetchWithRetry(global.PDMS_API_URL + '?action=bootstrap')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        mergeRecentCreates(json.data);
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
          mergeRecentCreates(fallback);
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
