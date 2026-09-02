/* PDMS Utils */
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
  PDMS.setUser = function(u){
    localStorage.setItem('pdms-user',JSON.stringify(u));
    try{ sessionStorage.removeItem('pdms-unread-popup-shown'); }catch(e){} // fresh login re-shows the unread popup
  };
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
  PDMS.logout = function(){ localStorage.removeItem('pdms-user'); try{ sessionStorage.removeItem('pdms-unread-popup-shown'); }catch(e){} location.href='index.html'; };
  PDMS.requireAuth = function(){
    const user = PDMS.getUser();
    if(!user){ location.href='index.html'; return null; }
    return user;
  };

  // Workspace Splash Loader (Slack-inspired rolling loader)
  PDMS.ensureSplashLoader = function(){
    let loader = document.getElementById('pdmsSplashLoader');
    if (!loader && document.body) {
      loader = document.createElement('div');
      loader.id = 'pdmsSplashLoader';
      loader.className = 'pdms-splash-loader';
      loader.innerHTML = `
        <div class="pdms-splash-content">
          <div class="pdms-rolling-loader-box">
            <div class="pdms-rolling-spinner"></div>
          </div>
          <h2 class="pdms-splash-title" id="pdmsSplashTitle">Loading your workspace...</h2>
          <p class="pdms-splash-sub" id="pdmsSplashSub">Retrieving data from database</p>
        </div>
      `;
      document.body.appendChild(loader);
    }
    return loader;
  };

  PDMS.showSplashLoader = function(title, subtitle){
    const loader = PDMS.ensureSplashLoader();
    if (loader) {
      if (title) {
        const t = loader.querySelector('#pdmsSplashTitle');
        if (t) t.textContent = title;
      }
      if (subtitle) {
        const s = loader.querySelector('#pdmsSplashSub');
        if (s) s.textContent = subtitle;
      }
      loader.classList.remove('hidden');
    }
  };

  PDMS.hideSplashLoader = function(){
    const loader = document.getElementById('pdmsSplashLoader');
    if (loader) {
      loader.classList.add('hidden');
    }
  };

  // Show the loading screen and re-fetch from the server, hiding it once the
  // fresh data has landed (pages re-render off pdms:refresh). Use right after a
  // create so the user waits on the loader instead of a stale list, then sees
  // their new record when it clears.
  PDMS.awaitFreshData = function(title, subtitle){
    if (typeof g.PDMS_REFRESH !== 'function') return;
    PDMS.showSplashLoader(title || 'Saving...', subtitle || 'Getting the latest data');
    const done = function(){
      document.removeEventListener('pdms:loading-end', done);
      clearTimeout(timer);
      setTimeout(PDMS.hideSplashLoader, 150);
    };
    const timer = setTimeout(done, 30000);
    document.addEventListener('pdms:loading-end', done);
    g.PDMS_REFRESH(true);
  };

  // Renders when data is ready. Shows splash screen while loading data so that
  // incomplete or empty states are never displayed before database retrieval finishes.
  PDMS.onRefresh = function(renderFn){
    if (!g.PDMS_DATA_LOADED && !g.PDMS_REMOTE) {
      PDMS.showSplashLoader('Loading your workspace...', 'Retrieving project data from database');
    }
    const safeRender = () => {
      try { renderFn(); } catch(e){ console.error('Render error:', e); }
      if (g.PDMS_DATA_LOADED || g.PDMS_REMOTE) {
        setTimeout(PDMS.hideSplashLoader, 180);
      }
    };
    if (g.PDMS_DATA_LOADED || g.PDMS_REMOTE) {
      safeRender();
    }
    document.addEventListener('pdms:refresh', safeRender);
    document.addEventListener('pdms:data-ready', safeRender);
    setTimeout(PDMS.hideSplashLoader, 30000); // safety ceiling; events above normally end it
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

  // Broadcast a notification to targeted roles/users — fires and forgets.
  // icon: any key from ICONS; link: optional href the notification card links to.
  // recipientRole: optional target role(s) (e.g. 'Sales Head', 'Accounts', 'HR', 'COO,HTD,PM Head')
  // recipientId: optional target user id
  // projectId: optional project ID to scope to project members
  PDMS.notify = function(title, msg, icon, link, recipientRole, recipientId, projectId){
    const user = PDMS.getUser();
    const record = {
      title, msg,
      icon: icon || 'bell',
      link: link || '',
      actor: user ? user.name : 'System',
      actorRole: user ? user.role : '',
      time: new Date().toISOString(),
      unread: true,
      recipientRole: recipientRole || '',
      recipientId: recipientId || '',
      projectId: projectId || ''
    };
    PDMS.api.create('notifications', record).then(saved=>{
      if(window.PDMS_DATA && Array.isArray(window.PDMS_DATA.notifications)){
        window.PDMS_DATA.notifications.unshift(saved);
      }
      if(window.PDMS_REMOTE && Array.isArray(window.PDMS_REMOTE.notifications) && window.PDMS_REMOTE.notifications !== window.PDMS_DATA.notifications){
        window.PDMS_REMOTE.notifications.unshift(saved);
      }
      document.dispatchEvent(new CustomEvent('pdms:notifications-changed'));
    }).catch(()=>{}); // silent — notifications are best-effort
  };

  // ------------------------------------------------------------------
  // Targeted workflow notifications (lead lifecycle)
  // Reuses the same `notifications` entity as PDMS.notify — records simply
  // carry recipient metadata (role and/or user). On login the shell shows a
  // single generic "you have unread notifications" sticky (see js/app.js).
  // ------------------------------------------------------------------
  function liveList(key){
    return (window.PDMS_REMOTE && Array.isArray(window.PDMS_REMOTE[key]) && window.PDMS_REMOTE[key])
        || (window.PDMS_DATA && Array.isArray(window.PDMS_DATA[key]) && window.PDMS_DATA[key])
        || [];
  }

  // Resolve the lead owner from the project record itself — never assume it is
  // the currently logged-in user (the owner acts at only some workflow stages).
  PDMS.leadOwnerOf = function(project){
    if(!project) return { id:'', name:'' };
    const idFields = ['projectOwnerId','salesOwnerId','onboardedById','createdByUserId'];
    const nameFields = ['projectOwnerName','salesOwnerName','onboardedByName','createdByUserName','sales'];
    let id = '';
    for(const f of idFields){ if(project[f]){ id = String(project[f]); break; } }
    let name = '';
    for(const f of nameFields){ if(project[f] && project[f] !== 'Sales Team'){ name = String(project[f]); break; } }
    const users = PDMS.getUsers();
    if(id && !name){
      const u = users.find(x => String(x.id) === id);
      if(u) name = u.name;
    }
    if(!id && name){
      const u = users.find(x => String(x.name || '').trim().toLowerCase() === name.trim().toLowerCase());
      if(u) id = String(u.id);
    }
    return { id, name };
  };

  const DELIVERY_TEAM_ROLES = 'HTD,COO,PM Head';

  // event -> builder returning one or more partial notification records.
  // ctx: { project, actor, actorRole, owner, reason, link }
  const WORKFLOW_EVENTS = {
    'lead.created': ctx => [{
      recipientRole: 'Sales Head', kind: 'action', actionStage: 'sales_head_review',
      icon: 'zap',
      title: 'New Lead Awaiting Review',
      msg: `A new lead "${ctx.project.name}" (${ctx.project.client || ctx.project.name}) was created by ${ctx.actor} and is awaiting your review.`
    }],
    'lead.resubmitted': ctx => [{
      recipientRole: 'Sales Head', kind: 'action', actionStage: 'sales_head_review',
      icon: 'refresh',
      title: 'Lead Resubmitted for Review',
      msg: `A previously rejected lead "${ctx.project.name}" was corrected and resubmitted by ${ctx.actor} and is awaiting your review.`
    }],
    'lead.accepted': ctx => [{
      owner: true, kind: 'info',
      icon: 'check',
      title: 'Lead Accepted by Sales Head',
      msg: `Your lead "${ctx.project.name}" was accepted by the Sales Head (${ctx.actor}). You can now progress it through the sales workflow.`
    }],
    'lead.rejected': ctx => [{
      owner: true, kind: 'info',
      icon: 'zap',
      title: 'Lead Rejected by Sales Head',
      msg: `Your lead "${ctx.project.name}" was rejected by the Sales Head (${ctx.actor}).${ctx.reason ? ` Reason: ${ctx.reason}.` : ''} Correct the issues and resubmit for review.`
    }],
    'award.submitted': ctx => [{
      recipientRole: 'Accounts', kind: 'action', actionStage: 'accounts_review',
      icon: 'zap',
      title: 'Award Awaiting Approval',
      msg: `Lead "${ctx.project.name}" (${ctx.project.client || ctx.project.name}) has been awarded (Award/SLA) by ${ctx.actor} and is awaiting your approval.`
    }],
    'award.approved': ctx => [
      { owner: true, kind: 'info', icon: 'check',
        title: 'Award Approved by Accounts',
        msg: `Your lead "${ctx.project.name}" has been awarded and approved by Accounts (${ctx.actor}).` },
      { recipientRole: 'Sales Head', kind: 'info', icon: 'check',
        title: 'Award Approved by Accounts',
        msg: `The lead "${ctx.project.name}" has been awarded and approved by Accounts (${ctx.actor}).` },
      { recipientRole: DELIVERY_TEAM_ROLES, kind: 'info', icon: 'folder',
        title: 'Lead Ready for Delivery',
        msg: `Lead "${ctx.project.name}" has been awarded and approved by Accounts. It is now ready for the delivery process.` }
    ],
    'award.rejected': ctx => [{
      owner: true, kind: 'info',
      icon: 'zap',
      title: 'Award Rejected by Accounts',
      msg: `Your awarded lead "${ctx.project.name}" was rejected by Accounts (${ctx.actor}).${ctx.reason ? ` Reason: ${ctx.reason}.` : ''} Review the feedback, make corrections, and resubmit.`
    }]
  };

  function dedupeExists(key){
    if(!key) return false;
    return liveList('notifications').some(n => n.dedupeKey === key);
  }

  function postNotification(rec){
    // Optimistic insert so the sticky bar / bell update immediately and the
    // dedupe check sees this record synchronously (guards double-clicks).
    const optimistic = Object.assign({ id: 'tmp-' + Math.random().toString(36).slice(2), _optimistic: true }, rec);
    const dataArr = (window.PDMS_DATA && Array.isArray(window.PDMS_DATA.notifications)) ? window.PDMS_DATA.notifications : null;
    const remoteArr = (window.PDMS_REMOTE && Array.isArray(window.PDMS_REMOTE.notifications)) ? window.PDMS_REMOTE.notifications : null;
    if(dataArr) dataArr.unshift(optimistic);
    if(remoteArr && remoteArr !== dataArr) remoteArr.unshift(optimistic);
    document.dispatchEvent(new CustomEvent('pdms:notifications-changed'));
    PDMS.api.create('notifications', rec).then(saved=>{
      Object.assign(optimistic, saved);
      delete optimistic._optimistic;
      document.dispatchEvent(new CustomEvent('pdms:notifications-changed'));
    }).catch(()=>{
      if(dataArr){ const i = dataArr.indexOf(optimistic); if(i>-1) dataArr.splice(i,1); }
      if(remoteArr && remoteArr !== dataArr){ const j = remoteArr.indexOf(optimistic); if(j>-1) remoteArr.splice(j,1); }
      document.dispatchEvent(new CustomEvent('pdms:notifications-changed'));
    });
  }

  // Fire a workflow notification. `event` is a key of WORKFLOW_EVENTS.
  // Duplicate-safe: keyed on event + project + submissionCount, so repeated
  // saves / refreshes never create a second copy, but a genuine resubmission
  // (which bumps submissionCount) does.
  PDMS.workflowNotify = function(event, project, opts){
    opts = opts || {};
    const build = WORKFLOW_EVENTS[event];
    if(!build || !project) return;
    const user = PDMS.getUser();
    const ctx = {
      project,
      actor: opts.actor || (user ? user.name : 'System'),
      actorRole: user ? user.role : '',
      owner: PDMS.leadOwnerOf(project),
      reason: opts.reason || ''
    };
    const submissionCount = Number(project.submissionCount) || 1;
    const nowIso = new Date().toISOString();
    build(ctx).forEach(part => {
      const rRole = part.recipientRole || '';
      const isOwner = !!part.owner;
      if(!isOwner && !rRole) return; // nothing to target
      // For owner notifications we always create the record and resolve the
      // recipient live (by id/name OR project ownership) — so even a legacy lead
      // with no owner id recorded still reaches whoever owns it.
      const rId = isOwner ? (ctx.owner.id || '') : '';
      const rName = isOwner ? (ctx.owner.name || '') : '';
      const dedupeKey = `${event}:${project.id}:${submissionCount}:${rRole || 'owner'}`;
      if(dedupeExists(dedupeKey)) return;
      postNotification({
        title: part.title,
        msg: part.msg,
        icon: part.icon || 'bell',
        link: opts.link || ('project-details.html#id=' + project.id),
        actor: ctx.actor,
        actorRole: ctx.actorRole,
        time: nowIso,
        unread: true,
        recipientRole: rRole,
        recipientId: rId,
        recipientName: rName,
        recipientOwner: isOwner ? String(project.id) : '',
        kind: part.kind || 'info',
        actionStage: part.actionStage || '',
        event: event,
        projectId: String(project.id),
        projectName: project.name || project.client || '',
        dedupeKey: dedupeKey
      });
    });
  };

  // Notifications visible strictly to `user`:
  // - Targeted to their user id or name
  // - Targeted to their specific role
  // - Targeted to project owner (for leads they own)
  // - Project-scoped updates (only for members assigned to that project)
  // - Generic system announcements only for Admins & Executive Leadership (COO)
  PDMS.notificationsFor = function(user){
    user = user || PDMS.getUser();
    if(!user) return [];
    const all = liveList('notifications');
    const projectsAll = liveList('projects');
    const role = String(user.role || '').trim();
    const roleLower = role.toLowerCase();
    const uid = String(user.id || '');
    const uname = String(user.name || '').trim().toLowerCase();
    const isAdmin = ['System Administrator', 'General Admin'].includes(role);

    const ownsProject = function(projectId){
      if(!projectId || !PDMS.projectOwnedByUser) return false;
      const proj = projectsAll.find(p => String(p.id) === String(projectId));
      return !!proj && PDMS.projectOwnedByUser(proj, user);
    };

    const isProjectMember = function(projectId){
      if(!projectId) return false;
      const proj = projectsAll.find(p => String(p.id) === String(projectId));
      if(!proj) return false;
      if(PDMS.projectOwnedByUser && PDMS.projectOwnedByUser(proj, user)) return true;
      const pm = String(proj.pm || '').trim().toLowerCase();
      const lead = String(proj.lead || '').trim().toLowerCase();
      if(pm === uname || lead === uname) return true;
      const cons = Array.isArray(proj.consultants) ? proj.consultants.map(n => String(n).trim().toLowerCase()) : [];
      if(cons.includes(uname) || cons.includes(uid.toLowerCase())) return true;
      return false;
    };

    return all.filter(n => {
      // 1. Direct recipient by user ID
      if(n.recipientId && String(n.recipientId) === uid) return true;

      // 2. Direct recipient by user Name
      if(n.recipientName && uname && String(n.recipientName).trim().toLowerCase() === uname) return true;

      // 3. Direct recipient by project ownership (Lead Owner)
      if(n.recipientOwner && ownsProject(n.recipientOwner)) return true;

      // 4. Targeted by specific Role(s) (e.g. "Sales Head", "Accounts", "HR", "HTD,COO,PM Head")
      if(n.recipientRole){
        const roles = String(n.recipientRole).split(',').map(s => s.trim().toLowerCase());
        if(roles.includes(roleLower) || roles.includes('*')) return true;
        // If targeted to other specific role(s), do NOT show to this user
        return false;
      }

      // 5. Project-scoped notification (issues, team assignments on a project)
      if(n.projectId){
        if(['COO', 'HTD', 'PM Head', 'System Administrator', 'General Admin'].includes(role)) return true;
        return isProjectMember(n.projectId);
      }

      // 6. Generic untargeted broadcast — only show to Admins and executive leadership (COO)
      if(isAdmin || role === 'COO') return true;

      return false;
    });
    list.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
    return list;
  };

  // Count of unread notifications addressed to this user specifically (by id,
  // name, role, or project ownership) — drives the login popup shown by the
  // shell when the user reaches their dashboard. Legacy untargeted broadcasts
  // are excluded so a historical backlog doesn't trigger the popup on every
  // login; they still show in the Notification Center and on the header bell.
  PDMS.unreadCountFor = function(user){
    user = user || PDMS.getUser();
    if(!user) return 0;
    return PDMS.notificationsFor(user).filter(n =>
      n.unread && (n.recipientId || n.recipientName || n.recipientRole || n.recipientOwner)
    ).length;
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
  PDMS.timeAgo = function(iso){
    if (!iso) return '';
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    return Math.round(hrs / 24) + 'd ago';
  };
  PDMS.relativeTime = PDMS.timeAgo;
  PDMS.initials = name => (name||'').split(' ').filter(Boolean).map(p=>p[0]).slice(0,2).join('').toUpperCase();

  // Sorts records newest-first (optimistic TMP first, then latest dates/timestamps, then highest numeric ID)
  PDMS.sortNewestFirst = function (arr) {
    if (!Array.isArray(arr)) return arr;
    return arr.sort(function (a, b) {
      if (!a && !b) return 0;
      if (!a) return 1;
      if (!b) return -1;
      if (a._optimistic && !b._optimistic) return -1;
      if (!a._optimistic && b._optimistic) return 1;
      var timeA = a.time || a.createdAt || a._savedAt || (a.joined && /^\d{4}-\d{2}-\d{2}/.test(a.joined) ? a.joined : null);
      var timeB = b.time || b.createdAt || b._savedAt || (b.joined && /^\d{4}-\d{2}-\d{2}/.test(b.joined) ? b.joined : null);
      if (timeA && timeB) {
        var diffTime = new Date(timeB).getTime() - new Date(timeA).getTime();
        if (!isNaN(diffTime) && diffTime !== 0) return diffTime;
      }
      var strA = String(a.id || '');
      var strB = String(b.id || '');
      var matchA = strA.match(/\d+/g);
      var matchB = strB.match(/\d+/g);
      if (matchA && matchB) {
        var numA = parseInt(matchA.join(''), 10);
        var numB = parseInt(matchB.join(''), 10);
        if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
          return numB - numA;
        }
      }
      if (strA && strB && strA !== strB) {
        return strB.localeCompare(strA, undefined, { numeric: true });
      }
      return 0;
    });
  };

  // Escape HTML
  PDMS.esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Table renderer
  PDMS.renderTable = function(container, opts){
    // opts: {columns, rows, pageSize, searchKeys, filterOptions,
    //        dateFilter:{key,label}  ← adds a From/To date range on that row field}
    const state = { page:1, sortKey:null, sortDir:1, filter:'', filters:opts.filters||{}, dateFrom:'', dateTo:'' };
    const pageSize = opts.pageSize||10;

    function filtered(){
      let arr = (opts.rows || []).slice();
      if (!state.sortKey) {
        PDMS.sortNewestFirst(arr);
      }
      if(state.filter){
        const q = state.filter.toLowerCase();
        arr = arr.filter(r=>(opts.searchKeys||Object.keys(r)).some(k=>String(r[k]||'').toLowerCase().includes(q)));
      }
      if(opts.dateFilter && (state.dateFrom || state.dateTo)){
        const dk = opts.dateFilter.key;
        arr = arr.filter(r=>{
          const raw = String(r[dk]||'').slice(0,10);
          if(!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
          if(state.dateFrom && raw < state.dateFrom) return false;
          if(state.dateTo && raw > state.dateTo) return false;
          return true;
        });
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

    function render(focusSel){
      const caret = focusSel ? ((container.querySelector(focusSel)||{}).selectionStart ?? null) : null;
      const arr = filtered();
      const totalPages = Math.max(1,Math.ceil(arr.length/pageSize));
      if(state.page>totalPages) state.page=totalPages;
      const slice = arr.slice((state.page-1)*pageSize, state.page*pageSize);
      const filterHtml = (opts.filterOptions||[]).map(f=>{
        const opts2 = ['<option value="">All '+f.label+'</option>'].concat(f.options.map(o=>'<option value="'+PDMS.esc(o)+'"'+(state.filters[f.key]===o?' selected':'')+'>'+PDMS.esc(o)+'</option>'));
        return '<div class="form-group"><label>'+PDMS.esc(f.label)+'</label><select class="select" data-filter="'+f.key+'">'+opts2.join('')+'</select></div>';
      }).join('');
      const dateHtml = opts.dateFilter ? (
        '<div class="form-group"><label>'+PDMS.esc(opts.dateFilter.label||'Date')+' from</label><input type="date" class="tt-date-from" value="'+PDMS.esc(state.dateFrom)+'"></div>'+
        '<div class="form-group"><label>to</label><input type="date" class="tt-date-to" value="'+PDMS.esc(state.dateTo)+'"></div>'
      ) : '';
      const hasActiveFilter = state.filter || state.dateFrom || state.dateTo || Object.keys(state.filters).some(k=>state.filters[k]);
      container.innerHTML =
        '<div class="table-tools">'+
          '<div class="form-group tt-search"><label>Search</label>'+
            '<div class="tt-search-box">'+ICONS.search+'<input class="tt-search-input" placeholder="Search…" value="'+PDMS.esc(state.filter)+'"></div>'+
          '</div>'+
          filterHtml+
          dateHtml+
          '<div class="tt-actions">'+
            (hasActiveFilter ? '<button class="btn btn-ghost btn-sm" data-act="clear">Clear</button>' : '')+
            '<button class="btn btn-secondary btn-sm" data-act="export">'+ICONS.download+' Export CSV</button>'+
            '<button class="btn btn-secondary btn-sm" data-act="print">Print</button>'+
          '</div>'+
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

      const searchInput = container.querySelector('.tt-search-input');
      if(searchInput) searchInput.addEventListener('input',e=>{state.filter=e.target.value;state.page=1;render('.tt-search-input');});
      const dFrom = container.querySelector('.tt-date-from');
      if(dFrom) dFrom.addEventListener('change',e=>{state.dateFrom=e.target.value;state.page=1;render();});
      const dTo = container.querySelector('.tt-date-to');
      if(dTo) dTo.addEventListener('change',e=>{state.dateTo=e.target.value;state.page=1;render();});
      const clearBtn = container.querySelector('[data-act="clear"]');
      if(clearBtn) clearBtn.addEventListener('click',()=>{
        state.filter=''; state.dateFrom=''; state.dateTo=''; state.filters={}; state.page=1; render();
      });
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

      if(focusSel){
        const el = container.querySelector(focusSel);
        if(el){ el.focus(); if(caret!=null && el.setSelectionRange){ try{ el.setSelectionRange(caret,caret); }catch(e){} } }
      }
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
      projForm: { type: (D.types && D.types[0]) || 'ERP', workstream: '', status: (D.salesStatuses && D.salesStatuses[0]) || 'Lead', price: '', awardVal: '', desc: '' }
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
              <label>Opportunity Value (₦)</label>
              <input id="swProjPrice" type="number" min="0" step="0.01" value="${PDMS.esc(wizardState.projForm.price || '')}" placeholder="0.00" />
            </div>
            <div class="form-row" id="swAwardRow" style="grid-column:1/-1;${(wizardState.projForm.status === 'Award/SLA' || wizardState.projForm.status === 'SLA Signed') ? '' : 'display:none'}">
              <label>Award Value (₦) <span style="font-size:12px;color:var(--primary);font-weight:600">(Exclusive of VAT)</span></label>
              <input id="swProjAward" type="number" min="0" step="0.01" value="${PDMS.esc(wizardState.projForm.awardVal || '')}" placeholder="0.00" />
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

          const clientPayload = {
            name, industry, email, phone, address, workedBefore, projects: 0,
            createdById: String((currentUser && currentUser.id) || ''),
            createdByName: String((currentUser && currentUser.name) || ''),
            createdAt: new Date().toISOString().slice(0, 10)
          };
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
          const awardInput = modalRef.querySelector('#swProjAward');
          const descInput = modalRef.querySelector('#swProjDesc');
          if (typeInput) wizardState.projForm.type = typeInput.value.trim();
          if (deptInput) wizardState.projForm.workstream = deptInput.value.trim();
          if (statusInput) wizardState.projForm.status = statusInput.value;
          if (priceInput) wizardState.projForm.price = priceInput.value.trim();
          if (awardInput) wizardState.projForm.awardVal = awardInput.value.trim();
          if (descInput) wizardState.projForm.desc = descInput.value.trim();

          wizardState.step = 2;
          renderModal();
        };

        const statusSelect = modalRef.querySelector('#swProjStatus');
        if (statusSelect) {
          statusSelect.onchange = () => {
            const val = statusSelect.value;
            wizardState.projForm.status = val;
            const awardRow = modalRef.querySelector('#swAwardRow');
            if (awardRow) awardRow.style.display = (val === 'Award/SLA' || val === 'SLA Signed') ? '' : 'none';
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
          const awardInputEl = modalRef.querySelector('#swProjAward');
          const awardRaw = awardInputEl ? awardInputEl.value.trim() : '';
          const awardVal = awardRaw === '' ? '' : Number(awardRaw);
          const desc = modalRef.querySelector('#swProjDesc').value.trim();

          const btn = this;
          PDMS.setButtonLoading(btn, true, 'Creating Lead...');

          const isSalesHeadCreator = currentUser && currentUser.role === 'Sales Head';
          const isAwardInitial = (status === 'SLA Signed' || status === 'Award/SLA');
          let initialStatus, initialStage;
          if (!isSalesHeadCreator) {
            // Every lead a Sales user creates goes to the Sales Head first —
            // whatever stage it was entered at, including Award/SLA.
            initialStatus = 'Awaiting Sales Head Approval';
            initialStage = 'Sales';
          } else if (isAwardInitial) {
            initialStatus = 'Awaiting Account Approval';
            initialStage = 'Delivery';
          } else {
            initialStatus = status;
            initialStage = 'Sales';
          }

          const isPrior = !!(wizardState.selectedClient && wizardState.selectedClient.workedBefore);
          const clientStatus = wizardState.clientMode === 'new' ? (isPrior ? 'New Client (Worked with before)' : 'New Client') : 'Existing Client';

          const record = {
            name: client, client, type, workstream, dept: workstream, sales: (currentUser && currentUser.name) || 'Sales Team', pm: '', lead: '', consultants: [],
            status: initialStatus, stage: initialStage, requestedStatus: status, createdByRole: currentUser.role, projectOwnerId: '', projectOwnerName: '', progress: 0, start: '', due: '', completion: null,
            negotiatedPrice: Number.isFinite(negotiatedPrice) ? negotiatedPrice : '',
            opportunityValue: Number.isFinite(negotiatedPrice) ? negotiatedPrice : '',
            awardValue: isAwardInitial ? (Number.isFinite(awardVal) ? awardVal : (Number.isFinite(negotiatedPrice) ? negotiatedPrice : '')) : '',
            description: desc, files: 0, remarks: 0,
            clientStatus, clientType: wizardState.clientMode || 'existing',
            workedBefore: isPrior,
            submissionCount: 1
          };
          const finalRecord = Object.assign({}, record, {
            projectOwnerId: String((currentUser && currentUser.id) || ''),
            projectOwnerName: String((currentUser && currentUser.name) || '')
          });

          const tmpId = 'TMP-' + Date.now();
          const tmp = Object.assign({ id: tmpId, _optimistic: true }, finalRecord);
          if (window.PDMS_REMOTE && Array.isArray(window.PDMS_REMOTE.projects)) {
            window.PDMS_REMOTE.projects.unshift(tmp);
          }
          if (D.projects && Array.isArray(D.projects)) {
            D.projects.unshift(tmp);
          }

          if (typeof opts.onSuccess === 'function') opts.onSuccess(tmp);

          PDMS.api.create('projects', finalRecord).then(saved => {
            const savedRecord = Object.assign({}, saved, {
              projectOwnerId: String((saved && saved.projectOwnerId) || (currentUser && currentUser.id) || ''),
              projectOwnerName: String((saved && saved.projectOwnerName) || (currentUser && currentUser.name) || '')
            });
            // Drop the optimistic TMP placeholder and any duplicate the api
            // layer may have already inserted, leaving exactly one real record.
            const reconcile = (arr) => {
              if (!Array.isArray(arr)) return;
              for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i] && (arr[i].id === tmpId || String(arr[i].id) === String(savedRecord.id))) arr.splice(i, 1);
              }
              arr.unshift(savedRecord);
            };
            reconcile(window.PDMS_REMOTE && window.PDMS_REMOTE.projects);
            if (D.projects && D.projects !== (window.PDMS_REMOTE && window.PDMS_REMOTE.projects)) reconcile(D.projects);
            modalRef.remove();
            if (savedRecord.status === 'Awaiting Sales Head Approval') {
              PDMS.workflowNotify('lead.created', savedRecord);
            } else if (savedRecord.status === 'Awaiting Account Approval') {
              PDMS.workflowNotify('award.submitted', savedRecord);
            }
            const toastMsg = isSalesHeadCreator ? 'Lead onboarded to sales pipeline' : 'Lead submitted for Sales Head approval';
            PDMS.toast('Lead created', toastMsg, 'success');
            if (opts.redirectUrl !== false && !location.pathname.endsWith('projects.html')) {
              // Navigating to the pipeline — hold the loading screen there until
              // fresh server data (with this lead) lands.
              try { sessionStorage.setItem('pdms-await-fresh', String(Date.now())); } catch (e) {}
              location.href = 'projects.html#view=sales';
            } else {
              // Staying on this page — show the loader while we re-fetch so the
              // list that comes back actually contains the new lead.
              PDMS.awaitFreshData('Saving your lead...', 'Updating the pipeline');
            }
          }).catch(err => {
            if (window.PDMS_REMOTE && Array.isArray(window.PDMS_REMOTE.projects)) {
              const rIdx = window.PDMS_REMOTE.projects.findIndex(p => p.id === tmpId);
              if (rIdx > -1) window.PDMS_REMOTE.projects.splice(rIdx, 1);
            }
            if (D.projects && Array.isArray(D.projects)) {
              const idx = D.projects.findIndex(p => p.id === tmpId);
              if (idx > -1) D.projects.splice(idx, 1);
            }
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
