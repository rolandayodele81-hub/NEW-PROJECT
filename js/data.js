/* ============================================
   PSE PDMS - Data Schema
   ============================================ */
(function(global){
  const roles = ['General Admin','HR','HTD','COO','Lead PM','Project Manager','Consultant','Sales'];
  const types = ['Infrastructure','Software Development','Consulting','Digital Transformation','Cloud Migration','ERP Implementation','Cybersecurity','Data Analytics','Mobile App','Web Platform'];
  const priorities = ['Critical','High','Medium','Low'];
  const statuses = ['Incoming','Approved','Assigned','Planning','In Progress','Awaiting Review','Revision','Completed','Closed','Cancelled'];
  const statusColors = {
    'Incoming':'info','Approved':'primary','Assigned':'purple','Planning':'info',
    'In Progress':'warn','Awaiting Review':'warn','Revision':'danger',
    'Completed':'success','Closed':'muted','Cancelled':'danger'
  };
  const prioColors = {'Critical':'prio-critical','High':'prio-high','Medium':'prio-medium','Low':'prio-low'};

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

  const departments = loadCollection('departments', [
    { id:'D01', name:'Human Resources', head:'Alice Park', count:12, color:'primary' },
    { id:'D02', name:'Engineering', head:'Marcus Lee', count:28, color:'success' },
    { id:'D03', name:'Sales', head:'Naomi Chen', count:9, color:'info' }
  ]);
  const users = loadCollection('users', [
    { id:'U001', name:'General Admin', email:'admin@pse.com', password:'admin123', role:'General Admin', dept:'Executive', status:'Active', availability:'Available', workload:10, phone:'+1234567890', joined:'2026-01-15' }
  ]);
  const consultants = loadCollection('consultants', [
    { id:'C001', name:'Mark Smith', email:'mark@company.com', role:'Consultant', dept:'Engineering', status:'Active', availability:'Available', workload:32, phone:'+1234567890', joined:'2026-03-12', specialty:'Cloud Architect', rate:150, projects:3, rating:'4.8' }
  ]);
  const clients = loadCollection('clients', [
    { id:'CL001', name:'Acme Corp', industry:'Banking', contact:'Jane Doe', email:'contact@acme.com', phone:'+1234567890', projects:5, revenue:250000 }
  ]);
  const projects = loadCollection('projects', [
    { id:'PSE-1001', name:'Alpha Platform', client:'Acme Corp', type:'Software Development', dept:'Engineering', sales:'Alice Johnson', pm:'John Smith', lead:'Emily Clark', consultants:['Mark Smith'], priority:'High', budget:350000, status:'In Progress', progress:45, start:'2026-04-01', due:'2026-09-01', completion:null, description:'Project description goes here.', files:4, remarks:2 }
  ]);
  const notifications = loadCollection('notifications', [
    { id:'N001', title:'New project request', msg:'A client has submitted a new project intake.', icon:'activity', time:'2h ago', unread:true }
  ]);
  const threads = loadCollection('threads', [
    { id:'T001', user:{name:'Jane Doe'}, messages:[{from:'me',text:'Can you share the latest update?',time:'1h ago'}], unread:1, last:'Can you share the latest update?' }
  ]);
  const activities = loadCollection('activities', [
    { id:'A001', user:'General Admin', role:'General Admin', action:'created', target:'Alpha Platform', time:'2h ago' }
  ]);

  // Example record templates for guidance:
  // departments: { id:'D01', name:'Human Resources', head:'Name Surname', count:12, color:'primary' }
  // users: { id:'U001', name:'Jane Doe', email:'jane@company.com', role:'General Admin', dept:'Human Resources', status:'Active', availability:'Available', workload:45, phone:'+1234567890', joined:'2026-01-15' }
  // consultants: { id:'U010', name:'Mark Smith', email:'mark@company.com', role:'Consultant', dept:'Engineering', status:'Active', availability:'Available', workload:32, phone:'+1234567890', joined:'2026-03-12', specialty:'Cloud Architect', rate:150, projects:3, rating:'4.8' }
  // clients: { id:'C001', name:'Acme Corp', industry:'Banking', contact:'Jane Doe', email:'contact@acme.com', phone:'+1234567890', projects:5, revenue:250000 }
  // projects: { id:'PSE-1001', name:'Alpha Platform', client:'Acme Corp', type:'Software Development', dept:'Engineering', sales:'Alice Johnson', pm:'John Smith', lead:'Emily Clark', consultants:['Mark Smith','Sara Lee'], priority:'High', budget:350000, status:'In Progress', progress:45, start:'2026-04-01', due:'2026-09-01', completion:null, description:'Project description goes here.', files:4, remarks:2 }
  // notifications: { id:'N001', title:'Notification title', msg:'Notification details', icon:'info', time:'2h ago', unread:true }
  // threads: { id:'T001', user:{name:'Jane Doe'}, messages:[{from:'me',text:'Message text',time:'1h ago'}], unread:1, last:'Message text' }
  // activities: { id:'A001', user:'Jane Doe', role:'General Admin', action:'created', target:'Project Alpha', time:'2h ago' }

  function tasksFor(projectId){
    return [
      // { id: projectId + '-T01', title: 'Task name', assignee: 'Jane Doe', status: 'Pending', due: '2026-05-01', progress: 0 }
    ];
  }

  global.PDMS_DATA = {
    departments, users, consultants, clients, projects,
    notifications, threads, activities,
    roles, types, priorities, statuses,
    statusColors, prioColors,
    tasksFor
  };
})(window);
