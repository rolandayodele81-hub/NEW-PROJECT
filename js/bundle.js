/* PDMS Config — cache-first bootstrap.
   Pages render instantly from localStorage cache; a background fetch
   refreshes the cache and fires pdms:refresh when fresh data lands. */
(function (global) {

  global.PDMS_API_URL = 'https://script.google.com/macros/s/AKfycbzCX2HlT7jSxaBVIo2mdXZu7mcwIUbff0EVdtjHi3jNVTQRyMRrE9ftaum1NprQS8Fp/exec';


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
    try { localStorage.removeItem(CACHE_KEY); } catch (_) { }
  }

  // ── 2. Background refresh ───────────────────────────────────────────────────
  function fetchWithRetry(url, retries) {
    retries = retries || 2;
    return fetch(url).catch(function (err) {
      if (retries > 0) {
        return new Promise(function (resolve) { setTimeout(resolve, 1000); }).then(function () {
          return fetchWithRetry(url, retries - 1);
        });
      }
      throw err;
    });
  }

  global.PDMS_REFRESH = function (force) {
    if (!global.PDMS_API_URL || global.PDMS_API_URL.indexOf('REPLACE_WITH') === 0) return;

    // Skip refresh if cache is fresh enough (unless forced)
    if (!force) {
      try {
        var ts = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
        if (Date.now() - ts < CACHE_TTL) return;
      } catch (_) { }
    }

    fetchWithRetry(global.PDMS_API_URL + '?action=bootstrap')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.ok) throw new Error(json.error || 'Bootstrap failed');
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
          localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        } catch (_) { }
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
/* ============================================
   PSE PDMS - Data Schema
   ============================================ */
