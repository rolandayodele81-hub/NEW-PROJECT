/* PDMS Shell (sidebar, header, panels) */
(function(){
  const I = PDMS.icon;

  const NAV = [
    {section:'Main',items:[
      {id:'dashboard',label:'Dashboard',icon:'dashboard',href:'dashboard.html',roles:'*'},
      {id:'projects',label:'Projects',icon:'folder',href:'projects.html',roles:['HR','COO','HTD','PM Head','PMO','Sales','Consultant']},
      {id:'timeline',label:'Project Timeline',icon:'activity',href:'timeline.html',roles:['HTD','COO','PM Head','PMO']},
    ]},
    {section:'Management',items:[
      {id:'users',label:'Users',icon:'users',href:'users.html',roles:['HR']},
      {id:'consultants',label:'Consultants',icon:'briefcase',href:'consultants.html',roles:['HR','COO','HTD','PM Head','PMO']},
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
          '<div class="search"><span>'+I('search')+'</span><input id="globalSearch" placeholder="Search projects, users, clients, messages..."/></div>'+
          '<div class="header-actions">'+
            '<button class="icon-btn" id="themeToggle" title="Toggle theme">'+I(theme==='light'?'moon':'sun')+'</button>'+
            '<button class="icon-btn" id="notifBtn" title="Notifications">'+I('bell')+'<span class="dot"></span></button>'+
            '<button class="icon-btn" id="msgBtn" title="Messages">'+I('message')+'<span class="dot"></span></button>'+
            '<div class="avatar avatar-sm" title="'+PDMS.esc(user.name)+'">'+PDMS.initials(user.name)+'</div>'+
          '</div>'+
        '</header>'+
        '<main class="content" id="content"></main>'+
      '</div>'+
    '</div>'+
    '<div class="panel" id="notifPanel"></div>'+
    '<div class="panel" id="msgPanel"></div>';

    document.getElementById('hamburger').onclick = ()=>document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('themeToggle').onclick = PDMS.toggleTheme;
    document.getElementById('logoutBtn').onclick = confirmLogout;
    document.getElementById('notifBtn').onclick = ()=>togglePanel('notif');
    document.getElementById('msgBtn').onclick = ()=>togglePanel('msg');
    document.getElementById('globalSearch').addEventListener('keydown',e=>{
      if(e.key==='Enter'){ location.href='search.html?q='+encodeURIComponent(e.target.value); }
    });
    renderNotifPanel();
    renderMsgPanel();
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
    const other = which==='notif'?'msg':'notif';
    document.getElementById(other+'Panel').classList.remove('open');
    document.getElementById(which+'Panel').classList.toggle('open');
  }
  document.addEventListener('click',e=>{
    if(!e.target.closest('.panel') && !e.target.closest('#notifBtn') && !e.target.closest('#msgBtn')){
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
  function renderMsgPanel(){
    const p = document.getElementById('msgPanel');
    p.innerHTML = '<div class="panel-head"><h3>Messages</h3><a href="messages.html" class="text-sm" style="color:var(--primary)">Open inbox</a></div><div class="panel-body">'+
      PDMS_DATA.threads.slice(0,8).map(t=>'<div class="notif"><div class="avatar">'+PDMS.initials(t.user.name)+'</div><div style="flex:1;min-width:0"><div class="n-title">'+PDMS.esc(t.user.name)+'</div><div class="n-msg" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+PDMS.esc(t.last)+'</div></div>'+(t.unread?'<span class="badge badge-primary">'+t.unread+'</span>':'')+'</div>').join('')+
    '</div>';
  }
})();
