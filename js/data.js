/* ============================================
   PSE PDMS - Data Schema
   ============================================ */
(function (global) {
  const roles = ['System Administrator', 'HR', 'COO', 'HTD', 'PM Head', 'PMO', 'Accounts', 'Sales', 'Sales Head', 'Consultant'];
  const types = ['ISO Management System', 'Regulatory / Compliance', 'Framework Adoption', 'Outsourcing / Governance', 'Technical / Security', 'Software Development', 'Artificial Intelligence', 'Technology Transformation', 'Surveillance / Recertification'];
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
    'Not Started',
    'Gap Assessment',
    'Risk Assessment',
    'Design & Documentation/Implementation',
    'VAPT',
    'Training & Awareness',
    'Internal Audit & Management Review',
    'Remediation & Certification Readiness',
    'Certification Audit',
    'Completed',
    'Certification & Post Engagement',
    'Closure'
  ];

  const frameworkAdoptionStages = [
    'Not Started',
    'Assess',
    'Target State',
    'GAP',
    'Roadmap',
    'Tailor/Design',
    'Implement',
    'Capability Building',
    'Post-Implementation Assess',
    'Institutionalise',
    'Completed',
    'Closure'
  ];

  const outsourcingGovernanceStages = [
    'Not Started',
    'Assess',
    'Strategy',
    'Governance',
    'Design',
    'Select/Contract',
    'Transition',
    'Operate',
    'Monitor',
    'Improve',
    'Completed',
    'Closure'
  ];

  const vaptStages = [
    'Not Started',
    'Gap Assessment',
    'Internal Testing',
    'Penetration Testing',
    'Report Submission',
    'Review',
    'Completed',
    'Closure'
  ];

  const softwareAndAiStages = [
    'Not Started',
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
    'Not Started',
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
    'Not Started',
    'Previous Findings Closure',
    'Awareness',
    'VAPT',
    'Internal Audit',
    'Remediation',
    'Management Review',
    'Readiness Assessment',
    'Surveillance Audit',
    'Completed',
    'Closure'
  ];

  const deliveryStagesByType = {
    'ISO Management System': managementSystemStages,
    'Management System': managementSystemStages,
    'ISO': managementSystemStages,
    'Regulatory/Compliance': managementSystemStages,
    'Regulatory / Compliance': managementSystemStages,
    'Regulatory': managementSystemStages,
    'Compliance': managementSystemStages,
    'Framework Adoption': frameworkAdoptionStages,
    'Framework adoption': frameworkAdoptionStages,
    'Framework': frameworkAdoptionStages,
    'Outsourcing/Governance': outsourcingGovernanceStages,
    'Outsourcing / Governance': outsourcingGovernanceStages,
    'Outsourcing': outsourcingGovernanceStages,
    'Governance': outsourcingGovernanceStages,
    'Technical/Security': vaptStages,
    'Technical / Security': vaptStages,
    'VAPT': vaptStages,
    'SAPT': vaptStages,
    'Software Development & Artificial Intelligence (AI)': softwareAndAiStages,
    'Software Development & AI': softwareAndAiStages,
    'Software Development': softwareAndAiStages,
    'Software development': softwareAndAiStages,
    'Artificial Intelligence': softwareAndAiStages,
    'Artificial intelligence': softwareAndAiStages,
    'AI': softwareAndAiStages,
    'Technology Transformation': erpStages,
    'ERP': erpStages,
    'Surveillance / Recertification': surveillanceStages,
    'Surveillance/ recertification': surveillanceStages,
    'Surveillance / recertification': surveillanceStages,
    'Surveillance': surveillanceStages
  };

  const defaultDeliverySequence = managementSystemStages.slice();

  const allTypeDeliveryStatuses = [
    ...managementSystemStages,
    ...frameworkAdoptionStages,
    ...outsourcingGovernanceStages,
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
    'On Hold': 'warn',
    'Ongoing': 'success',
    'In Progress': 'success',

    // Delivery
    'Not Started': 'info',
    'Completed': 'info',
    'Closure': 'info',
    'Training': 'primary',
    'Internal Audit': 'info',
    'Testing': 'purple',

    // 1. Management System
    'Gap Assessment': 'info',
    'Risk Assessment': 'warn',
    'Design & Documentation/Implementation': 'purple',
    'Design & Documentation/Implement': 'purple',
    'Design and Documentation/Implementation': 'purple',
    'Design and Documentation/Implement': 'purple',
    'Management System Design & Documentation/Implementation': 'purple',
    'VAPT': 'purple',
    'Training & Awareness': 'primary',
    'Internal Audit & Management Review': 'info',
    'Remediation & Certification Readiness': 'warn',
    'Certification Audit': 'purple',
    'Certification & Post Engagement': 'primary',
    'Certification & Post engagement': 'primary',
    'Project Closure': 'info',

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
    'Previous Findings Closure': 'info',
    'Awareness': 'primary',
    'Management Review': 'purple',
    'Readiness Assessment': 'info',
    'Remediation': 'warn',
    'Surveillance Audit': 'purple',
    'Post Engagement': 'primary',

    // 6. Framework Adoption
    'Assess': 'info',
    'Target State': 'primary',
    'GAP': 'warn',
    'Roadmap': 'info',
    'Tailor/Design': 'purple',
    'Tailor / Design': 'purple',
    'Implement': 'purple',
    'Capability Building': 'primary',
    'Post-Implementation Assess': 'info',
    'Assess (Post-Implementation)': 'info',
    'Institutionalise': 'success',
    'Institutionalize': 'success',

    // 7. Outsourcing / Governance
    'Strategy': 'primary',
    'Governance': 'purple',
    'Design': 'purple',
    'Select/Contract': 'warn',
    'Select / Contract': 'warn',
    'Transition': 'info',
    'Operate': 'primary',
    'Monitor': 'info',
    'Improve': 'success'
  };
  Object.assign(statusColors, {
    'Incoming': 'info', 'Initial Contact': 'info', 'Requirement Gathering': 'purple',
    'Proposal Sent': 'primary', 'Awaiting Client Approval': 'success',
    'PO / Award Granted': 'success', 'SLA Signed': 'success'
  });
  const prioColors = { 'Critical': 'prio-critical', 'High': 'prio-high', 'Medium': 'prio-medium', 'Low': 'prio-low' };

  function normalizeStatus(status) {
    if (status === 'Project Closure') return 'Closure';
    return salesStatusAliases[status] || status;
  }

  function salesSequenceFor(projectOrType) {
    if (typeof projectOrType === 'object' && projectOrType) {
      if (Array.isArray(projectOrType.timelineStages) && projectOrType.timelineStages.length > 0) {
        return projectOrType.timelineStages.map(s => s === 'Project Closure' ? 'Closure' : s);
      }
    }
    return salesJourney.slice();
  }

  function deliverySequenceFor(projectOrType) {
    if (typeof projectOrType === 'object' && projectOrType) {
      if (Array.isArray(projectOrType.timelineStages) && projectOrType.timelineStages.length > 0) {
        return projectOrType.timelineStages.map(s => s === 'Project Closure' ? 'Closure' : s);
      }
      let type = projectOrType.type || projectOrType.projectType;
      if (type && deliveryStagesByType[type]) {
        let seq = deliveryStagesByType[type].slice();
        if (projectOrType.hasTraining === false || projectOrType.includeTraining === false || projectOrType.noTraining === true) {
          seq = seq.filter(s => s !== 'Training');
        }
        return seq.map(s => s === 'Project Closure' ? 'Closure' : s);
      }
    }
    let type = typeof projectOrType === 'string' ? projectOrType : (projectOrType && (projectOrType.type || projectOrType.projectType));
    if (type && deliveryStagesByType[type]) {
      return deliveryStagesByType[type].map(s => s === 'Project Closure' ? 'Closure' : s);
    }
    if (type) {
      const matchedKey = Object.keys(deliveryStagesByType).find(k => k.toLowerCase() === String(type).trim().toLowerCase());
      if (matchedKey) {
        return deliveryStagesByType[matchedKey].map(s => s === 'Project Closure' ? 'Closure' : s);
      }
    }
    return defaultDeliverySequence.map(s => s === 'Project Closure' ? 'Closure' : s);
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
  const rawProjects = loadCollection('projects', []).reverse();
  const projects = rawProjects;
  const notifications = loadCollection('notifications', []);
  const threads = loadCollection('threads', []);
  const activities = loadCollection('activities', []);
  const reviews = loadCollection('reviews', []);
  const issues = loadCollection('issues', []);
  const complaints = loadCollection('complaints', []);
  const leaveRequests = loadCollection('leaveRequests', []);

  function tasksFor(projectId) {
    return [];
  }

  global.PDMS_DATA = {
    departments, users, consultants, clients, projects,
    notifications, threads, activities, reviews, issues, complaints, leaveRequests,
    roles, types, priorities, workstreams, statuses, salesJourney, salesStatuses, salesStatusAliases, deliveryStatuses,
    deliveryStagesByType, deliverySequenceFor,
    statusColors, prioColors,
    tasksFor
  };
  global.PDMS = global.PDMS || {};
  global.PDMS.normalizeStatus = normalizeStatus;
  global.PDMS.formatType = function (t) {
    if (!t) return '—';
    const s = String(t).trim();
    if (s.toLowerCase() === 'erp') return 'Technology Transformation';
    if (s.toLowerCase() === 'vapt' || s.toLowerCase() === 'sapt') return 'Technical / Security';
    if (s.toLowerCase() === 'iso') return 'ISO Management System';
    return s.replace(/\s*\/\s*/g, ' / ');
  };
  global.PDMS.normalizeProjectType = function (p) {
    if (!p) return '';
    const raw = typeof p === 'object' ? (p.type || p.projectType || '') : String(p || '');
    return global.PDMS.formatType(raw);
  };
  global.PDMS.typeOf = function (p) {
    if (!p) return '';
    const raw = typeof p === 'object' ? (p.type || p.projectType || '') : String(p || '');
    return global.PDMS.formatType(raw);
  };
  global.PDMS.deliverySequenceFor = deliverySequenceFor;
  global.PDMS.deliveryStagesByType = deliveryStagesByType;
})(window);