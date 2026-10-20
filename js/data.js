/* ============================================
   PSE PDMS - Data Schema
   ============================================ */
(function (global) {
  const roles = ['System Administrator', 'HR', 'COO', 'HTD', 'PM Head', 'PMO', 'Accounts', 'Sales', 'Sales Head', 'Consultant'];
  const types = ['ISO Management System', 'Regulatory / Compliance', 'Framework Adoption', 'Outsourcing / Governance', 'Technical / Security', 'Software Development', 'Artificial Intelligence', 'Technology Transformation', 'Surveillance / Recertification', 'Assessment / Audit'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  // Issue Management Taxonomy & Lifecycle
  const issueImpactLevels = ['Critical', 'High', 'Medium', 'Low'];
  const issueUrgencyLevels = ['Immediate', 'High', 'Normal', 'Low'];
  const issuePriorities = ['P1 - Critical', 'P2 - High', 'P3 - Medium', 'P4 - Low'];

  const issueStatuses = [
    'Reported',
    'Triaged',
    'Under Investigation',
    'Action Plan Agreed',
    'In Remediation',
    'Resolved',
    'Verified',
    'Closed',
    'Reopened',
    'Cancelled'
  ];

  // 11 Core Enterprise Issue Categories & Subcategories
  const issueCategories = [
    {
      name: 'Project Delivery & Milestones',
      ownerRole: 'PMO',
      subCategories: [
        'Milestone Delay / Schedule Slip',
        'Scope Creep / Unplanned Deliverables',
        'Resource Allocation & Availability',
        'Deliverable Quality Issue',
        'Testing / QA Failure'
      ]
    },
    {
      name: 'Client & Account Relations',
      ownerRole: 'PMO',
      subCategories: [
        'Client Unresponsiveness / Dependency',
        'Stakeholder Disagreement / Misalignment',
        'Expectation Mismatch',
        'Contractual Scope Dispute',
        'Communication Breakdown'
      ]
    },
    {
      name: 'Technical, Tools & Infrastructure',
      ownerRole: 'HTD',
      subCategories: [
        'Server / Infrastructure Downtime',
        'Software Bug / Code Defect',
        'Tooling / License Expiry or Lack of Access',
        'Integration / API Failure',
        'Data Loss or Corruption Risk'
      ]
    },
    {
      name: 'Security, Privacy & Risk',
      ownerRole: 'HTD',
      subCategories: [
        'Data Breach / Information Leak',
        'Unauthorized System Access',
        'Security Vulnerability Exploit',
        'Phishing or Social Engineering Attempt',
        'Physical Security Incident'
      ]
    },
    {
      name: 'Financial, Billing & Commercial',
      ownerRole: 'Accounts',
      subCategories: [
        'Client Invoice Payment Delay',
        'Consultant Rate / Payout Dispute',
        'Project Budget Overrun',
        'Expense Reimbursement Issue',
        'Billing / Tax Discrepancy'
      ]
    },
    {
      name: 'Vendor & Third-Party Performance',
      ownerRole: 'PMO',
      subCategories: [
        'Subcontractor Non-Performance',
        'Third-Party SLA Breach',
        'Supplier Quality Defect',
        'Vendor Commercial Conflict'
      ]
    },
    {
      name: 'HR, People & Team Well-being',
      ownerRole: 'HR',
      subCategories: [
        'Interpersonal / Team Conflict',
        'Unfair Workload / Burnout',
        'Harassment, Bullying or Discrimination',
        'Workplace Safety & Ergonomics',
        'Staff Grievance'
      ]
    },
    {
      name: 'Governance, Regulatory & Compliance',
      ownerRole: 'COO',
      subCategories: [
        'Audit Non-Conformance (Major/Minor)',
        'Statutory / Regulatory Breach',
        'Policy Non-Compliance',
        'Ethical Violation / Whistleblowing'
      ]
    },
    {
      name: 'Sales, Scoping & Pre-Delivery',
      ownerRole: 'Sales Head',
      subCategories: [
        'Underestimated Effort / Mis-scoping',
        'Commercial Terms Misalignment',
        'Sales-to-Delivery Handover Gap',
        'Client Feasibility Risk'
      ]
    },
    {
      name: 'Operational Processes & Tools',
      ownerRole: 'COO',
      subCategories: [
        'Process Bottleneck / Approval Delay',
        'Documentation Deficit',
        'System Access / IAM Provisioning Failure',
        'Internal Workflow Roadblock'
      ]
    },
    {
      name: 'General / Unclassified',
      ownerRole: 'PMO',
      subCategories: [
        'General Feedback / Observation',
        'Miscellaneous Roadblock'
      ]
    }
  ];

  // SLA Duration Policies (Hours)
  const issueSLAPolicies = {
    'P1 - Critical': { responseHours: 1, resolutionHours: 4, escalationTiers: ['PM Head', 'HTD', 'COO'] },
    'P2 - High': { responseHours: 4, resolutionHours: 24, escalationTiers: ['PM Head', 'HTD'] },
    'P3 - Medium': { responseHours: 24, resolutionHours: 120, escalationTiers: ['PMO'] }, // 5 business days
    'P4 - Low': { responseHours: 48, resolutionHours: 240, escalationTiers: ['PMO'] } // 10 business days
  };

  // Root Cause Analysis Categories
  const issueRootCauseCategories = [
    'People / Competency / Training Deficit',
    'Process / Workflow Inadequacy or Ambiguity',
    'Technology / System / Hardware Failure',
    'Requirements / Scope Specification Defect',
    'Client / External Third-Party Dependency',
    'Time / Resource Constraint',
    'Communication Breakdown'
  ];

  // Calculate Deterministic Priority from Impact and Urgency (4x4 Matrix)
  function calculateIssuePriority(impact, urgency) {
    const imp = String(impact || 'Medium').trim();
    const urg = String(urgency || 'Normal').trim();

    if (imp === 'Critical') {
      if (urg === 'Immediate' || urg === 'High') return 'P1 - Critical';
      if (urg === 'Normal') return 'P2 - High';
      return 'P3 - Medium';
    }
    if (imp === 'High') {
      if (urg === 'Immediate') return 'P1 - Critical';
      if (urg === 'High') return 'P2 - High';
      if (urg === 'Normal') return 'P3 - Medium';
      return 'P3 - Medium';
    }
    if (imp === 'Medium') {
      if (urg === 'Immediate') return 'P2 - High';
      if (urg === 'High') return 'P3 - Medium';
      if (urg === 'Normal') return 'P3 - Medium';
      return 'P4 - Low';
    }
    // Low Impact
    if (urg === 'Immediate') return 'P3 - Medium';
    if (urg === 'High') return 'P3 - Medium';
    return 'P4 - Low';
  }

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

  const assessmentAuditStages = [
    'Not Started',
    'Gap Assessment',
    'Risk Assessment',
    'Internal Audit',
    'Remediation',
    'Report Submission',
    'Review',
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
    'Surveillance': surveillanceStages,
    'Assessment / Audit': assessmentAuditStages,
    'Assessment/ Audit': assessmentAuditStages,
    'Assessment/Audit': assessmentAuditStages,
    'Assessment': assessmentAuditStages,
    'Audit': assessmentAuditStages
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
    ...assessmentAuditStages,
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

  function getCustomTimelineStages(projectOrType) {
    if (!projectOrType || typeof projectOrType !== 'object') return null;
    var stg = projectOrType.timelineStages || projectOrType.timeline_stages;
    if (!stg && projectOrType.milestones) {
      if (typeof projectOrType.milestones === 'object' && !Array.isArray(projectOrType.milestones)) {
        stg = projectOrType.milestones._timelineStages || projectOrType.milestones.timelineStages;
      } else if (typeof projectOrType.milestones === 'string') {
        try {
          var mParsed = JSON.parse(projectOrType.milestones);
          if (mParsed && typeof mParsed === 'object') {
            stg = mParsed._timelineStages || mParsed.timelineStages;
          }
        } catch (_) {}
      }
    }
    if (typeof stg === 'string') {
      var str = stg.trim();
      if (!str) return null;
      try {
        var parsed = JSON.parse(str);
        stg = Array.isArray(parsed) ? parsed : null;
      } catch (e) {
        stg = str.includes(',') ? str.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : null;
      }
    }
    // A valid custom stage sequence must have at least 2 stages
    return (Array.isArray(stg) && stg.length >= 2)
      ? stg.map(function (s) { return s === 'Project Closure' ? 'Closure' : s; })
      : null;
  }

  function salesSequenceFor(projectOrType) {
    var custom = getCustomTimelineStages(projectOrType);
    if (custom) return custom;
    return salesJourney.slice();
  }

  function deliverySequenceFor(projectOrType) {
    var custom = getCustomTimelineStages(projectOrType);
    if (custom) return custom;
    let type = typeof projectOrType === 'string' ? projectOrType : (projectOrType && (projectOrType.type || projectOrType.projectType));
    if (type && deliveryStagesByType[type]) {
      let seq = deliveryStagesByType[type].slice();
      if (typeof projectOrType === 'object' && projectOrType) {
        if (projectOrType.hasTraining === false || projectOrType.includeTraining === false || projectOrType.noTraining === true) {
          seq = seq.filter(s => s !== 'Training');
        }
      }
      return seq.map(s => s === 'Project Closure' ? 'Closure' : s);
    }
    if (type) {
      const matchedKey = Object.keys(deliveryStagesByType).find(k => k.toLowerCase() === String(type).trim().toLowerCase());
      if (matchedKey) {
        let seq = deliveryStagesByType[matchedKey].slice();
        if (typeof projectOrType === 'object' && projectOrType) {
          if (projectOrType.hasTraining === false || projectOrType.includeTraining === false || projectOrType.noTraining === true) {
            seq = seq.filter(s => s !== 'Training');
          }
        }
        return seq.map(s => s === 'Project Closure' ? 'Closure' : s);
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
  const jsonProjectFields = ['consultants', 'privateTasks', 'documents', 'milestones', 'subStatuses'];
  rawProjects.forEach(p => {
    if (!p || typeof p !== 'object') return;
    jsonProjectFields.forEach(field => {
      if (typeof p[field] === 'string') {
        const str = p[field].trim();
        if (!str) {
          p[field] = [];
        } else {
          try {
            const parsed = JSON.parse(str);
            p[field] = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            p[field] = [];
          }
        }
      } else if (!Array.isArray(p[field])) {
        p[field] = [];
      }
    });
  });
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
    issueImpactLevels, issueUrgencyLevels, issuePriorities, issueStatuses, issueCategories, issueSLAPolicies, issueRootCauseCategories,
    deliveryStagesByType, deliverySequenceFor, salesSequenceFor,
    statusColors, prioColors,
    tasksFor
  };
  global.PDMS = global.PDMS || {};
  global.PDMS.normalizeStatus = normalizeStatus;
  global.PDMS.calculateIssuePriority = calculateIssuePriority;
  global.PDMS.issueCategories = issueCategories;
  global.PDMS.issueSLAPolicies = issueSLAPolicies;
  global.PDMS.issueStatuses = issueStatuses;
  global.PDMS.issueImpactLevels = issueImpactLevels;
  global.PDMS.issueUrgencyLevels = issueUrgencyLevels;
  global.PDMS.issuePriorities = issuePriorities;
  global.PDMS.issueRootCauseCategories = issueRootCauseCategories;
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
  global.PDMS.salesSequenceFor = salesSequenceFor;
  global.PDMS.deliveryStagesByType = deliveryStagesByType;
})(window);