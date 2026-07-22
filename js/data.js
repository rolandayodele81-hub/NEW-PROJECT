/* ============================================
   PSE PDMS - Data Schema
   ============================================ */
(function(global){
  const roles = ['System Administrator','HR','COO','HTD','PM Head','PMO','Sales','Consultant','Project Manager','Graduate Trainee','Intern'];
  const types = ['Infrastructure','Software Development','Consulting','Digital Transformation','Cloud Migration','ERP Implementation','Cybersecurity','Data Analytics','Mobile App','Web Platform'];
  const priorities = ['Critical','High','Medium','Low'];
  const workstreams = ['Cloud Engineering','Cybersecurity','Data Analytics','Digital Transformation','ERP Implementation','Infrastructure','Mobile Development','Software Development','Web Platform','Business Consulting','General'];
  // Sales pipeline stages in order; Delivery uses its own vocabulary.
  const salesStatuses = ['Incoming','Initial Contact','Requirement Gathering','Proposal Sent','Negotiation','PO / Award Granted','SLA Signed','Awaiting Client Approval','Closed','On Hold','Cancelled'];
  const deliveryStatuses = ['Not Started','In Progress','On Hold','Awaiting Review','Testing / Quality Assurance','Completed','Closed','Cancelled'];
  const statuses = ['Incoming','Initial Contact','Requirement Gathering','Proposal Sent','Negotiation','PO / Award Granted','SLA Signed','Awaiting Client Approval','Closed','Cancelled','On Hold','Not Started','In Progress','Awaiting Review','Testing / Quality Assurance','Completed'];
  const statusColors = {
    'Incoming':'info','Initial Contact':'primary','Requirement Gathering':'purple',
    'Proposal Sent':'warn','Negotiation':'warn','PO / Award Granted':'warn',
    'SLA Signed':'success','Awaiting Client Approval':'warn',
    'Closed':'primary','Cancelled':'danger','On Hold':'muted',
    'Not Started':'muted','In Progress':'warn','Awaiting Review':'warn',
    'Testing / Quality Assurance':'purple','Completed':'success'
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
  const reviews = loadCollection('reviews', []);

  function tasksFor(projectId){
    return [];
  }

  global.PDMS_DATA = {
    departments, users, consultants, clients, projects,
    notifications, threads, activities, reviews,
    roles, types, priorities, workstreams, statuses, salesStatuses, deliveryStatuses,
    statusColors, prioColors,
    tasksFor
  };
})(window);