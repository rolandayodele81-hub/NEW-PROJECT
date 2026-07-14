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
    zap:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
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
  PDMS.getUsers = function(){ return (window.PDMS_DATA && window.PDMS_DATA.users) || []; };
  PDMS.findUserByEmail = function(email){
    const e = String(email||'').trim().toLowerCase();
    return PDMS.getUsers().find(u=>String(u.email||'').trim().toLowerCase()===e);
  };
  // Both return Promises — the backend hashes/verifies passwords, the client never sees a hash.
  PDMS.authenticate = function(email,password){ return PDMS.api.login(email,password); };
  PDMS.registerUser = function(account){ return PDMS.api.register(account); };
  PDMS.isAdmin = function(){ const user = PDMS.getUser(); return user && user.role==='General Admin'; };
  PDMS.requireAdmin = function(){ if(!PDMS.isAdmin()) location.href='dashboard.html'; };
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

  // Money & date fmt
  PDMS.money = n => '$'+Number(n).toLocaleString();
  PDMS.initials = name => name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();

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
        if(state.filters[k]) arr = arr.filter(r=>String(r[k])===state.filters[k]);
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
        (slice.length?slice.map(r=>'<tr>'+opts.columns.map(c=>'<td>'+(c.render?c.render(r):PDMS.esc(r[c.key]??''))+'</td>').join('')+'</tr>').join(''):'<tr><td colspan="'+opts.columns.length+'" style="text-align:center;padding:32px;color:var(--text-muted)">loading records...</td></tr>')+
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
  PDMS.modal = function(title, bodyHtml, footHtml){
    const back=document.createElement('div');
    back.className='modal-backdrop open';
    back.innerHTML = '<div class="modal"><div class="modal-head"><h3 class="card-title">'+title+'</h3><button class="icon-btn" data-close>'+ICONS.close+'</button></div><div class="modal-body">'+bodyHtml+'</div>'+(footHtml?'<div class="modal-foot">'+footHtml+'</div>':'')+'</div>';
    document.body.appendChild(back);
    back.addEventListener('click',e=>{ if(e.target===back||e.target.closest('[data-close]')) back.remove(); });
    return back;
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
      const pad = {l:36,r:12,t:12,b:24};
      const max = Math.max(...values)*1.15||1;
      const gw = W-pad.l-pad.r, gh = H-pad.t-pad.b;
      ctx.strokeStyle = getCss('--border'); ctx.fillStyle=getCss('--text-soft'); ctx.font='11px Inter';
      for(let i=0;i<=4;i++){
        const y = pad.t + gh*i/4;
        ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
        ctx.fillText(Math.round(max-max*i/4),4,y+3);
      }
      const bw = gw/values.length*0.6;
      const c = color||getCss('--primary');
      values.forEach((v,i)=>{
        const x = pad.l + gw*(i+0.5)/values.length - bw/2;
        const bh = gh*(v/max);
        const y = pad.t+gh-bh;
        const grad = ctx.createLinearGradient(0,y,0,y+bh);
        grad.addColorStop(0,c);grad.addColorStop(1,c+'80');
        ctx.fillStyle=grad;
        roundRect(ctx,x,y,bw,bh,6);ctx.fill();
        ctx.fillStyle=getCss('--text-soft');
        ctx.fillText(labels[i]||'',x-2,H-6);
      });
    },
    donut(canvas, values, colors, labels){
      const ctx=canvas.getContext('2d');
      const dpr = window.devicePixelRatio||1;
      const W = canvas.clientWidth, H = canvas.clientHeight;
      canvas.width=W*dpr; canvas.height=H*dpr; ctx.scale(dpr,dpr);
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2, r=Math.min(W,H)/2-10, ir=r*0.62;
      const total = values.reduce((a,b)=>a+b,0)||1;
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
      ctx.fillText(total,cx,cy);
      ctx.fillStyle=getCss('--text-muted');ctx.font='11px Inter';
      ctx.fillText('Total',cx,cy+16);
    }
  };
  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  }
  function getCss(v){
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim()||'#1d3c88';
  }
})(window);
