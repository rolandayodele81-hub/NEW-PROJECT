/* ============================================
   PSE PDMS - Seed Data
   ============================================ */
(function(global){
  const rand = (n)=>Math.floor(Math.random()*n);
  const pick = (a)=>a[rand(a.length)];
  const between = (a,b)=>a+rand(b-a+1);

  const firstNames = ['Roland','John','Mary','Aisha','Chidi','Ngozi','Ahmed','Fatima','David','Sarah','Michael','Grace','Emeka','Zainab','Kenneth','Blessing','Ibrahim','Halima','Tunde','Chioma','Peter','Ruth','Samuel','Esther','Daniel','Rachel','James','Amara','Kelvin','Bola','Femi','Yusuf','Ada','Uche','Segun','Lola','Ken','Ify','Obinna','Nkechi','Kelechi','Tobi','Yemi','Kunle','Bukola','Musa','Nneka','Ola','Kemi','Chinedu'];
  const lastNames = ['Okafor','Ibrahim','Adeyemi','Bello','Eze','Nwosu','Musa','Ogundipe','Balogun','Umar','Chukwu','Okoro','Ade','Yakubu','Danjuma','Salami','Obi','Okonkwo','Lawal','Adebayo','Suleiman','Okeke','Njoku','Oluwole','Aliyu','Kalu','Onyeka','Dogo','Anibaba','Uzoma'];
  const departments = [
    {id:'D01',name:'Human Resources',head:'Aisha Ibrahim',count:8,color:'primary'},
    {id:'D02',name:'Head of Technical Delivery',head:'Roland Okafor',count:6,color:'purple'},
    {id:'D03',name:'Operations (COO)',head:'John Adeyemi',count:10,color:'success'},
    {id:'D04',name:'Sales & Business Dev',head:'Mary Bello',count:12,color:'warn'},
    {id:'D05',name:'Project Management',head:'Chidi Eze',count:15,color:'info'},
    {id:'D06',name:'Engineering',head:'Ngozi Nwosu',count:24,color:'primary'},
    {id:'D07',name:'Design & UX',head:'Ahmed Musa',count:9,color:'pink'},
    {id:'D08',name:'Quality Assurance',head:'Fatima Ogundipe',count:7,color:'success'},
    {id:'D09',name:'Finance',head:'David Balogun',count:6,color:'warn'},
    {id:'D10',name:'General Administration',head:'Sarah Umar',count:5,color:'muted'}
  ];
  const roles = ['General Admin','HR','HTD','COO','Lead PM','Project Manager','Consultant','Sales'];
  const clients = ['NNPC Ltd','MTN Nigeria','Dangote Group','GTBank','Zenith Bank','Access Bank','First Bank','Nestle Nigeria','Chevron','Shell Nigeria','Total Energies','Airtel Africa','Flutterwave','Interswitch','Andela','Konga','Jumia','PZ Cussons','Union Bank','Sterling Bank'];
  const types = ['Infrastructure','Software Development','Consulting','Digital Transformation','Cloud Migration','ERP Implementation','Cybersecurity','Data Analytics','Mobile App','Web Platform'];
  const priorities = ['Critical','High','Medium','Low'];
  const statuses = ['Incoming','Approved','Assigned','Planning','In Progress','Awaiting Review','Revision','Completed','Closed','Cancelled'];
  const statusColors = {
    'Incoming':'info','Approved':'primary','Assigned':'purple','Planning':'info',
    'In Progress':'warn','Awaiting Review':'warn','Revision':'danger',
    'Completed':'success','Closed':'muted','Cancelled':'danger'
  };
  const prioColors = {'Critical':'prio-critical','High':'prio-high','Medium':'prio-medium','Low':'prio-low'};

  // Users (50)
  const users = [];
  for(let i=1;i<=50;i++){
    const first = pick(firstNames), last = pick(lastNames);
    const role = i<=2?'General Admin':i<=5?'HR':i<=7?'HTD':i<=9?'COO':i<=13?'Lead PM':i<=22?'Project Manager':i<=42?'Consultant':'Sales';
    users.push({
      id:'U'+String(i).padStart(3,'0'),
      name:first+' '+last,
      email:(first+'.'+last).toLowerCase()+'@panoramicsynergy.com',
      role,
      dept:pick(departments).name,
      status:Math.random()>0.15?'Active':(Math.random()>0.5?'Suspended':'On Leave'),
      availability:Math.random()>0.4?'Available':'Busy',
      workload:between(20,100),
      phone:'+234 80'+between(10000000,99999999),
      joined:new Date(2020+rand(5),rand(12),1+rand(28)).toISOString().slice(0,10),
    });
  }
  // Ensure Roland is HTD
  users[0] = {...users[0],name:'Roland Okafor',role:'HTD',status:'Active',availability:'Available'};

  // Consultants (30) - subset of users
  const consultants = users.filter(u=>u.role==='Consultant').map(u=>({
    ...u,
    specialty:pick(['Cloud Architect','Data Engineer','Full-Stack Dev','Security Analyst','UX Designer','DevOps Engineer','Business Analyst','ERP Specialist','Mobile Dev','QA Lead']),
    rate:between(50,250),
    projects:between(1,6),
    rating:(3.5+Math.random()*1.5).toFixed(1)
  }));

  // Clients (20)
  const clientList = clients.map((c,i)=>({
    id:'C'+String(i+1).padStart(3,'0'),
    name:c,
    industry:pick(['Oil & Gas','Banking','Telecom','FMCG','Fintech','Tech','Retail','Manufacturing']),
    contact:pick(firstNames)+' '+pick(lastNames),
    email:'contact@'+c.toLowerCase().replace(/[^a-z]/g,'')+'.com',
    phone:'+234 80'+between(10000000,99999999),
    projects:between(1,12),
    revenue:between(50000,5000000)
  }));

  // Projects (100)
  const projects = [];
  const projectAdjs = ['Alpha','Beta','Nexus','Horizon','Quantum','Fusion','Titan','Vertex','Zenith','Odyssey','Falcon','Phoenix','Nova','Apex','Orion','Atlas','Sigma','Delta','Prime','Neo','Genesis','Legacy','Vanguard','Pinnacle','Elevate','Ignite','Momentum','Cascade','Vector','Meridian'];
  const projectNouns = ['Migration','Platform','Portal','Integration','Rollout','Modernization','Upgrade','Analytics','Suite','Framework','Pipeline','Ecosystem','Gateway','Cloud','Network','App','Dashboard','Automation'];
  for(let i=1;i<=100;i++){
    const start = new Date(2025,rand(12),1+rand(28));
    const due = new Date(start); due.setDate(due.getDate()+between(30,180));
    const status = pick(statuses);
    const progress = status==='Completed'||status==='Closed'?100:status==='Incoming'||status==='Approved'?0:between(5,95);
    const pm = pick(users.filter(u=>u.role==='Project Manager'||u.role==='Lead PM'));
    const lead = pick(users.filter(u=>u.role==='Lead PM'));
    const sales = pick(users.filter(u=>u.role==='Sales'));
    const projConsultants = [];
    for(let j=0;j<between(2,5);j++) projConsultants.push(pick(consultants));
    projects.push({
      id:'PSE-'+String(1000+i),
      name:pick(projectAdjs)+' '+pick(projectNouns),
      client:pick(clientList).name,
      type:pick(types),
      dept:pick(departments).name,
      sales:sales.name,
      pm:pm.name,
      lead:lead.name,
      consultants:[...new Set(projConsultants.map(c=>c.name))],
      priority:pick(priorities),
      budget:between(50000,2000000),
      status,
      progress,
      start:start.toISOString().slice(0,10),
      due:due.toISOString().slice(0,10),
      completion:status==='Completed'?due.toISOString().slice(0,10):null,
      description:'Enterprise-grade '+pick(types).toLowerCase()+' engagement to deliver measurable outcomes across the client organization.',
      files:between(2,20),
      remarks:between(0,8),
    });
  }

  // Notifications (50)
  const notifTypes = [
    {t:'Project Assigned',i:'briefcase',msg:(p)=>'You have been assigned to '+p.name},
    {t:'Deadline Changed',i:'clock',msg:(p)=>'Deadline updated for '+p.name},
    {t:'Consultant Added',i:'user-plus',msg:(p)=>'A new consultant joined '+p.name},
    {t:'Task Completed',i:'check',msg:(p)=>'A task in '+p.name+' was completed'},
    {t:'Remark Added',i:'message',msg:(p)=>'New remark on '+p.name},
    {t:'Status Changed',i:'refresh',msg:(p)=>p.name+' status: '+p.status},
    {t:'Deliverable Uploaded',i:'upload',msg:(p)=>'New deliverable uploaded to '+p.name}
  ];
  const notifications = [];
  for(let i=0;i<50;i++){
    const p = pick(projects);
    const n = pick(notifTypes);
    notifications.push({
      id:'N'+i,title:n.t,msg:n.msg(p),icon:n.i,
      time:between(1,720)+'m ago',unread:Math.random()>0.5
    });
  }

  // Messages (100) - grouped in threads
  const threads = [];
  const threadUsers = users.slice(0,10);
  threadUsers.forEach((u,i)=>{
    const msgs=[];
    for(let j=0;j<between(3,10);j++){
      msgs.push({
        from:Math.random()>0.5?'me':u.name,
        text:pick([
          'Any update on the deliverables?','I just uploaded the report.','Meeting at 3pm today.',
          'Client requested a revision on scope.','Please review the attached document.',
          'Timeline looks tight — can we push by a day?','Consultant assignment confirmed.',
          'Great work on the milestone!','Can you share the latest status?','Approved — proceed to next phase.'
        ]),
        time:between(1,72)+'h ago'
      });
    }
    threads.push({
      id:'T'+i,user:u,messages:msgs,unread:i<3?between(1,5):0,
      last:msgs[msgs.length-1].text
    });
  });

  // Activity logs (50)
  const activities = [];
  for(let i=0;i<50;i++){
    const u = pick(users), p = pick(projects);
    const action = pick([
      {a:'assigned',what:p.name},
      {a:'completed',what:p.name},
      {a:'uploaded deliverables to',what:p.name},
      {a:'reassigned consultant on',what:p.name},
      {a:'changed status of',what:p.name+' to '+p.status},
      {a:'updated deadline for',what:p.name},
      {a:'added remark on',what:p.name},
      {a:'created project',what:p.name}
    ]);
    activities.push({
      id:'A'+i,user:u.name,role:u.role,action:action.a,target:action.what,
      time:between(1,720)+'m ago'
    });
  }

  // Tasks per project (sample for detail page)
  function tasksFor(projectId){
    const arr=[];
    const titles=['Requirements gathering','Solution architecture','Design mockups','Backend implementation','Frontend implementation','API integration','QA testing','UAT','Deployment','Documentation','Client training','Go-live'];
    titles.forEach((t,i)=>{
      arr.push({
        id:projectId+'-T'+i,title:t,
        assignee:pick(users).name,
        status:i<4?'Completed':i<7?'In Progress':'Pending',
        due:new Date(Date.now()+i*7*86400000).toISOString().slice(0,10),
        progress:i<4?100:i<7?between(30,80):0
      });
    });
    return arr;
  }

  global.PDMS_DATA = {
    users, consultants, departments, clients:clientList, projects,
    notifications, threads, activities, roles, statuses, priorities,
    statusColors, prioColors, tasksFor
  };
})(window);
