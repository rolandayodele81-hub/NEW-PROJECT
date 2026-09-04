/* ============================================
   PSE PDMS - Data Schema
   ============================================ */
(function (global) {
  const roles = ['System Administrator', 'HR', 'COO', 'HTD', 'PM Head', 'PMO', 'Accounts', 'Sales', 'Sales Head', 'Consultant'];
  const types = ['Management System', 'VAPT', 'Software Development & Artificial Intelligence (AI)', 'ERP', 'Surveillance / Recertification'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];
  const workstreams = ['Cloud Engineering', 'Cybersecurity', 'Data Analytics', 'Digital Transformation', 'ERP Implementation', 'Infrastructure', 'Mobile Development', 'Software Development', 'Web Platform', 'Business Consulting', 'General'];
  const salesJourney = ['Lead', 'Opportunity', 'Initial Proposal', 'Negotiation', 'Invoicing', 'Award/SLA', 'Closed'];
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
  const salesStatuses = [...salesJourney, 'On Hold', 'Cancelled'];

  const managementSystemStages = [
    'Gap Assessment',
    'Training',
    'Implementation',
    'Internal Audit',
    'Recommendation',
    'External Audit',
    'Certificate Reception',
    'Completed',
    'Closure'
  ];

  const vaptStages = [
    'Gap Assessment',
    'Internal Testing',
    'Penetration Testing',
    'Report Submission',
    'Review',
    'Completed',
    'Closure'
  ];

  const softwareAndAiStages = [
    'Project Initiation & Business Case',
    'Requirements & Use-Case Definition',
    'Architecture & Solution Design',
    'Data Readiness & Preparation',
    'PoC / Prototype',
    'Software Development & AI Model Build',
    'System Integration',
    'Testing & AI Validation',
    'UAT & Business Acceptance',
    'Production Deployment & Go-Live',
    'Hypercare & Operational Handover',
    'Completed',
    'Closure'
  ];

  const erpStages = [
    'Requirements Gathering',
    'Configuration & Design',
    'Data Preparation & Migration',
    'Integration',
    'Testing',
    'User Acceptance Testing (UAT)',
    'Training',
    'Go-Live',
    'Completed',
    'Closure'
  ];

  const surveillanceStages = [
    'Surveillance',
    'Internal Audit',
    'Remediation',
    'Training',
    'Surveillance Audit',
    'Completed',
    'Closure'
  ];

  const deliveryStagesByType = {
    'Management System': managementSystemStages,
    'VAPT': vaptStages,
    'SAPT': vaptStages,
    'Software Development & Artificial Intelligence (AI)': softwareAndAiStages,
    'Software Development & AI': softwareAndAiStages,
    'Software Development': softwareAndAiStages,
    'Software development': softwareAndAiStages,
    'Artificial Intelligence': softwareAndAiStages,
    'Artificial intelligence': softwareAndAiStages,
    'AI': softwareAndAiStages,
    'ERP': erpStages,
    'Surveillance / Recertification': surveillanceStages,
    'Surveillance/ recertification': surveillanceStages,
    'Surveillance / recertification': surveillanceStages,
    'Surveillance': surveillanceStages
  };

  const defaultDeliverySequence = managementSystemStages.slice();

  const allTypeDeliveryStatuses = [
    ...managementSystemStages,
    ...vaptStages,
    ...softwareAndAiStages,
    ...erpStages,
    ...surveillanceStages,
    'On Hold', 'Cancelled'
  ];
  const deliveryStatuses = [...new Set(allTypeDeliveryStatuses)];
  const inProgressSubStatuses = ['Design', 'Development', 'Testing / QA / Internal Testing', 'Deployment', 'UAT', 'Release'];
  const statuses = [...salesStatuses, ...deliveryStatuses.filter(s => !salesStatuses.includes(s))];
  const statusColors = {
    // Sales Journey
    'Lead': 'info',
    'Opportunity': 'purple',
    'Initial Proposal': 'primary',
    'Negotiation': 'warn',
    'Invoicing': 'warn',
    'Award/SLA': 'success',
    'Award/SLA Signed': 'warn',
    'Awaiting Sales Head Approval': 'warn',
    'Awaiting Account Approval': 'purple',
    'Closed': 'primary',
    'Cancelled': 'danger',
    'On Hold': 'muted',

    // Shared Milestones
    'Completed': 'success',
    'Closure': 'success',
    'Training': 'primary',
    'Internal Audit': 'info',
    'Testing': 'purple',

    // 1. Management System
    'Gap Assessment': 'info',
    'Implementation': 'purple',
    'Recommendation': 'warn',
    'External Audit': 'warn',
    'Certificate Reception': 'success',

    // 2. VAPT
    'Internal Testing': 'info',
    'Penetration Testing': 'purple',
    'Report Submission': 'primary',
    'Review': 'warn',

    // 3. Software Development & Artificial Intelligence (AI)
    'Project Initiation & Business Case': 'info',
    'Requirements & Use-Case Definition': 'info',
    'Architecture & Solution Design': 'primary',
    'Data Readiness & Preparation': 'info',
    'PoC / Prototype': 'purple',
    'Software Development & AI Model Build': 'purple',
    'System Integration': 'primary',
    'Testing & AI Validation': 'purple',
    'UAT & Business Acceptance': 'warn',
    'Production Deployment & Go-Live': 'success',
    'Hypercare & Operational Handover': 'success',

    // 4. ERP
    'Requirements Gathering': 'info',
    'Configuration & Design': 'primary',
    'Data Preparation & Migration': 'purple',
    'Integration': 'primary',
    'User Acceptance Testing (UAT)': 'warn',
    'Go-Live': 'success',

    // 5. Surveillance / Recertification
    'Surveillance': 'info',
    'Remediation': 'warn',
    'Surveillance Audit': 'purple'
  };
  Object.assign(statusColors, {
    'Incoming': 'info', 'Initial Contact': 'info', 'Requirement Gathering': 'purple',
    'Proposal Sent': 'primary', 'Awaiting Client Approval': 'success',
    'PO / Award Granted': 'success', 'SLA Signed': 'success'
  });
  const prioColors = { 'Critical': 'prio-critical', 'High': 'prio-high', 'Medium': 'prio-medium', 'Low': 'prio-low' };

  function normalizeStatus(status) {
    return salesStatusAliases[status] || status;
  }

  function deliverySequenceFor(projectOrType) {
    if (typeof projectOrType === 'object' && projectOrType) {
      if (Array.isArray(projectOrType.timelineStages) && projectOrType.timelineStages.length > 0) {
        return projectOrType.timelineStages.slice();
      }
      let type = projectOrType.type || projectOrType.projectType;
      if (type && deliveryStagesByType[type]) {
        let seq = deliveryStagesByType[type].slice();
        if (projectOrType.hasTraining === false || projectOrType.includeTraining === false || projectOrType.noTraining === true) {
          seq = seq.filter(s => s !== 'Training');
        }
        return seq;
      }
    }
    let type = typeof projectOrType === 'string' ? projectOrType : (projectOrType && (projectOrType.type || projectOrType.projectType));
    if (type && deliveryStagesByType[type]) {
      return deliveryStagesByType[type].slice();
    }
    return defaultDeliverySequence.slice();
  }

  // -----------------------------
  // Persisted data collections
  // Populated from window.PDMS_REMOTE (loaded by js/config.js's bootstrap
  // <script> tag) when the Apps Script backend is reachable; otherwise
  // falls back to the seed data below so the app still runs standalone.
  // -----------------------------

  function loadCollection(key, fallback) {
    const remote = global.PDMS_REMOTE && global.PDMS_REMOTE[key];
    return Array.isArray(remote) ? remote : (fallback || []);
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
  const projects = loadCollection('projects', []).reverse();
  const notifications = loadCollection('notifications', []);
  const threads = loadCollection('threads', []);
  const activities = loadCollection('activities', []);
  const reviews = loadCollection('reviews', []);
  const issues = loadCollection('issues', []);

  function tasksFor(projectId) {
    return [];
  }

  global.PDMS_DATA = {
    departments, users, consultants, clients, projects,
    notifications, threads, activities, reviews, issues,
    roles, types, priorities, workstreams, statuses, salesJourney, salesStatuses, salesStatusAliases, deliveryStatuses,
    deliveryStagesByType, deliverySequenceFor,
    statusColors, prioColors,
    tasksFor
  };
  global.PDMS = global.PDMS || {};
  global.PDMS.normalizeStatus = normalizeStatus;
  global.PDMS.deliverySequenceFor = deliverySequenceFor;
  global.PDMS.deliveryStagesByType = deliveryStagesByType;
})(window);