(function(global){
  const roles = ['System Administrator','HR','COO','HTD','PM Head','PMO','Accounts','Sales','Sales Head','Consultant'];
  const types = ['ERP','SAPT','Surveillance/ recertification','Software development','Management System'];
  const priorities = ['Critical','High','Medium','Low'];
  const workstreams = ['Cloud Engineering','Cybersecurity','Data Analytics','Digital Transformation','ERP Implementation','Infrastructure','Mobile Development','Software Development','Web Platform','Business Consulting','General'];
  const salesJourney = ['Lead','Opportunity','Initial Proposal','Negotiation','Invoicing','Award/SLA','Closed'];
  const salesStatusAliases = {
    'Incoming': 'Lead',
    'Initial Contact': 'Lead',
    'Requirement Gathering': 'Opportunity',
    'Proposal Sent': 'Initial Proposal',
    'Awaiting Client Approval': 'Award/SLA',
    'PO / Award Granted': 'Award/SLA',
    'SLA Signed': 'Award/SLA',
    'Awaiting Account Approval': 'Award/SLA'
  };
  const salesStatuses = [...salesJourney, 'On Hold','Cancelled'];
  const deliveryStatuses = ['Not Started','In Progress','On Hold','Awaiting Review','Internal Audit','External Audit','Testing / Quality Assurance','Completed','Closed','Cancelled'];
  const inProgressSubStatuses = ['Design','Development','Testing / QA / Internal Testing','Deployment','UAT','Release'];
  const statuses = [...salesStatuses, ...deliveryStatuses.filter(s=>!salesStatuses.includes(s))];
  const statusColors = {
    'Initial Proposal':'primary','Lead':'info','Opportunity':'purple',
    'Negotiation':'warn','Invoicing':'warn','Award/SLA':'success',
    'Awaiting Sales Head Approval':'warn','Awaiting Account Approval':'purple',
    'Closed':'primary','Cancelled':'danger','On Hold':'muted',
    'Not Started':'muted','In Progress':'warn','Awaiting Review':'warn',
    'Testing / Quality Assurance':'purple','Completed':'success',
    'Internal Audit':'info','External Audit':'warn'
  };
  Object.assign(statusColors, {
    'Incoming':'info','Initial Contact':'info','Requirement Gathering':'purple',
    'Proposal Sent':'primary','Awaiting Client Approval':'success',
    'PO / Award Granted':'success','SLA Signed':'success'
  });
  const prioColors = {'Critical':'prio-critical','High':'prio-high','Medium':'prio-medium','Low':'prio-low'};

  function normalizeStatus(status){
    return salesStatusAliases[status] || status;
  }

  // -----------------------------
  // Persisted data collections
  // Populated from window.PDMS_REMOTE (loaded by js/config.js's bootstrap
  // <script> tag) when the Apps Script backend is reachable; otherwise
  // falls back to the seed data below so the app still runs standalone.
  // -----------------------------

  function loadCollection(key, fallback){
    const remote = global.PDMS_REMOTE && global.PDMS_REMOTE[key];
    return Array.isArray(remote) ? remote : (fallback||[]);
  }

  const departments = loadCollection('departments', []);
  const users = loadCollection('users', [{
    id: 'U001',
    name: 'HR Manager',
    email: 'hr@pse.com',
    role: 'HR',
    dept: 'Human Resources',
    status: 'Active',
    availability: 'Available',
    workload: 0,
    phone: '',
    joined: '2026-01-15',
    _localPassword: 'HR@2026!'
  }]);
  const consultants = loadCollection('consultants', []);
  const clients = loadCollection('clients', []);
  const projects = loadCollection('projects', []).reverse();
  const notifications = loadCollection('notifications', []);
  const threads = loadCollection('threads', []);
  const activities = loadCollection('activities', []);
  const reviews = loadCollection('reviews', []);
  const issues = loadCollection('issues', []);

  function tasksFor(projectId){
    return [];
  }

  global.PDMS_DATA = {
    departments, users, consultants, clients, projects,
    notifications, threads, activities, reviews, issues,
    roles, types, priorities, workstreams, statuses, salesJourney, salesStatuses, salesStatusAliases, deliveryStatuses,
    statusColors, prioColors,
    tasksFor
  };
  global.PDMS = global.PDMS || {};
  global.PDMS.normalizeStatus = normalizeStatus;
})(window);/* PDMS Utils */
(function(g){
  const PDMS = g.PDMS = g.PDMS || {};

  // Feather-like inline SVG icons
  const ICONS = {
    dashboard:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
    folder:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    users:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    building:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>',
    briefcase:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    chart:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    bell:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    message:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    settings:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    user:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    activity:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    search:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    menu:'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    moon:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    sun:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    plus:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    check:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    clock:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    trending:'<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    logout:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    close:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    upload:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    download:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    refresh:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    'user-plus':'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
    calendar:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    filter:'<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    file:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    shield:'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    globe:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    send:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    zap:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    mail:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>',
    phone:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
  };

  PDMS.icon = function(name){ return ICONS[name]||''; };

  // Theme
  PDMS.applyTheme = function(){
    const t = localStorage.getItem('pdms-theme')||'light';
    document.documentElement.setAttribute('data-theme',t);
  };
  PDMS.toggleTheme = function(){
    const cur = localStorage.getItem('pdms-theme')||'light';
    const next = cur==='light'?'dark':'light';
    localStorage.setItem('pdms-theme',next);
    document.documentElement.setAttribute('data-theme',next);
    const btn=document.getElementById('themeToggle');
    if(btn) btn.innerHTML = PDMS.icon(next==='light'?'moon':'sun');
  };
  PDMS.applyTheme();

  // Auth
  // Current session only — the shared dataset (including Users) lives in
  // Google Sheets via PDMS.api; this is just "who's logged in on this browser".
  PDMS.getUser = function(){
    try{ return JSON.parse(localStorage.getItem('pdms-user'))||null; }catch(e){return null;}
  };
  PDMS.setUser = function(u){ localStorage.setItem('pdms-user',JSON.stringify(u)); };
  PDMS.getLocalAuthUsers = function(){
    const base = [];
    const persisted = (window.PDMS_DATA && Array.isArray(window.PDMS_DATA.users)) ? window.PDMS_DATA.users.filter(u => u._localPassword).map(u => Object.assign({}, u)) : [];
    const emails = new Set(persisted.map(u => String(u.email || '').trim().toLowerCase()));
    base.forEach(u => {
      if (!emails.has(String(u.email || '').trim().toLowerCase())) persisted.unshift(u);
    });
    return persisted;
  };
  const isLocalFile = location.protocol === 'file:';
  const isLocalHost = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname);
  const isLocalMode = isLocalFile || isLocalHost;
  PDMS.getUsers = function(){
    const users = (window.PDMS_DATA && Array.isArray(window.PDMS_DATA.users)) ? window.PDMS_DATA.users.slice() : [];
    if (isLocalMode) {
      const local = PDMS.getLocalAuthUsers();
      const emails = new Set(users.map(u => String(u.email||'').trim().toLowerCase()));
      local.forEach(u => {
        if (!emails.has(String(u.email||'').trim().toLowerCase())) users.push(u);
      });
      return users;
    }
    const remote = users;
    const local = PDMS.getLocalAuthUsers();
    const emails = new Set(remote.map(u => String(u.email||'').trim().toLowerCase()));
    local.forEach(u => {
      if (!emails.has(String(u.email||'').trim().toLowerCase())) remote.push(u);
    });
    return remote;
  };
  PDMS.findUserByEmail = function(email){
    const e = String(email||'').trim().toLowerCase();
    return PDMS.getUsers().find(u => String(u.email||'').trim().toLowerCase() === e);
  };
  PDMS.findLocalAuthUser = function(email,password){
    const e = String(email||'').trim().toLowerCase();
    return PDMS.getLocalAuthUsers().find(u =>
      String(u.email||'').trim().toLowerCase() === e && String(u._localPassword||'') === String(password)
    );
  };
  // Both return Promises — the backend hashes/verifies passwords, the client never sees a hash.
  PDMS.authenticate = function(email,password){
    return PDMS.api.login(email,password).catch(function(err){
      const user = PDMS.findLocalAuthUser(email,password);
      if(user){
        const fallback = Object.assign({}, user);
        delete fallback._localPassword;
        return Promise.resolve(fallback);
      }
      return Promise.reject(err);
    });
  };
  PDMS.registerUser = function(account){ return PDMS.api.register(account); };
  PDMS.isAdmin = function(){ const user = PDMS.getUser(); return user && user.role==='System Administrator'; };
  PDMS.requireAdmin = function(){ if(!PDMS.isAdmin()) location.href='dashboard.html'; };
  PDMS.requireRole = function(role){ const user = PDMS.getUser(); if(!user || user.role !== role){ location.href = PDMS.dashboardFor(user); return null; } return user; };
  PDMS.logout = function(){ localStorage.removeItem('pdms-user'); location.href='index.html'; };
  PDMS.requireAuth = function(){
    const user = PDMS.getUser();
    if(!user){ location.href='index.html'; return null; }
    return user;
  };

  // Renders immediately with whatever's available (cached or seed data),
  // then re-renders whenever js/config.js's background fetch lands fresh data.
  PDMS.onRefresh = function(renderFn){
    renderFn();
    document.addEventListener('pdms:refresh', renderFn);
  };

  // Toast
  PDMS.toast = function(title,msg,type){
    let box=document.querySelector('.toasts');
    if(!box){ box=document.createElement('div'); box.className='toasts'; document.body.appendChild(box); }
    const t=document.createElement('div');
    t.className='toast '+(type||'');
    const icon = type==='success'?'check':type==='error'?'close':type==='warn'?'bell':'zap';
    t.innerHTML = '<div class="t-icon">'+ICONS[icon]+'</div><div><div class="t-title">'+title+'</div><div class="t-msg">'+(msg||'')+'</div></div>';
    box.appendChild(t);
    setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(20px)'; setTimeout(()=>t.remove(),300); },3500);
  };

  // Disables a button and swaps its label while an async action is in
  // flight, so a slow request can't be triggered twice by repeated clicks.
  PDMS.setButtonLoading = function(btn, isLoading, label){
    if(!btn) return;
    if(isLoading){
      if(btn.dataset.originalHtml===undefined) btn.dataset.originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = label || 'Loading...';
    } else {
      btn.disabled = false;
      if(btn.dataset.originalHtml!==undefined){ btn.innerHTML = btn.dataset.originalHtml; delete btn.dataset.originalHtml; }
    }
  };

  // Real bootstrap data hasn't arrived yet (g.PDMS_REMOTE is only set once the
  // background fetch in config.js resolves) — an empty array at this point means
  // "still loading", not "genuinely nothing here". Every "No X yet" empty state
  // should route through this so it doesn't misrepresent one as the other.
  PDMS.emptyOrLoading = function(emptyMessage){
    return g.PDMS_REMOTE ? emptyMessage : '<span class="pdms-spinner" style="margin-right:8px;vertical-align:-2px"></span>Loading...';
  };

  // Broadcast a notification to all users — fires and forgets (never blocks the caller).
  // icon: any key from ICONS; link: optional href the notification card links to.
  PDMS.notify = function(title, msg, icon, link){
    const user = PDMS.getUser();
    const record = {
      title, msg,
      icon: icon || 'bell',
      link: link || '',
      actor: user ? user.name : 'System',
      actorRole: user ? user.role : '',
      time: new Date().toISOString(),
      unread: true
    };
    PDMS.api.create('notifications', record).then(saved=>{
      if(window.PDMS_DATA && Array.isArray(window.PDMS_DATA.notifications)){
        window.PDMS_DATA.notifications.unshift(saved);
      }
    }).catch(()=>{}); // silent — notifications are best-effort
  };

  // Money & date fmt
  PDMS.money = n => '$'+Number(n).toLocaleString();
  PDMS.currency = function(val, symbol = '₦'){
    if (val === null || val === undefined || val === '') return '—';
    const n = Number(val);
    if (!Number.isFinite(n)) return String(val);
    return symbol + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  PDMS.formatCurrency = PDMS.currency;
  PDMS.initials = name => (name||'').split(' ').filter(Boolean).map(p=>p[0]).slice(0,2).join('').toUpperCase();

  // Escape HTML
  PDMS.esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Table renderer
  PDMS.renderTable = function(container, opts){
    // opts: {columns:[{key,label,render?,sortable?}], rows, pageSize, searchKeys}
    const state = { page:1, sortKey:null, sortDir:1, filter:'', filters:opts.filters||{} };
    const pageSize = opts.pageSize||10;

    function filtered(){
      let arr = opts.rows.slice();
      if(state.filter){
        const q = state.filter.toLowerCase();
        arr = arr.filter(r=>(opts.searchKeys||Object.keys(r)).some(k=>String(r[k]||'').toLowerCase().includes(q)));
      }
      Object.keys(state.filters).forEach(k=>{
        if(state.filters[k]) {
          arr = arr.filter(r => {
            const v = String(r[k] || '');
            if (k === 'status' && state.filters[k] === 'Award/SLA') {
              return v === 'Award/SLA' || v === 'Awaiting Account Approval';
            }
            if (k === 'status' && state.filters[k] === 'Closed') {
              return v === 'Closed' || r.stage === 'Delivery' || (window.D && window.D.deliveryStatuses && window.D.deliveryStatuses.includes(v) && v !== 'Awaiting Account Approval');
            }
            return v === state.filters[k];
          });
        }
      });
      if(state.sortKey){
        arr.sort((a,b)=>{
          const va=a[state.sortKey],vb=b[state.sortKey];
          if(va<vb)return -1*state.sortDir; if(va>vb)return 1*state.sortDir; return 0;
        });
      }
      return arr;
    }

    function render(){
      const arr = filtered();
      const totalPages = Math.max(1,Math.ceil(arr.length/pageSize));
      if(state.page>totalPages) state.page=totalPages;
      const slice = arr.slice((state.page-1)*pageSize, state.page*pageSize);
      const filterHtml = (opts.filterOptions||[]).map(f=>{
        const opts2 = ['<option value="">All '+f.label+'</option>'].concat(f.options.map(o=>'<option value="'+PDMS.esc(o)+'"'+(state.filters[f.key]===o?' selected':'')+'>'+PDMS.esc(o)+'</option>'));
        return '<select class="select" data-filter="'+f.key+'">'+opts2.join('')+'</select>';
      }).join('');
      container.innerHTML =
        '<div class="table-tools">'+
          '<div class="search-mini">'+ICONS.search+'<input placeholder="Search..." value="'+PDMS.esc(state.filter)+'"></div>'+
          filterHtml+
          '<button class="btn btn-secondary btn-sm" data-act="export">'+ICONS.download+' Export CSV</button>'+
          '<button class="btn btn-secondary btn-sm" data-act="print">Print</button>'+
        '</div>'+
        '<div style="overflow-x:auto"><table class="data"><thead><tr>'+
        opts.columns.map(c=>'<th data-key="'+c.key+'">'+c.label+(state.sortKey===c.key?(state.sortDir>0?' ↑':' ↓'):'')+'</th>').join('')+
        '</tr></thead><tbody>'+
        (slice.length?slice.map(r=>{
          const rowAttr = opts.rowHref ? ' style="cursor:pointer" onclick="location.href=\''+opts.rowHref(r)+'\'"' : '';
          return '<tr'+rowAttr+'>'+opts.columns.map(c=>'<td>'+(c.render?c.render(r):PDMS.esc(r[c.key]??''))+'</td>').join('')+'</tr>';
        }).join('')
          :'<tr><td colspan="'+opts.columns.length+'">'+(g.PDMS_REMOTE?'<div style="text-align:center;padding:32px;color:var(--text-muted)">No data available</div>':'<div class="pdms-loading-inline"><span class="pdms-spinner"></span>Loading...</div>')+'</td></tr>')+
        '</tbody></table></div>'+
        '<div class="pagination"><div>Showing '+((state.page-1)*pageSize+1)+'-'+Math.min(state.page*pageSize,arr.length)+' of '+arr.length+'</div><div class="pages">'+
        '<button class="page-btn" data-p="prev">‹</button>'+
        Array.from({length:totalPages},(_,i)=>'<button class="page-btn '+(state.page===i+1?'active':'')+'" data-p="'+(i+1)+'">'+(i+1)+'</button>').slice(Math.max(0,state.page-3),state.page+2).join('')+
        '<button class="page-btn" data-p="next">›</button>'+
        '</div></div>';

      container.querySelector('input').addEventListener('input',e=>{state.filter=e.target.value;state.page=1;render();});
      container.querySelectorAll('th').forEach(th=>th.addEventListener('click',()=>{
        const k=th.dataset.key;
        if(state.sortKey===k) state.sortDir=-state.sortDir; else {state.sortKey=k;state.sortDir=1;}
        render();
      }));
      container.querySelectorAll('[data-filter]').forEach(sel=>sel.addEventListener('change',e=>{
        state.filters[e.target.dataset.filter]=e.target.value; state.page=1; render();
      }));
      container.querySelectorAll('.page-btn').forEach(b=>b.addEventListener('click',()=>{
        const p=b.dataset.p;
        if(p==='prev') state.page=Math.max(1,state.page-1);
        else if(p==='next') state.page=Math.min(totalPages,state.page+1);
        else state.page=parseInt(p);
        render();
      }));
      container.querySelector('[data-act="export"]').addEventListener('click',()=>{
        const rows = filtered();
        const csv = [opts.columns.map(c=>c.label).join(',')].concat(
          rows.map(r=>opts.columns.map(c=>{
            const v = c.exportValue?c.exportValue(r):(r[c.key]??'');
            return '"'+String(v).replace(/"/g,'""')+'"';
          }).join(','))
        ).join('\n');
        const blob = new Blob([csv],{type:'text/csv'});
        const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='export.csv';a.click();
        PDMS.toast('Exported','CSV downloaded','success');
      });
      container.querySelector('[data-act="print"]').addEventListener('click',()=>window.print());
    }
    render();
  };

  // Modal
  PDMS.modal = function(title, bodyHtml, footHtml, opts = {}){
    const back=document.createElement('div');
    back.className='modal-backdrop open';
    back.innerHTML = '<div class="modal"><div class="modal-head"><h3 class="card-title">'+title+'</h3></div><div class="modal-body">'+bodyHtml+'</div>'+(footHtml?'<div class="modal-foot">'+footHtml+'</div>':'')+'</div>';
    document.body.appendChild(back);
    back.addEventListener('click',e=>{ if(e.target.closest('[data-close]')) back.remove(); });
    return back;
  };

  // Multi-step Sales Project Onboarding Wizard
  // Multi-step Sales Project Onboarding Wizard
  PDMS.openSalesProjectWizard = function(opts = {}){
    const currentUser = PDMS.getUser();
    if (!currentUser || !currentUser.id) {
      PDMS.toast('Session expired', 'Please sign in again before creating a project.', 'error');
      return;
    }
    const D = window.PDMS_DATA || {};
    const I = PDMS.icon;
    let modalRef = null;

    let wizardState = {
      step: 1, // 1: choose client type, 2: client form (new/existing), 3: project form
      clientMode: null, // 'new' or 'existing'
      selectedClient: null, // { name, industry, email, phone, address, workedBefore }
      newClientForm: { name: '', industry: '', email: '', phone: '', address: '', workedBefore: false },
      projForm: { type: (D.types && D.types[0]) || 'ERP', workstream: '', status: (D.salesStatuses && D.salesStatuses[0]) || 'Lead', price: '', desc: '' }
    };

    function renderModal() {
      if (modalRef) modalRef.remove();

      let title = 'Create New Lead';
      let bodyHtml = '';
      let footHtml = '';

      if (wizardState.step === 1) {
        title = 'Create New Lead';
        bodyHtml = `
          <div style="background:linear-gradient(135deg,#090d16 0%,#1d3c88 45%,#8b5cf6 85%,#ec4899 100%);border-radius:14px;padding:20px 22px;color:#fff;margin-bottom:20px;position:relative;overflow:hidden">
            <div style="font-size:17px;font-weight:800;line-height:1.2;margin-bottom:4px">Create New Lead</div>
            <div style="font-size:12px;color:rgba(255,255,255,.8)">Step 1 of 2 · Select whether this lead is for a new or existing client</div>
          </div>
          <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:14px">Is this lead for a new or existing client?</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:12px">
            <div id="swChoiceExisting" class="sw-choice-card" style="border:2px solid ${wizardState.clientMode === 'existing' ? 'var(--primary)' : 'var(--border)'};border-radius:14px;padding:20px 16px;cursor:pointer;background:${wizardState.clientMode === 'existing' ? 'rgba(99,102,241,.08)' : 'var(--surface-2)'};text-align:center;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:8px">
              <div style="width:48px;height:48px;border-radius:12px;background:rgba(99,102,241,.12);color:var(--primary);display:grid;place-items:center;font-size:22px">${I('briefcase')}</div>
              <div style="font-weight:700;font-size:15px;color:var(--text)">Existing Client</div>
              <div style="font-size:12px;color:var(--text-soft);line-height:1.4">Select an enterprise partner already in your system</div>
            </div>
            <div id="swChoiceNew" class="sw-choice-card" style="border:2px solid ${wizardState.clientMode === 'new' ? '#10b981' : 'var(--border)'};border-radius:14px;padding:20px 16px;cursor:pointer;background:${wizardState.clientMode === 'new' ? 'rgba(16,185,129,.08)' : 'var(--surface-2)'};text-align:center;transition:all .15s;display:flex;flex-direction:column;align-items:center;gap:8px">
              <div style="width:48px;height:48px;border-radius:12px;background:rgba(16,185,129,.12);color:#10b981;display:grid;place-items:center;font-size:22px">${I('plus')}</div>
              <div style="font-weight:700;font-size:15px;color:var(--text)">New Client</div>
              <div style="font-size:12px;color:var(--text-soft);line-height:1.4">Register a new client company before creating the lead</div>
            </div>
          </div>
        `;
        footHtml = `
          <button class="btn btn-ghost" data-close style="margin-right:auto">Cancel</button>
          <button class="btn btn-primary" id="swStep1NextBtn" ${!wizardState.clientMode ? 'disabled' : ''}>Next →</button>
        `;
      } else if (wizardState.step === 2 && wizardState.clientMode === 'new') {
        title = 'Register New Client';
        bodyHtml = `
          <div style="background:linear-gradient(135deg,#090d16 0%,#065f46 50%,#10b981 100%);border-radius:14px;padding:18px 22px;color:#fff;margin-bottom:20px">
            <div style="font-size:17px;font-weight:800;line-height:1.2;margin-bottom:4px">Step 1 of 2: Create Client</div>
            <div style="font-size:12px;color:rgba(255,255,255,.8)">Enter organization profile details for the new client</div>
          </div>
          <div class="form-grid">
            <div class="form-row" style="grid-column:1/-1">
              <label>Client Name <span style="color:var(--danger)">*</span></label>
              <input id="swNewName" value="${PDMS.esc(wizardState.newClientForm.name || '')}" placeholder="e.g. Apex Global Bank" autocomplete="off"/>
            </div>
            <div class="form-row">
              <label>Industry <span style="color:var(--danger)">*</span></label>
              <input id="swNewIndustry" value="${PDMS.esc(wizardState.newClientForm.industry || '')}" placeholder="e.g. Financial Services"/>
            </div>
            <div class="form-row">
              <label>Email Address</label>
              <input id="swNewEmail" type="email" value="${PDMS.esc(wizardState.newClientForm.email || '')}" placeholder="contact@company.com"/>
            </div>
            <div class="form-row">
              <label>Phone Number</label>
              <input id="swNewPhone" type="tel" value="${PDMS.esc(wizardState.newClientForm.phone || '')}" placeholder="+234 ..."/>
            </div>
            <div class="form-row">
              <label>Office Address</label>
              <input id="swNewAddress" value="${PDMS.esc(wizardState.newClientForm.address || '')}" placeholder="City, Country"/>
            </div>
            <div class="form-row" style="grid-column:1/-1;margin-top:6px;padding:12px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:10px">
              <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin:0;user-select:none">
                <input type="checkbox" id="swNewWorkedBefore" ${wizardState.newClientForm.workedBefore ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--primary);cursor:pointer"/>
                <span style="font-weight:600;color:var(--text);font-size:13px">We have worked with this client before</span>
              </label>
              <div style="font-size:11px;color:var(--text-soft);margin-left:28px;margin-top:2px">
                Check this if PSE previously delivered projects or services for this client prior to entering them into this new system.
              </div>
            </div>
          </div>
        `;
        footHtml = `
          <button class="btn btn-ghost" data-close style="margin-right:auto">Cancel</button>
          <button class="btn btn-secondary" id="swBackBtn">← Back</button>
          <button class="btn btn-primary" id="swCreateClientNextBtn">Next: Lead Details →</button>
        `;
      } else if (wizardState.step === 2 && wizardState.clientMode === 'existing') {
        title = 'Select Existing Client';
        const clients = (D.clients || []);
        bodyHtml = `
          <div style="background:linear-gradient(135deg,#090d16 0%,#1d3c88 45%,#8b5cf6 100%);border-radius:14px;padding:18px 22px;color:#fff;margin-bottom:20px">
            <div style="font-size:17px;font-weight:800;line-height:1.2;margin-bottom:4px">Step 1 of 2: Choose Existing Client</div>
            <div style="font-size:12px;color:rgba(255,255,255,.8)">Pick a client from your registered enterprise partners</div>
          </div>
          <div class="form-row" style="margin-bottom:14px">
            <label>Search Client</label>
            <input id="swSearchExisting" placeholder="Type client name or industry to filter..." autocomplete="off"/>
          </div>
          <div id="swExistingList" style="max-height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:12px;display:flex;flex-direction:column;gap:4px;padding:6px;background:var(--surface-2)">
            ${clients.map(c => `
              <div class="sw-client-item ${wizardState.selectedClient && wizardState.selectedClient.name === c.name ? 'active' : ''}" data-name="${PDMS.esc(c.name)}" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;background:${wizardState.selectedClient && wizardState.selectedClient.name === c.name ? 'var(--surface)' : 'transparent'};border:1px solid ${wizardState.selectedClient && wizardState.selectedClient.name === c.name ? 'var(--primary)' : 'transparent'};transition:all .15s">
                <div style="display:flex;align-items:center;gap:10px;min-width:0">
                  <div style="width:32px;height:32px;border-radius:8px;background:var(--gradient);color:#fff;display:grid;place-items:center;font-weight:700;font-size:11px;flex-shrink:0">${PDMS.initials(c.name)}</div>
                  <div style="min-width:0">
                    <div style="font-weight:700;font-size:13px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${PDMS.esc(c.name)}${c.workedBefore ? ' <span style="font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;background:rgba(99,102,241,.12);color:var(--primary)">Prior Client</span>' : ''}</div>
                    <div style="font-size:11px;color:var(--text-soft)">${PDMS.esc(c.industry || 'Client')}</div>
                  </div>
                </div>
                ${wizardState.selectedClient && wizardState.selectedClient.name === c.name ? `<span style="color:var(--primary);font-size:16px;font-weight:800">✓</span>` : ''}
              </div>
            `).join('') || `<div style="padding:20px;text-align:center;color:var(--text-soft);font-size:13px">No registered clients found. Please go back and create a new client.</div>`}
          </div>
          ${wizardState.selectedClient ? `
            <div style="margin-top:12px;padding:10px 14px;background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.25);border-radius:10px;display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:12px;font-weight:600;color:var(--primary)">Selected: <strong>${PDMS.esc(wizardState.selectedClient.name)}</strong> (${PDMS.esc(wizardState.selectedClient.industry || '—')})${wizardState.selectedClient.workedBefore ? ' · Prior Client' : ''}</span>
            </div>
          ` : ''}
        `;
        footHtml = `
          <button class="btn btn-ghost" data-close style="margin-right:auto">Cancel</button>
          <button class="btn btn-secondary" id="swBackBtn">← Back</button>
          <button class="btn btn-primary" id="swSelectClientNextBtn" ${!wizardState.selectedClient ? 'disabled' : ''}>Next: Lead Details →</button>
        `;
      } else if (wizardState.step === 3) {
        title = 'Step 2 of 2: Lead Details';
        const clientName = (wizardState.selectedClient && wizardState.selectedClient.name) || '';
        const clientIndustry = (wizardState.selectedClient && wizardState.selectedClient.industry) || '';
        const isPrior = !!(wizardState.selectedClient && wizardState.selectedClient.workedBefore);
        const statusOptions = (D.salesStatuses || []);
        bodyHtml = `
          <div style="background:linear-gradient(135deg,#090d16 0%,#1d3c88 45%,#8b5cf6 85%,#ec4899 100%);border-radius:14px;padding:18px 22px;color:#fff;margin-bottom:16px">
            <div style="font-size:17px;font-weight:800;line-height:1.2;margin-bottom:4px">Lead Scope &amp; Details</div>
            <div style="font-size:12px;color:rgba(255,255,255,.8)">Step 2 of 2 · Complete information to create this lead</div>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--surface-2);border:1.5px solid var(--border);border-radius:12px;margin-bottom:16px">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:38px;height:38px;border-radius:10px;background:var(--gradient);color:#fff;display:grid;place-items:center;font-weight:700;font-size:13px;flex-shrink:0">${PDMS.initials(clientName)}</div>
              <div>
                <div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-soft);letter-spacing:.5px;display:flex;align-items:center;gap:8px">
                  <span>Client Partner</span>
                  <span class="badge ${wizardState.clientMode === 'new' ? 'badge-success' : 'badge-primary'}" style="font-size:10px;padding:2px 7px">${wizardState.clientMode === 'new' ? 'New Client' : 'Existing Client'}</span>
                  ${isPrior ? `<span class="badge badge-info" style="font-size:10px;padding:2px 7px">Worked Before</span>` : ''}
                </div>
                <div style="font-weight:700;font-size:15px;color:var(--text);margin-top:2px">
                  ${PDMS.esc(clientName)} <span style="font-size:12px;font-weight:500;color:var(--text-soft)">(${PDMS.esc(clientIndustry)})</span>
                </div>
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" id="swChangeClientBtn" style="font-size:11px;padding:4px 10px">Change</button>
          </div>

          <div class="form-grid">
            <div class="form-row">
              <label>Client Status</label>
              <div style="padding:9px 12px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;font-size:13px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:8px">
                <span style="width:8px;height:8px;border-radius:50%;background:${wizardState.clientMode === 'new' ? '#10b981' : 'var(--primary)'};flex-shrink:0"></span>
                <span>${wizardState.clientMode === 'new' ? (isPrior ? 'New Client (Worked with before)' : 'New Client') : 'Existing Client'}</span>
              </div>
            </div>
            <div class="form-row">
              <label>Project Type</label>
              <select id="swProjType">
                ${(D.types || []).map(t => `<option${t === wizardState.projForm.type ? ' selected' : ''}>${t}</option>`).join('')}
              </select>
            </div>
            <div class="form-row">
              <label>Workstream</label>
              <input id="swProjDept" type="text" value="${PDMS.esc(wizardState.projForm.workstream || '')}" placeholder="e.g. QMS, FSMS, ISO..." />
            </div>
            <div class="form-row">
              <label>Initial Stage / Status</label>
              <select id="swProjStatus">${statusOptions.map(s => `<option${s === wizardState.projForm.status ? ' selected' : ''}>${s}</option>`).join('')}</select>
            </div>
            <div class="form-row" style="grid-column:1/-1">
              <label id="swPriceLabel">${(wizardState.projForm.status === 'Award/SLA' || wizardState.projForm.status === 'SLA Signed') ? 'Award Value (₦) <span style="font-size:12px;color:var(--primary);font-weight:600">(Exclusive of VAT)</span>' : 'Opportunity Value (₦)'}</label>
              <input id="swProjPrice" type="number" min="0" step="0.01" value="${PDMS.esc(wizardState.projForm.price || '')}" placeholder="0.00" />
            </div>
          </div>
          <div class="form-row" style="margin-top:12px">
            <label>Description</label>
            <textarea id="swProjDesc" rows="3" placeholder="Scope, deliverables, timeline goals...">${PDMS.esc(wizardState.projForm.desc || '')}</textarea>
          </div>
        `;
        footHtml = `
          <button class="btn btn-ghost" data-close style="margin-right:auto">Cancel</button>
          <button class="btn btn-secondary" id="swBackBtn">← Back</button>
          <button class="btn btn-primary" id="swFinalSubmitBtn">${I('plus')} Create Lead</button>
        `;
      }

      modalRef = PDMS.modal(title, bodyHtml, footHtml);

      // Attach event handlers based on step
      if (wizardState.step === 1) {
        const choiceEx = modalRef.querySelector('#swChoiceExisting');
        const choiceNew = modalRef.querySelector('#swChoiceNew');
        const nextBtn = modalRef.querySelector('#swStep1NextBtn');

        if (choiceEx) choiceEx.onclick = () => {
          wizardState.clientMode = 'existing';
          wizardState.step = 2;
          renderModal();
        };
        if (choiceNew) choiceNew.onclick = () => {
          wizardState.clientMode = 'new';
          wizardState.step = 2;
          renderModal();
        };
        if (nextBtn) nextBtn.onclick = () => {
          if (!wizardState.clientMode) return;
          wizardState.step = 2;
          renderModal();
        };
      } else if (wizardState.step === 2 && wizardState.clientMode === 'new') {
        const backBtn = modalRef.querySelector('#swBackBtn');
        const nextBtn = modalRef.querySelector('#swCreateClientNextBtn');

        if (backBtn) backBtn.onclick = () => {
          const nameInput = modalRef.querySelector('#swNewName');
          const indInput = modalRef.querySelector('#swNewIndustry');
          const emailInput = modalRef.querySelector('#swNewEmail');
          const phoneInput = modalRef.querySelector('#swNewPhone');
          const addrInput = modalRef.querySelector('#swNewAddress');
          const workedInput = modalRef.querySelector('#swNewWorkedBefore');
          if (nameInput) wizardState.newClientForm.name = nameInput.value;
          if (indInput) wizardState.newClientForm.industry = indInput.value;
          if (emailInput) wizardState.newClientForm.email = emailInput.value;
          if (phoneInput) wizardState.newClientForm.phone = phoneInput.value;
          if (addrInput) wizardState.newClientForm.address = addrInput.value;
          if (workedInput) wizardState.newClientForm.workedBefore = workedInput.checked;

          wizardState.step = 1;
          wizardState.clientMode = null;
          renderModal();
        };

        if (nextBtn) nextBtn.onclick = function() {
          const name = modalRef.querySelector('#swNewName').value.trim();
          const industry = modalRef.querySelector('#swNewIndustry').value.trim();
          const email = modalRef.querySelector('#swNewEmail').value.trim().toLowerCase();
          const phone = modalRef.querySelector('#swNewPhone').value.trim();
          const address = modalRef.querySelector('#swNewAddress').value.trim();
          const workedBefore = !!(modalRef.querySelector('#swNewWorkedBefore') && modalRef.querySelector('#swNewWorkedBefore').checked);

          wizardState.newClientForm = { name, industry, email, phone, address, workedBefore };

          if (!name || !industry) {
            PDMS.toast('Missing Info', 'Client Name and Industry are required', 'error');
            return;
          }

          const btn = this;
          PDMS.setButtonLoading(btn, true, 'Creating Client...');

          const clientPayload = { name, industry, email, phone, address, workedBefore, projects: 0 };
          PDMS.api.create('clients', clientPayload).then(createdClient => {
            const clientObj = Object.assign({}, clientPayload, createdClient || {});
            const existingIdx = (D.clients || []).findIndex(c => (c.name || '').toLowerCase() === name.toLowerCase());
            if (existingIdx > -1) D.clients[existingIdx] = clientObj;
            else (D.clients = D.clients || []).unshift(clientObj);

            wizardState.selectedClient = clientObj;
            wizardState.step = 3;
            renderModal();
            PDMS.toast('Client Created', `"${name}" added successfully. Continue entering lead details.`, 'success');
          }).catch(err => {
            PDMS.setButtonLoading(btn, false);
            PDMS.toast('Error', err.message || 'Could not create client', 'error');
          });
        };
      } else if (wizardState.step === 2 && wizardState.clientMode === 'existing') {
        const backBtn = modalRef.querySelector('#swBackBtn');
        const nextBtn = modalRef.querySelector('#swSelectClientNextBtn');
        const searchInput = modalRef.querySelector('#swSearchExisting');
        const listContainer = modalRef.querySelector('#swExistingList');

        if (backBtn) backBtn.onclick = () => {
          wizardState.step = 1;
          wizardState.clientMode = null;
          renderModal();
        };

        const attachItemClicks = () => {
          modalRef.querySelectorAll('.sw-client-item').forEach(item => {
            item.onclick = () => {
              const cName = item.getAttribute('data-name');
              const found = (D.clients || []).find(c => c.name === cName);
              if (found) {
                wizardState.selectedClient = found;
                wizardState.step = 3;
                renderModal();
              }
            };
          });
        };
        attachItemClicks();

        if (searchInput) {
          searchInput.oninput = (e) => {
            const q = e.target.value.trim().toLowerCase();
            const filtered = (D.clients || []).filter(c => (c.name || '').toLowerCase().includes(q) || (c.industry || '').toLowerCase().includes(q));
            listContainer.innerHTML = filtered.map(c => `
              <div class="sw-client-item ${wizardState.selectedClient && wizardState.selectedClient.name === c.name ? 'active' : ''}" data-name="${PDMS.esc(c.name)}" style="padding:10px 14px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:10px;background:${wizardState.selectedClient && wizardState.selectedClient.name === c.name ? 'var(--surface)' : 'transparent'};border:1px solid ${wizardState.selectedClient && wizardState.selectedClient.name === c.name ? 'var(--primary)' : 'transparent'};transition:all .15s">
                <div style="display:flex;align-items:center;gap:10px;min-width:0">
                  <div style="width:32px;height:32px;border-radius:8px;background:var(--gradient);color:#fff;display:grid;place-items:center;font-weight:700;font-size:11px;flex-shrink:0">${PDMS.initials(c.name)}</div>
                  <div style="min-width:0">
                    <div style="font-weight:700;font-size:13px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${PDMS.esc(c.name)}${c.workedBefore ? ' <span style="font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;background:rgba(99,102,241,.12);color:var(--primary)">Prior Client</span>' : ''}</div>
                    <div style="font-size:11px;color:var(--text-soft)">${PDMS.esc(c.industry || 'Client')}</div>
                  </div>
                </div>
                ${wizardState.selectedClient && wizardState.selectedClient.name === c.name ? `<span style="color:var(--primary);font-size:16px;font-weight:800">✓</span>` : ''}
              </div>
            `).join('') || `<div style="padding:20px;text-align:center;color:var(--text-soft);font-size:13px">No matching clients found</div>`;
            attachItemClicks();
          };
        }

        if (nextBtn) nextBtn.onclick = () => {
          if (!wizardState.selectedClient) return;
          wizardState.step = 3;
          renderModal();
        };
      } else if (wizardState.step === 3) {
        const backBtn = modalRef.querySelector('#swBackBtn');
        const changeClientBtn = modalRef.querySelector('#swChangeClientBtn');
        const submitBtn = modalRef.querySelector('#swFinalSubmitBtn');

        const goBackToStep2 = () => {
          const typeInput = modalRef.querySelector('#swProjType');
          const deptInput = modalRef.querySelector('#swProjDept');
          const statusInput = modalRef.querySelector('#swProjStatus');
          const priceInput = modalRef.querySelector('#swProjPrice');
          const descInput = modalRef.querySelector('#swProjDesc');
          if (typeInput) wizardState.projForm.type = typeInput.value.trim();
          if (deptInput) wizardState.projForm.workstream = deptInput.value.trim();
          if (statusInput) wizardState.projForm.status = statusInput.value;
          if (priceInput) wizardState.projForm.price = priceInput.value.trim();
          if (descInput) wizardState.projForm.desc = descInput.value.trim();

          wizardState.step = 2;
          renderModal();
        };

        const statusSelect = modalRef.querySelector('#swProjStatus');
        if (statusSelect) {
          statusSelect.onchange = () => {
            const val = statusSelect.value;
            wizardState.projForm.status = val;
            const priceLabel = modalRef.querySelector('#swPriceLabel');
            if (priceLabel) {
              priceLabel.innerHTML = (val === 'Award/SLA' || val === 'SLA Signed')
                ? 'Award Value (₦) <span style="font-size:12px;color:var(--primary);font-weight:600">(Exclusive of VAT)</span>'
                : 'Opportunity Value (₦)';
            }
          };
        }

        if (backBtn) backBtn.onclick = goBackToStep2;
        if (changeClientBtn) changeClientBtn.onclick = () => {
          wizardState.step = 1;
          wizardState.clientMode = null;
          wizardState.selectedClient = null;
          renderModal();
        };

        if (submitBtn) submitBtn.onclick = function() {
          const client = wizardState.selectedClient && wizardState.selectedClient.name;
          if (!client) {
            PDMS.toast('Error', 'Client selection missing', 'error');
            wizardState.step = 1;
            renderModal();
            return;
          }
          const type = modalRef.querySelector('#swProjType').value.trim();
          const workstream = modalRef.querySelector('#swProjDept').value.trim();
          const status = modalRef.querySelector('#swProjStatus').value;
          const negotiatedPriceRaw = modalRef.querySelector('#swProjPrice').value.trim();
          const negotiatedPrice = negotiatedPriceRaw === '' ? '' : Number(negotiatedPriceRaw);
          const desc = modalRef.querySelector('#swProjDesc').value.trim();

          const btn = this;
          PDMS.setButtonLoading(btn, true, 'Creating Lead...');

          let initialStatus = status;
          let initialStage = 'Sales';
          const isSalesHeadCreator = currentUser && currentUser.role === 'Sales Head';
          const isAwardInitial = (initialStatus === 'SLA Signed' || initialStatus === 'Award/SLA');
          if (isAwardInitial) {
            initialStatus = 'Awaiting Account Approval';
            initialStage = 'Delivery';
          } else if (!isSalesHeadCreator) {
            initialStatus = 'Awaiting Sales Head Approval';
            initialStage = 'Sales';
          }

          const isPrior = !!(wizardState.selectedClient && wizardState.selectedClient.workedBefore);
          const clientStatus = wizardState.clientMode === 'new' ? (isPrior ? 'New Client (Worked with before)' : 'New Client') : 'Existing Client';

          const record = {
            name: client, client, type, workstream, dept: workstream, sales: (currentUser && currentUser.name) || 'Sales Team', pm: '', lead: '', consultants: [],
            status: initialStatus, stage: initialStage, requestedStatus: status, createdByRole: currentUser.role, projectOwnerId: '', projectOwnerName: '', progress: 0, start: '', due: '', completion: null,
            negotiatedPrice: Number.isFinite(negotiatedPrice) ? negotiatedPrice : '',
            awardValue: isAwardInitial && Number.isFinite(negotiatedPrice) ? negotiatedPrice : '',
            description: desc, files: 0, remarks: 0,
            clientStatus, clientType: wizardState.clientMode || 'existing',
            workedBefore: isPrior
          };
          const finalRecord = Object.assign({}, record, {
            projectOwnerId: String((currentUser && currentUser.id) || ''),
            projectOwnerName: String((currentUser && currentUser.name) || '')
          });

          const tmpId = 'TMP-' + Date.now();
          const tmp = Object.assign({ id: tmpId, _optimistic: true }, finalRecord);
          (D.projects = D.projects || []).unshift(tmp);

          if (typeof opts.onSuccess === 'function') opts.onSuccess(tmp);

          PDMS.api.create('projects', finalRecord).then(saved => {
            const savedRecord = Object.assign({}, saved, {
              projectOwnerId: String((saved && saved.projectOwnerId) || (currentUser && currentUser.id) || ''),
              projectOwnerName: String((saved && saved.projectOwnerName) || (currentUser && currentUser.name) || '')
            });
            const idx = D.projects.findIndex(p => p.id === tmpId);
            if (idx > -1) D.projects.splice(idx, 1, savedRecord); else D.projects.unshift(savedRecord);
            modalRef.remove();
            const toastMsg = isSalesHeadCreator ? 'Lead onboarded to sales pipeline' : 'Lead submitted for Sales Head approval';
            PDMS.toast('Lead created', toastMsg, 'success');
            if (opts.redirectUrl !== false) {
              if (location.pathname.endsWith('projects.html')) {
                if (typeof renderProjects === 'function') renderProjects();
              } else {
                location.href = 'projects.html#view=sales';
              }
            }
          }).catch(err => {
            const idx = D.projects.findIndex(p => p.id === tmpId);
            if (idx > -1) D.projects.splice(idx, 1);
            if (typeof opts.onSuccess === 'function') opts.onSuccess();
            PDMS.setButtonLoading(btn, false);
            PDMS.toast('Error', err.message || 'Could not create lead', 'error');
          });
        };
      }
    }

    renderModal();
  };


  // ===== Chart primitives (canvas) =====
  PDMS.charts = {
    line(canvas, series, labels, colors){
      const ctx=canvas.getContext('2d');
      const dpr = window.devicePixelRatio||1;
      const W = canvas.clientWidth, H = canvas.clientHeight;
      canvas.width=W*dpr; canvas.height=H*dpr; ctx.scale(dpr,dpr);
      ctx.clearRect(0,0,W,H);
      const pad = {l:36,r:12,t:12,b:24};
      const all = series.flat();
      const max = Math.max(...all)*1.1||1, min = 0;
      const gw = W-pad.l-pad.r, gh = H-pad.t-pad.b;
      // grid
      ctx.strokeStyle = getCss('--border'); ctx.lineWidth=1;
      ctx.fillStyle = getCss('--text-soft'); ctx.font='11px Inter';
      for(let i=0;i<=4;i++){
        const y = pad.t + gh*i/4;
        ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
        ctx.fillText(Math.round(max-(max-min)*i/4),4,y+3);
      }
      // x labels
      labels.forEach((l,i)=>{
        const x = pad.l + gw*i/(labels.length-1);
        if(i%Math.ceil(labels.length/8)===0) ctx.fillText(l,x-10,H-6);
      });
      series.forEach((s,si)=>{
        const color = colors[si]||getCss('--primary');
        // area
        ctx.beginPath();
        s.forEach((v,i)=>{
          const x = pad.l + gw*i/(s.length-1);
          const y = pad.t + gh*(1-(v-min)/(max-min));
          i?ctx.lineTo(x,y):ctx.moveTo(x,y);
        });
        ctx.lineTo(pad.l+gw,pad.t+gh);ctx.lineTo(pad.l,pad.t+gh);ctx.closePath();
        const grad = ctx.createLinearGradient(0,pad.t,0,pad.t+gh);
        grad.addColorStop(0,color+'55');grad.addColorStop(1,color+'00');
        ctx.fillStyle=grad;ctx.fill();
        // line
        ctx.beginPath();
        s.forEach((v,i)=>{
          const x = pad.l + gw*i/(s.length-1);
          const y = pad.t + gh*(1-(v-min)/(max-min));
          i?ctx.lineTo(x,y):ctx.moveTo(x,y);
        });
        ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.stroke();
        // dots
        s.forEach((v,i)=>{
          const x = pad.l + gw*i/(s.length-1);
          const y = pad.t + gh*(1-(v-min)/(max-min));
          ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
        });
      });
    },
    bar(canvas, values, labels, color){
      const ctx=canvas.getContext('2d');
      const dpr = window.devicePixelRatio||1;
      const W = canvas.clientWidth, H = canvas.clientHeight;
      canvas.width=W*dpr; canvas.height=H*dpr; ctx.scale(dpr,dpr);
      ctx.clearRect(0,0,W,H);
      const rotate = values.length > 5;
      const pad = {l:36, r:12, t:18, b: rotate ? 80 : 28};
      const max = Math.max(...values)*1.15||1;
      const gw = W-pad.l-pad.r, gh = H-pad.t-pad.b;
      ctx.strokeStyle = getCss('--border'); ctx.fillStyle=getCss('--text-soft'); ctx.font='11px Inter';
      for(let i=0;i<=4;i++){
        const y = pad.t + gh*i/4;
        ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
        ctx.fillText(Math.round(max-max*i/4),4,y+4);
      }
      const bw = Math.min(gw/values.length*0.65, 48);
      const colors = Array.isArray(color) ? color : values.map(()=>color||getCss('--primary'));
      values.forEach((v,i)=>{
        const c = colors[i]||getCss('--primary');
        const cx = pad.l + gw*(i+0.5)/values.length;
        const x = cx - bw/2;
        const bh = Math.max(gh*(v/max), v>0?4:0);
        const y = pad.t+gh-bh;
        if(bh>0){
          const grad = ctx.createLinearGradient(0,y,0,y+bh);
          grad.addColorStop(0,c); grad.addColorStop(1,c+'70');
          ctx.fillStyle=grad;
          roundRect(ctx,x,y,bw,bh,5); ctx.fill();
        }
        if(v>0){
          ctx.fillStyle=getCss('--text'); ctx.font='bold 11px Inter'; ctx.textAlign='center';
          ctx.fillText(v, cx, y-5);
        }
        ctx.fillStyle=getCss('--text-soft'); ctx.font='11px Inter'; ctx.textAlign='center';
        if(rotate){
          ctx.save(); ctx.translate(cx, pad.t+gh+10); ctx.rotate(-Math.PI/4);
          ctx.textAlign='right'; ctx.fillText(labels[i]||'', 0, 0); ctx.restore();
        } else {
          ctx.fillText(labels[i]||'', cx, H-8);
        }
      });
      ctx.textAlign='left';
    },
    donut(canvas, values, colors, labels){
      const ctx=canvas.getContext('2d');
      const dpr = window.devicePixelRatio||1;
      const W = canvas.clientWidth, H = canvas.clientHeight;
      canvas.width=W*dpr; canvas.height=H*dpr; ctx.scale(dpr,dpr);
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2, r=Math.min(W,H)/2-10, ir=r*0.62;
      const realTotal = values.reduce((a,b)=>a+b,0);
      const total = realTotal||1;
      let start=-Math.PI/2;
      values.forEach((v,i)=>{
        const ang = (v/total)*Math.PI*2;
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.arc(cx,cy,r,start,start+ang);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        start += ang;
      });
      ctx.beginPath();ctx.arc(cx,cy,ir,0,Math.PI*2);
      ctx.fillStyle=getCss('--surface');ctx.fill();
      ctx.fillStyle=getCss('--text');ctx.font='700 20px Inter';ctx.textAlign='center';
      ctx.fillText(realTotal,cx,cy);
      ctx.fillStyle=getCss('--text-muted');ctx.font='11px Inter';
      ctx.fillText('Total',cx,cy+16);
    }
  };
  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  }
  function getCss(v){
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#4f46e5';
  }
})(window);
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
/* PDMS Permissions — central role/action matrix.
   Roles: System Administrator, HR, COO, HTD, PM Head, PMO, Sales, Sales Head, Consultant, General Admin */
