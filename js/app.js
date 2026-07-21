/* PDMS Shell (sidebar, header, panels) */
(function(){
  const I = PDMS.icon;

  const NAV = [
    {section:'Main',items:[
      {id:'dashboard',label:'Dashboard',icon:'dashboard',href:'dashboard.html',roles:'*'},
      {id:'projects',label:'Projects',icon:'folder',href:'projects.html',roles:['COO','PM Head','PMO','Consultant']},
      {id:'timeline',label:'Project Timeline',icon:'activity',href:'timeline.html',roles:['HTD','COO','PM Head','PMO']},
      {id:'clients',label:'Clients',icon:'globe',href:'clients.html',roles:['Sales']},
      {id:'sales-pipeline',label:'Sales Pipeline',icon:'zap',href:'projects.html#view=sales',roles:['Sales','HR','HTD','COO','Project Manager']},
      {id:'delivery-projects',label:'Projects in Delivery',icon:'folder',href:'projects.html#view=delivery',roles:['Sales','HR','HTD','COO','Project Manager']},
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
          return '<a class="nav-item '+(activeId===it.id?'active':'')+'" href="'+href+'">'+I(it.icon)+'<span>'+it.label+'</span>'+(it.badge?'<span class="badge">'+it.badge+'</span>':'')+'</a>';
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
          '<div class="avatar">'+PDMS.initials(user.name)+'</div>'+
          '<div class="user-meta"><div class="name">'+PDMS.esc(user.name)+'</div><div class="role">'+PDMS.esc(user.role)+'</div></div>'+
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
            '<div class="avatar avatar-sm" title="'+PDMS.esc(user.name)+'">'+PDMS.initials(user.name)+'</div>'+
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
