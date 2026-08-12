/* ============================================
   PSE PDMS - Data Schema
   ============================================ */
(function(global){
  const roles = ['System Administrator','HR','COO','HTD','PM Head','PMO','Accounts','Sales','Consultant'];
  const types = ['Infrastructure','Software Development','Consulting','Digital Transformation','Cloud Migration','ERP Implementation','Cybersecurity','Data Analytics','Mobile App','Web Platform'];
  const priorities = ['Critical','High','Medium','Low'];
  const workstreams = ['Cloud Engineering','Cybersecurity','Data Analytics','Digital Transformation','ERP Implementation','Infrastructure','Mobile Development','Software Development','Web Platform','Business Consulting','General'];
  const salesJourney = ['Initial Proposal','Lead','Opportunity','Negotiation','Invoicing','Award/SLA'];
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
  const salesStatuses = [...salesJourney, 'Closed','On Hold','Cancelled'];
  const deliveryStatuses = ['Not Started','In Progress','On Hold','Awaiting Review','Testing / Quality Assurance','Completed','Closed','Cancelled'];
  const inProgressSubStatuses = ['Design','Development','Testing / QA / Internal Testing','Deployment','UAT','Release'];
  const statuses = [...salesStatuses, 'Awaiting Account Approval', ...deliveryStatuses.filter(s=>!salesStatuses.includes(s))];
  const statusColors = {
    'Initial Proposal':'primary','Lead':'info','Opportunity':'purple',
    'Negotiation':'warn','Invoicing':'warn','Award/SLA':'success',
    'Awaiting Account Approval':'purple',
    'Closed':'primary','Cancelled':'danger','On Hold':'muted',
    'Not Started':'muted','In Progress':'warn','Awaiting Review':'warn',
    'Testing / Quality Assurance':'purple','Completed':'success'
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
  const projects = loadCollection('projects', []);
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
})(window);