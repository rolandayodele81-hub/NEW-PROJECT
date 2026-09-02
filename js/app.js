/* PDMS Shell (sidebar, header, panels) */
(function(){
  const I = PDMS.icon;

  const NAV = [
    {section:'Main',items:[
      {id:'dashboard',label:'Dashboard',icon:'dashboard',href:'dashboard.html',roles:'*'},
      {id:'projects',label:'Projects',icon:'folder',href:'projects.html',roles:['COO','Consultant']},
      {id:'clients',label:'Clients',icon:'globe',href:'clients.html',roles:['Sales','Sales Head']},
      {id:'sales-pipeline',label:'Sales Pipeline',icon:'zap',href:'projects.html#view=sales',roles:['Sales','Sales Head','HR','HTD','COO','PM Head','Project Manager','Accounts']},
      {id:'awaiting-approval',label:'Awaiting Projects',icon:'clock',href:'awaiting-projects.html',roles:['Accounts','PM Head','COO','HTD']},
      {id:'awaiting-sales-approval',label:'Awaiting Approval',icon:'clock',href:'awaiting-projects.html',roles:['Sales Head']},
      {id:'delivery-projects',label:'Projects in Delivery',icon:'folder',href:'projects.html#view=delivery',roles:['Sales','Sales Head','HR','HTD','COO','PM Head','PMO','Project Manager','Accounts']},
    ]},
    {section:'Management',items:[
      {id:'users',label:'Users',icon:'users',href:'users.html',roles:['HR']},
      {id:'consultants',label:'Consultants',icon:'briefcase',href:'consultants.html',roles:['HR','COO','HTD','PM Head','PMO','Project Manager']},
    ]},
    {section:'Community',items:[
      {id:'notifications',label:'Notifications',icon:'bell',href:'notifications.html',roles:'*'},
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
            '<div class="avatar avatar-sm" title="'+PDMS.esc(user.name)+'" style="cursor:pointer" onclick="location.href=\'profile.html\'">'+PDMS.initials(user.name)+'</div>'+
          '</div>'+
        '</header>'+
        '<main class="content" id="content"></main>'+
      '</div>'+
    '</div>'+
    '<div class="panel" id="notifPanel"></div>'+
    '<div id="pdmsSplashLoader" class="pdms-splash-loader' + (window.PDMS_DATA_LOADED ? ' hidden' : '') + '">' +
      '<div class="pdms-splash-content">' +
        '<div class="pdms-rolling-loader-box">' +
          '<div class="pdms-rolling-spinner"></div>' +
        '</div>' +
        '<h2 class="pdms-splash-title" id="pdmsSplashTitle">Loading your workspace...</h2>' +
        '<p class="pdms-splash-sub" id="pdmsSplashSub">Retrieving data from database</p>' +
      '</div>' +
    '</div>';

    // Splash screen stays visible until live database data has landed
    if (!window.PDMS_DATA_LOADED) {
      const stop = () => {
        setTimeout(PDMS.hideSplashLoader, 150);
      };
      document.addEventListener('pdms:refresh', stop, { once: true });
      document.addEventListener('pdms:data-ready', stop, { once: true });
      document.addEventListener('pdms:loading-end', stop, { once: true });
      // Safety ceiling only — normally the events above end the splash. Kept
      // generous because a cold Apps Script bootstrap can take ~20s, and hiding
      // the splash early just reveals a blank page.
      setTimeout(stop, 30000);
    }

    // Just created a record on the previous page? Keep the splash up until the
    // *server* round-trip finishes (pdms:loading-end fires only from the network
    // response, not the cache-first paint), so the user lands on a list that
    // actually contains what they just made instead of a stale one.
    try {
      const pendingFresh = sessionStorage.getItem('pdms-await-fresh');
      if (pendingFresh && (Date.now() - Number(pendingFresh)) < 60000) {
        PDMS.showSplashLoader('Saving...', 'Getting the latest data');
        const doneFresh = () => {
          try { sessionStorage.removeItem('pdms-await-fresh'); } catch (e) {}
          setTimeout(PDMS.hideSplashLoader, 150);
        };
        document.addEventListener('pdms:loading-end', doneFresh, { once: true });
        setTimeout(doneFresh, 30000);
      } else if (pendingFresh) {
        sessionStorage.removeItem('pdms-await-fresh');
      }
    } catch (e) {}

    document.getElementById('hamburger').onclick = ()=>document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('themeToggle').onclick = PDMS.toggleTheme;
    document.getElementById('logoutBtn').onclick = confirmLogout;
    document.getElementById('notifBtn').onclick = ()=>togglePanel('notif');
    document.getElementById('globalSearch').addEventListener('keydown',e=>{
      if(e.key==='Enter'){ location.href='search.html?q='+encodeURIComponent(e.target.value); }
    });
    renderNotifPanel();
    document.addEventListener('pdms:refresh', ()=>{ renderNotifPanel(); maybeShowUnreadPopup(activeId); });
    document.addEventListener('pdms:data-ready', ()=>{ renderNotifPanel(); maybeShowUnreadPopup(activeId); });
    document.addEventListener('pdms:notifications-changed', renderNotifPanel);
    maybeShowUnreadPopup(activeId); // in case data was already cached/loaded
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
    if(!p) return;
    const mine = (PDMS.notificationsFor ? PDMS.notificationsFor() : (PDMS_DATA.notifications || []));
    const sorted = mine.slice().sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
    const list = sorted.slice(0, 10);
    const unread = mine.filter(n=>n.unread).length;
    const dot = document.querySelector('#notifBtn .dot');
    if(dot) dot.style.display = unread ? 'block' : 'none';
    p.innerHTML = '<div class="panel-head"><h3>Notifications</h3><a href="notifications.html" class="text-sm" style="color:var(--primary)">View all</a></div><div class="panel-body">'+
      (list.length ? list.map(n=>'<div class="notif '+(n.unread?'unread':'')+'" '+(n.link?'style="cursor:pointer" onclick="location.href=\''+PDMS.esc(n.link)+'\'"':'')+'><div class="n-icon">'+I(n.icon)+'</div><div><div class="n-title">'+PDMS.esc(n.title)+'</div><div class="n-msg">'+PDMS.esc(n.msg)+'</div><div class="n-time">'+PDMS.timeAgo(n.time)+'</div></div></div>').join('')
        : '<div style="padding:24px 16px;text-align:center;color:var(--text-muted);font-size:13px">No notifications</div>')+
    '</div>';
  }

  // Login popup: the first time the user reaches their dashboard in a session,
  // if they have any unread notification, show a generic modal telling them so.
  // Generic by design — no per-notification detail. Shown once per login
  // (PDMS.setUser / logout clear the session flag).
  let unreadPopupHandled = false;
  function maybeShowUnreadPopup(activeId){
    if(unreadPopupHandled || activeId !== 'dashboard') return;
    let alreadyShown = false;
    try { alreadyShown = sessionStorage.getItem('pdms-unread-popup-shown') === '1'; } catch(e){}
    if(alreadyShown){ unreadPopupHandled = true; return; }
    // Need data to know the count. Cache-first paint gives us something quickly;
    // if the count is 0 but the live fetch is still running, wait for it before
    // concluding there's nothing to show.
    if(!window.PDMS_DATA_LOADED && !window.PDMS_REMOTE) return;
    let count = 0;
    try { count = PDMS.unreadCountFor ? PDMS.unreadCountFor() : 0; } catch(e){ count = 0; }
    if(!count && window.PDMS_IS_LOADING) return; // live data still coming — re-check on next event
    unreadPopupHandled = true;
    try { sessionStorage.setItem('pdms-unread-popup-shown', '1'); } catch(e){}
    if(!count) return;
    setTimeout(()=>{  // let the splash loader clear first
      const m = PDMS.modal(
        'You have notifications',
        '<div style="display:flex;gap:14px;align-items:flex-start">'+
          '<div style="width:40px;height:40px;border-radius:12px;flex-shrink:0;display:grid;place-items:center;background:var(--primary-50);color:var(--primary)">'+I('bell')+'</div>'+
          '<p class="text-sm text-muted" style="margin:0;line-height:1.5">You have <strong style="color:var(--text)">'+count+'</strong> unread notification'+(count===1?'':'s')+'. Open your notifications to see what needs your attention.</p>'+
        '</div>',
        '<button class="btn btn-ghost" data-close>Dismiss</button><button class="btn btn-primary" id="pdmsGoNotifsBtn">View notifications</button>'
      );
      m.querySelector('.modal').classList.add('modal-sm');
      const b = m.querySelector('#pdmsGoNotifsBtn');
      if(b) b.onclick = ()=>{ location.href = 'notifications.html'; };
    }, 400);
  }
})();