(function(global){
  const PDMS = global.PDMS = global.PDMS || {};

  const MATRIX = {
    'Onboard User':        ['HR','HTD','COO','PM Head','General Admin'],
    'Create Project':      ['Sales','Sales Head','General Admin'],
    'Assign Project':      ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Assign PM':           ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Assign Lead':         ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Assign Consultant':   ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Reassign Project':    ['HTD','COO','PM Head','PMO','General Admin'],
    'Reassign Consultant': ['HTD','COO','PM Head','PMO','General Admin'],
    'Change Status':       ['HR','HTD','COO','PM Head','PMO','Sales','Sales Head','General Admin'],
    'Close Project':       ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Add Remarks':         ['HR','HTD','COO','PM Head','PMO','Sales','Sales Head','Accounts','General Admin','Consultant'],
    'View Reports':        ['HR','HTD','COO','PM Head','PMO','Sales','Sales Head','Accounts','General Admin','Consultant'],
    'Manage Permissions':  ['General Admin'],
    'Confirm Project':     ['Sales','Sales Head','General Admin'],
    'View Resources':      ['HTD','COO','PM Head','PMO','Sales','Sales Head','Accounts','General Admin','Consultant'],
    'Start Delivery':      ['HTD','COO','PM Head','General Admin'],
    'Approve Project':     ['Accounts','General Admin'],
    'Approve Sales Project': ['Sales Head','General Admin'],
  };

  PDMS.PERMISSIONS = MATRIX;

  PDMS.can = function(action, user){
    user = user || PDMS.getUser();
    if(!user) return false;
    const allowed = MATRIX[action];
    return !!allowed && allowed.includes(user.role);
  };

  const DASHBOARD_BY_ROLE = {
    'System Administrator': 'dashboard-admin.html',
    'General Admin':        'dashboard-admin.html',
    'HR':                   'dashboard-hr.html',
    'HTD':                  'dashboard-htd.html',
    'COO':                  'dashboard-htd.html',
    'PM Head':              'dashboard-htd.html',
    'PMO':                  'dashboard-pmo.html',
    'Accounts':             'dashboard-accounts.html',
    'Sales':                'dashboard-sales.html',
    'Sales Head':           'dashboard-sales.html',
  };
  PDMS.dashboardFor = function(user){
    user = user || PDMS.getUser();
    return (user && DASHBOARD_BY_ROLE[user.role]) || 'dashboard.html';
  };

  const DELIVERY_ROLES = ['HTD','COO','PM Head','PMO','General Admin'];
  const SALES_ROLES    = ['Sales','Sales Head'];

  PDMS.isDeliveryRole = function(user){
    user = user || PDMS.getUser();
    return !!user && DELIVERY_ROLES.includes(user.role);
  };
  PDMS.isSalesRole = function(user){
    user = user || PDMS.getUser();
    return !!user && SALES_ROLES.includes(user.role);
  };

  PDMS.isSalesHeadRole = function(user){
    user = user || PDMS.getUser();
    return !!user && user.role === 'Sales Head';
  };

  PDMS.stageOf = function(project){
    if(project && (project.status === 'Awaiting Account Approval' || project.status === 'Awaiting Sales Head Approval')) return 'Sales';
    const salesStatuses = (window.PDMS_DATA && window.PDMS_DATA.salesStatuses) || [];
    const deliveryStatuses = (window.PDMS_DATA && window.PDMS_DATA.deliveryStatuses) || [];
    const normalized = PDMS.normalizeStatus ? PDMS.normalizeStatus(project.status) : project.status;
    if(deliveryStatuses.includes(normalized) || deliveryStatuses.includes(project.status)) return 'Delivery';
    if(salesStatuses.includes(normalized)) return 'Sales';
    if(project.stage) return project.stage;
    if(project.createdByRole) return DELIVERY_ROLES.includes(project.createdByRole) ? 'Delivery' : 'Sales';
    return 'Delivery';
  };

  PDMS.statusOptionsFor = function(user){
    user = user || PDMS.getUser();
    if(!user) return [];
    const D = window.PDMS_DATA;
    if(!D) return [];
    const exclude = ['Awaiting Sales Head Approval', 'Awaiting Account Approval'];
    if(PDMS.isSalesRole(user) || PDMS.isSalesHeadRole(user)) return (D.salesStatuses || []).filter(s => !exclude.includes(s));
    if(PDMS.isDeliveryRole(user)) return (D.deliveryStatuses || []).filter(s => !exclude.includes(s));
    return [...new Set([...(D.salesStatuses||[]), ...(D.deliveryStatuses||[])])].filter(s => !exclude.includes(s));
  };

  // Shared status/bucket helpers used across all dashboard pages.
  PDMS.isSalesStatus = function(status){
    if(status === 'Awaiting Sales Head Approval' || status === 'Awaiting Account Approval') return true;
    const normalized = PDMS.normalizeStatus ? PDMS.normalizeStatus(status) : status;
    return ((window.PDMS_DATA && window.PDMS_DATA.salesStatuses) || []).includes(normalized);
  };
  PDMS.isDeliveryStatus = function(status){
    return ((window.PDMS_DATA && window.PDMS_DATA.deliveryStatuses) || []).includes(status);
  };
  PDMS.deliveryStatusOf = function(project){
    if(!project) return 'Not Started';
    if(project.deliveryStatus) return project.deliveryStatus;
    const st = project.status;
    const dList = (window.D && window.D.deliveryStatuses) || (window.PDMS_DATA && window.PDMS_DATA.deliveryStatuses) || [];
    if(st && st !== 'Closed' && dList.includes(st) && st !== 'Awaiting Account Approval' && st !== 'Awaiting Sales Head Approval') {
      return st;
    }
    return 'Not Started';
  };
  PDMS.projectBucket = function(project){
    if(project.status === 'Awaiting Account Approval' || project.status === 'Awaiting Sales Head Approval') return 'Sales'; // pending but locked
    if(PDMS.isDeliveryStatus(project.status)) return 'Delivery';
    if(PDMS.isSalesStatus(project.status)) return 'Sales';
    return 'Delivery';
  };
  
  // Determine whether the current user may change a project's status to `newStatus`.
  // Logic: user must have the Change Status permission, and their role should
  // be appropriate for the target status (sales vs delivery). General Admins
  // and roles with Change Status will default to allowed unless restricted.
  PDMS.canChangeStatus = function(project, newStatus){
    const user = PDMS.getUser();
    if(!user) return false;
    if(!PDMS.can('Change Status', user)) return false;
    const normalized = PDMS.normalizeStatus ? PDMS.normalizeStatus(newStatus) : newStatus;
    const targetIsSales = PDMS.isSalesStatus(normalized);
    const targetIsDelivery = PDMS.isDeliveryStatus(normalized) || normalized === 'Awaiting Account Approval' || normalized === 'Award/SLA';
    // Sales roles may only set sales statuses
    if(PDMS.isSalesRole(user)) return targetIsSales;
    // Delivery roles may only set delivery statuses
    if(PDMS.isDeliveryRole(user)) return targetIsDelivery;
    // Fallback allow for other permitted roles (HR, General Admin, etc.)
    return true;
  };
  PDMS.isPendingAccountApproval = function(project){
    return project && (project.status === 'Awaiting Account Approval' || (project.status === 'Award/SLA' && !project.rejectionNote));
  };
  PDMS.isPendingSalesHeadApproval = function(project){
    return project && project.status === 'Awaiting Sales Head Approval';
  };
  PDMS.canSeePrice = function(user){
    user = user || PDMS.getUser();
    if(!user) return false;
    return ['Accounts','COO','PM Head','HTD','Sales','Sales Head','System Administrator'].includes(user.role);
  };
  PDMS.canEditPrice = function(user){
    user = user || PDMS.getUser();
    if(!user) return false;
    return ['Sales','Sales Head','Accounts','COO','System Administrator'].includes(user.role);
  };
})(window);
/* PDMS Shell (sidebar, header, panels) */
(function(){
  const I = PDMS.icon;

  const NAV = [
    {section:'Main',items:[
      {id:'dashboard',label:'Dashboard',icon:'dashboard',href:'dashboard.html',roles:'*'},
      {id:'projects',label:'Projects',icon:'folder',href:'projects.html',roles:['COO','Consultant']},
      {id:'clients',label:'Clients',icon:'globe',href:'clients.html',roles:['Sales','Sales Head']},
      {id:'awaiting-approval',label:'Awaiting Projects',icon:'clock',href:'awaiting-projects.html',roles:['Accounts','PM Head','COO','HTD']},
      {id:'awaiting-sales-approval',label:'Awaiting Approval',icon:'clock',href:'awaiting-projects.html',roles:['Sales Head']},
      {id:'sales-pipeline',label:'Sales Pipeline',icon:'zap',href:'projects.html#view=sales',roles:['Sales','Sales Head','HR','HTD','COO','PM Head','Project Manager','Accounts']},
      {id:'delivery-projects',label:'Projects in Delivery',icon:'folder',href:'projects.html#view=delivery',roles:['Sales','Sales Head','HR','HTD','COO','PM Head','PMO','Project Manager','Accounts']},
    ]},
    {section:'Management',items:[
      {id:'users',label:'Users',icon:'users',href:'users.html',roles:['HR']},
      {id:'consultants',label:'Consultants',icon:'briefcase',href:'consultants.html',roles:['HR','COO','HTD','PM Head','PMO','Project Manager']},
    ]},
    {section:'Community',items:[
      {id:'notifications',label:'Notifications',icon:'bell',href:'notifications.html',roles:'*'},
      {id:'reviews',label:'Reviews',icon:'message',href:'reviews.html',roles:'*'},
    ]},
    {section:'System',items:[
      {id:'profile',label:'My Profile',icon:'user',href:'profile.html',roles:'*'},
      {id:'settings',label:'System Settings',icon:'settings',href:'settings.html',roles:['System Administrator']},
      {id:'activity',label:'Audit Logs',icon:'activity',href:'activity.html',roles:['System Administrator']},
    ]}
  ];

  function canSee(item, role){
    if(item.roles==='*') return true;
    return item.roles.includes(role);
  }

  PDMS.mountShell = function(activeId, opts){
    opts=opts||{};
    const user = PDMS.requireAuth();
    if(!user) return;
    const role = user.role;
    const theme = localStorage.getItem('pdms-theme')||'light';

    const navHtml = NAV.map(s=>{
      const items = s.items.filter(it=>canSee(it,role));
      if(!items.length) return '';
      return '<div class="nav-section"><div class="nav-title">'+s.section+'</div>'+
        items.map(it=>{
          const href = it.id==='dashboard' ? PDMS.dashboardFor(user) : it.href;
          const label = (it.id==='projects' && role==='Consultant') ? 'My Projects' : it.label;
          return '<a class="nav-item '+(activeId===it.id?'active':'')+'" href="'+href+'">'+I(it.icon)+'<span>'+label+'</span>'+(it.badge?'<span class="badge">'+it.badge+'</span>':'')+'</a>';
        }).join('')+
      '</div>';
    }).join('');

    document.body.innerHTML =
    '<div class="app">'+
      '<aside class="sidebar" id="sidebar">'+
        '<div class="sidebar-header">'+
          '<div class="brand"><div class="brand-logo"><img src="images/pse-logo.png" alt="PSE PDMS Logo"/></div></div>'+
        '</div>'+
        '<nav class="nav">'+navHtml+'</nav>'+
        '<div class="sidebar-footer">'+
          '<div class="avatar" style="cursor:pointer" onclick="location.href=\'profile.html\'">'+PDMS.initials(user.name)+'</div>'+
          '<div class="user-meta" style="cursor:pointer" onclick="location.href=\'profile.html\'"><div class="name">'+PDMS.esc(user.name)+'</div><div class="role">'+PDMS.esc(user.role)+'</div></div>'+
          '<button class="icon-btn" title="Logout" id="logoutBtn">'+I('logout')+'</button>'+
        '</div>'+
      '</aside>'+
      '<div class="main">'+
        '<header class="header">'+
          '<button class="hamburger" id="hamburger">'+I('menu')+'</button>'+
          '<div class="search"><span>'+I('search')+'</span><input id="globalSearch" placeholder="Search projects, users, clients, reviews..."/></div>'+
          '<div class="header-actions">'+
            '<button class="icon-btn" id="themeToggle" title="Toggle theme">'+I(theme==='light'?'moon':'sun')+'</button>'+
            '<button class="icon-btn" id="notifBtn" title="Notifications">'+I('bell')+'<span class="dot"></span></button>'+
            '<button class="icon-btn" id="reviewsBtn" title="Reviews">'+I('message')+'</button>'+
            '<div class="avatar avatar-sm" title="'+PDMS.esc(user.name)+'" style="cursor:pointer" onclick="location.href=\'profile.html\'">'+PDMS.initials(user.name)+'</div>'+
          '</div>'+
        '</header>'+
        '<main class="content" id="content"></main>'+
      '</div>'+
    '</div>'+
    '<div class="panel" id="notifPanel"></div>'+
    '<div class="pdms-loading-bar" id="pdmsLoadingBar"></div>';

    // Show the top loading bar until this page's data has actually arrived —
    // PDMS_REFRESH() was already kicked off by config.js before this shell mounted.
    const loadingBar = document.getElementById('pdmsLoadingBar');
    if (!window.PDMS_REMOTE) {
      loadingBar.classList.add('active');
      const stop = () => { loadingBar.classList.remove('active'); };
      document.addEventListener('pdms:refresh', stop, { once: true });
      document.addEventListener('pdms:loading-end', stop, { once: true });
    }

    document.getElementById('hamburger').onclick = ()=>document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('themeToggle').onclick = PDMS.toggleTheme;
    document.getElementById('logoutBtn').onclick = confirmLogout;
    document.getElementById('notifBtn').onclick = ()=>togglePanel('notif');
    document.getElementById('reviewsBtn').onclick = ()=>location.href='reviews.html';
    document.getElementById('globalSearch').addEventListener('keydown',e=>{
      if(e.key==='Enter'){ location.href='search.html?q='+encodeURIComponent(e.target.value); }
    });
    renderNotifPanel();
  };

  function confirmLogout(){
    const modal = PDMS.modal('Log out?',
      '<p class="text-sm text-muted">Are you sure you want to log out of PSE PDMS?</p>',
      '<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="confirmLogoutBtn">Log out</button>'
    );
    modal.querySelector('.modal').classList.add('modal-sm');
    modal.querySelector('#confirmLogoutBtn').onclick = ()=>{
      modal.remove();
      PDMS.toast('Signed out','See you again!','success');
      setTimeout(PDMS.logout,600);
    };
  }

  function togglePanel(which){
    document.getElementById(which+'Panel').classList.toggle('open');
  }
  document.addEventListener('click',e=>{
    if(!e.target.closest('.panel') && !e.target.closest('#notifBtn')){
      document.querySelectorAll('.panel.open').forEach(p=>p.classList.remove('open'));
    }
  });

  function renderNotifPanel(){
    const p = document.getElementById('notifPanel');
    const list = PDMS_DATA.notifications.slice(0,10);
    p.innerHTML = '<div class="panel-head"><h3>Notifications</h3><a href="notifications.html" class="text-sm" style="color:var(--primary)">View all</a></div><div class="panel-body">'+
      list.map(n=>'<div class="notif '+(n.unread?'unread':'')+'"><div class="n-icon">'+I(n.icon)+'</div><div><div class="n-title">'+PDMS.esc(n.title)+'</div><div class="n-msg">'+PDMS.esc(n.msg)+'</div><div class="n-time">'+n.time+'</div></div></div>').join('')+
    '</div>';
  }
})();
