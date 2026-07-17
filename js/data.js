/* ============================================
   PSE PDMS - Data Schema
   ============================================ */
(function(global){
  const roles = ['System Administrator','HR','COO','HTD','PM Head','PMO','Sales','Consultant'];
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
  const projects = loadCollection('projects', []);
  const notifications = loadCollection('notifications', []);
  const threads = loadCollection('threads', []);
  const activities = loadCollection('activities', []);

  function tasksFor(projectId){
    return [];
  }

  global.PDMS_DATA = {
    departments, users, consultants, clients, projects,
    notifications, threads, activities,
    roles, types, priorities, statuses,
    statusColors, prioColors,
    tasksFor
  };
})(window);