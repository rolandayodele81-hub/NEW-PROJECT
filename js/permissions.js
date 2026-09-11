/* PDMS Permissions — central role/action matrix.
   Roles: System Administrator, HR, COO, HTD, PM Head, PMO, Sales, Sales Head, Consultant, General Admin */
(function (global) {
  const PDMS = global.PDMS = global.PDMS || {};

  const MATRIX = {
    'Onboard User': ['HR', 'General Admin'],
    'Edit User': ['HR'],
    'Reset Password': ['HR'],
    'Delete User': ['HR'],
    'Create Project': ['Sales', 'Sales Head', 'General Admin'],
    'Assign Project': ['HR', 'HTD', 'COO', 'PM Head', 'PMO', 'General Admin'],
    'Assign PM': ['HR', 'HTD', 'COO', 'PM Head', 'PMO', 'General Admin'],
    'Assign Lead': ['HR', 'HTD', 'COO', 'PM Head', 'PMO', 'General Admin'],
    'Assign Consultant': ['HR', 'HTD', 'COO', 'PM Head', 'PMO', 'General Admin'],
    'Reassign Project': ['HTD', 'COO', 'PM Head', 'PMO', 'General Admin'],
    'Reassign Consultant': ['HTD', 'COO', 'PM Head', 'PMO', 'General Admin'],
    'Change Status': ['HR', 'HTD', 'COO', 'PM Head', 'PMO', 'Sales', 'Sales Head', 'General Admin'],
    'Close Project': ['HR', 'HTD', 'COO', 'PM Head', 'PMO', 'General Admin'],
    'Add Remarks': ['HR', 'HTD', 'COO', 'PM Head', 'PMO', 'Sales', 'Sales Head', 'Accounts', 'General Admin', 'Consultant'],
    'View Reports': ['HR', 'HTD', 'COO', 'PM Head', 'PMO', 'Sales', 'Sales Head', 'Accounts', 'General Admin', 'Consultant'],
    'Manage Permissions': ['General Admin'],
    'Confirm Project': ['Sales', 'Sales Head', 'General Admin'],
    'View Resources': ['HTD', 'COO', 'PM Head', 'PMO', 'Sales', 'Sales Head', 'Accounts', 'General Admin', 'Consultant'],
    'Start Delivery': ['HTD', 'COO', 'PM Head', 'General Admin'],
    'Approve Project': ['Accounts', 'General Admin'],
    'Approve Sales Project': ['Sales Head', 'General Admin'],
  };

  PDMS.PERMISSIONS = MATRIX;

  PDMS.can = function (action, user) {
    user = user || PDMS.getUser();
    if (!user) return false;
    if (action === 'Create Project' && user.role === 'PMO') return false;
    const allowed = MATRIX[action];
    return !!allowed && allowed.includes(user.role);
  };

  const DASHBOARD_BY_ROLE = {
    'System Administrator': 'dashboard-admin.html',
    'General Admin': 'dashboard-admin.html',
    'HR': 'dashboard-hr.html',
    'HTD': 'dashboard-htd.html',
    'COO': 'dashboard-htd.html',
    'PM Head': 'dashboard-htd.html',
    'PMO': 'dashboard-pmo.html',
    'Accounts': 'dashboard-accounts.html',
    'Sales': 'dashboard-sales.html',
    'Sales Head': 'dashboard-sales.html',
  };
  PDMS.dashboardFor = function (user) {
    user = user || PDMS.getUser();
    return (user && DASHBOARD_BY_ROLE[user.role]) || 'dashboard.html';
  };

  const DELIVERY_ROLES = ['HTD', 'COO', 'PM Head', 'PMO', 'General Admin'];
  const SALES_ROLES = ['Sales', 'Sales Head'];
  const DELIVERY_CREATION_ROLES = ['HTD', 'COO', 'PM Head', 'General Admin'];

  PDMS.isDeliveryRole = function (user) {
    user = user || PDMS.getUser();
    return !!user && DELIVERY_ROLES.includes(user.role);
  };
  PDMS.isDeliveryCreationRole = function (user) {
    user = user || PDMS.getUser();
    return !!user && DELIVERY_CREATION_ROLES.includes(user.role);
  };
  PDMS.isSalesRole = function (user) {
    user = user || PDMS.getUser();
    return !!user && SALES_ROLES.includes(user.role);
  };

  PDMS.isSalesHeadRole = function (user) {
    user = user || PDMS.getUser();
    return !!user && user.role === 'Sales Head';
  };

  PDMS.stageOf = function (project) {
    if (!project) return 'Sales';
    if (project.createdByRole && DELIVERY_ROLES.includes(project.createdByRole)) return 'Delivery';
    if (project.status === 'Awaiting Account Approval' || project.status === 'Awaiting Sales Head Approval') return 'Sales';

    const normalized = PDMS.normalizeStatus ? PDMS.normalizeStatus(project.status) : project.status;
    const preAwardSales = ['Lead', 'Opportunity', 'Initial Proposal', 'Negotiation', 'Invoicing'];
    if (preAwardSales.includes(normalized) && project.stage !== 'Delivery' && !project.deliveryStatus) return 'Sales';

    if (project.status === 'Cancelled' || project.status === 'On Hold') {
      if (project.stage === 'Delivery' || !!project.deliveryStatus) return 'Delivery';
      const prev = project.previousStatus || project.heldAtStatus;
      const D = window.PDMS_DATA;
      const allDelivery = (D && D.deliveryStatuses) ? D.deliveryStatuses : ['Not Started', 'Gap Assessment', 'Risk Assessment', 'Design & Documentation/Implementation', 'VAPT', 'Training & Awareness', 'Internal Audit & Management Review', 'Remediation & Certification Readiness', 'Certification Audit', 'Completed', 'Certification & Post Engagement', 'Closure'];
      if (prev && allDelivery.includes(prev)) return 'Delivery';
      if (project.stage === 'Sales') return 'Sales';
      return 'Sales';
    }

    const D = window.PDMS_DATA;
    const allDelivery = (D && D.deliveryStatuses) ? D.deliveryStatuses : ['Not Started', 'Gap Assessment', 'Risk Assessment', 'Design & Documentation/Implementation', 'VAPT', 'Training & Awareness', 'Internal Audit & Management Review', 'Remediation & Certification Readiness', 'Certification Audit', 'Completed', 'Certification & Post Engagement', 'Closure'];
    if (allDelivery.includes(normalized) || allDelivery.includes(project.status)) return 'Delivery';

    if (project.status === 'Closed') return 'Delivery';
    if (project.stage === 'Delivery') return 'Delivery';
    if (project.deliveryStatus) return 'Delivery';

    if (project.stage === 'Sales') return 'Sales';
    return 'Sales';
  };

  PDMS.isDeliveryProject = function (project) {
    if (!project) return false;
    if (project.status === 'Awaiting Account Approval' || project.status === 'Awaiting Sales Head Approval') return false;
    const preAward = ['Lead', 'Opportunity', 'Initial Proposal', 'Negotiation', 'Invoicing', 'Award/SLA'];
    if (preAward.includes(project.status) && project.stage !== 'Delivery' && !project.deliveryStatus) return false;
    if ((project.status === 'Cancelled' || project.status === 'On Hold') && (project.stage === 'Sales' || (!project.deliveryStatus && (PDMS.stageOf ? PDMS.stageOf(project) === 'Sales' : true)))) {
      return false;
    }
    if (PDMS.stageOf && PDMS.stageOf(project) === 'Sales') return false;
    return true;
  };

  PDMS.getDeliveryProjects = function (projectsList) {
    const list = projectsList || (window.PDMS_REMOTE && window.PDMS_REMOTE.projects) || (window.PDMS_DATA && window.PDMS_DATA.projects) || [];
    return list.filter(PDMS.isDeliveryProject);
  };

  PDMS.isClosedOrCompleted = function (projectOrStatus) {
    if (!projectOrStatus) return false;
    if (typeof projectOrStatus === 'string') {
      const s = projectOrStatus.trim().toLowerCase();
      return ['completed', 'closed', 'closure', 'project closure', 'cancelled', 'on hold', 'rejected', 'certification & post engagement'].includes(s);
    }
    const p = projectOrStatus;
    const dStat = String((PDMS.deliveryStatusOf ? PDMS.deliveryStatusOf(p) : p.deliveryStatus) || '').trim().toLowerCase();
    const s = String(p.status || '').trim().toLowerCase();
    const closedList = ['completed', 'closed', 'closure', 'project closure', 'cancelled', 'on hold', 'rejected', 'certification & post engagement'];
    return closedList.includes(dStat) || closedList.includes(s);
  };

  PDMS.isSalesOrigin = function (project) {
    if (!project) return false;
    const role = String(project.createdByRole || '').trim();
    if (DELIVERY_ROLES.includes(role) || ['Consultant', 'PMO', 'HTD', 'COO', 'PM Head'].includes(role)) return false;
    return true;
  };

  PDMS.statusOptionsFor = function (user, project) {
    user = user || PDMS.getUser();
    if (!user) return [];
    const D = window.PDMS_DATA;
    if (!D) return [];
    const exclude = ['Awaiting Sales Head Approval', 'Awaiting Account Approval'];
    
    // Projects in Sales Pipeline MUST ALWAYS maintain their sales statuses
    if (project && PDMS.stageOf(project) === 'Sales') {
      return (D.salesStatuses || []).filter(s => !exclude.includes(s));
    }
    if (PDMS.isSalesRole(user) || PDMS.isSalesHeadRole(user)) {
      return (D.salesStatuses || []).filter(s => !exclude.includes(s));
    }

    // Projects that have been moved to Delivery use their project-type-specific delivery sequence
    if (project) {
      const typeSequence = PDMS.deliverySequenceFor ? PDMS.deliverySequenceFor(project) : (D.deliveryStatuses || []);
      const options = [...typeSequence, 'On Hold', 'Cancelled'];
      return [...new Set(options)].filter(s => !exclude.includes(s));
    }
    if (PDMS.isDeliveryRole(user)) {
      return (D.deliveryStatuses || []).filter(s => !exclude.includes(s));
    }
    return [...new Set([...(D.salesStatuses || []), ...(D.deliveryStatuses || [])])].filter(s => !exclude.includes(s));
  };

  PDMS.projectOwnedByUser = function (project, user) {
    if (!project || !user) return false;
    const userId = String(user.id || '').trim().toLowerCase();
    const userName = String(user.name || '').trim().toLowerCase();
    const userEmail = String(user.email || '').trim().toLowerCase();
    const ownerValues = [
      String(project.projectOwnerId || '').trim().toLowerCase(),
      String(project.projectOwnerName || '').trim().toLowerCase(),
      String(project.projectOwnerEmail || '').trim().toLowerCase(),
      String(project.onboardedById || '').trim().toLowerCase(),
      String(project.onboardedByName || '').trim().toLowerCase(),
      String(project.onboardedByEmail || '').trim().toLowerCase(),
      String(project.salesOwnerId || '').trim().toLowerCase(),
      String(project.salesOwnerName || '').trim().toLowerCase(),
      String(project.salesOwnerEmail || '').trim().toLowerCase(),
      String(project.createdByUserId || '').trim().toLowerCase(),
      String(project.createdByUserName || '').trim().toLowerCase(),
      String(project.createdByEmail || '').trim().toLowerCase(),
      String(project.sales || '').trim().toLowerCase()
    ].filter(Boolean);
    return (userId && ownerValues.includes(userId)) ||
           (userName && ownerValues.includes(userName)) ||
           (userEmail && ownerValues.includes(userEmail));
  };

  // Client visibility/editing: Sales Head sees & edits every client; a Sales
  // user only sees & edits clients they created.
  PDMS.clientOwnedByUser = function (client, user) {
    if (!client || !user) return false;
    const userId = String(user.id || '').trim().toLowerCase();
    const userName = String(user.name || '').trim().toLowerCase();
    const ownerValues = [
      client.createdById, client.createdByName,
      client.ownerId, client.ownerName,
      client.salesOwnerId, client.salesOwnerName
    ].map(v => String(v || '').trim().toLowerCase()).filter(Boolean);
    return (userId && ownerValues.includes(userId)) || (userName && ownerValues.includes(userName));
  };
  PDMS.canManageAllClients = function (user) {
    user = user || PDMS.getUser();
    return !!user && ['System Administrator', 'HR', 'Sales Head'].includes(user.role);
  };
  PDMS.canEditClient = function (client, user) {
    user = user || PDMS.getUser();
    return PDMS.canManageAllClients(user) || PDMS.clientOwnedByUser(client, user);
  };
  PDMS.canDeleteClient = function (client, user) {
    user = user || PDMS.getUser();
    return !!user && ['Sales Head', 'System Administrator'].includes(user.role);
  };

  // Help Center Complaints permissions:
  // Visible to management: HR, PM Head, HTD, COO, System Administrator.
  // Regular users can only see complaints they submitted.
  const COMPLAINT_MANAGEMENT_ROLES = ['hr', 'pm head', 'htd', 'coo', 'system administrator', 'general admin'];

  PDMS.canManageComplaints = function (user) {
    user = user || PDMS.getUser();
    if (!user || !user.role) return false;
    const r = String(user.role).trim().toLowerCase();
    return COMPLAINT_MANAGEMENT_ROLES.includes(r);
  };
  PDMS.canViewAllComplaints = PDMS.canManageComplaints;

  PDMS.complaintOwnedByUser = function (complaint, user) {
    if (!complaint || !user) return false;
    const uId = String(user.id || '').trim().toLowerCase();
    const uEmail = String(user.email || '').trim().toLowerCase();
    const uName = String(user.name || '').trim().toLowerCase();
    if (complaint.submittedById && String(complaint.submittedById).trim().toLowerCase() === uId) return true;
    if (complaint.submittedByEmail && String(complaint.submittedByEmail).trim().toLowerCase() === uEmail) return true;
    if (complaint.submittedByName && String(complaint.submittedByName).trim().toLowerCase() === uName) return true;
    return false;
  };

  // Leave / Off-Days Request & Availability Helpers
  PDMS.canManageLeaveRequests = function (user) {
    user = user || PDMS.getUser();
    if (!user || !user.role) return false;
    const r = String(user.role).trim().toLowerCase();
    return ['hr', 'system administrator', 'general admin'].includes(r);
  };

  PDMS.getAllLeaveRequests = function () {
    const live = (window.PDMS_REMOTE && window.PDMS_REMOTE.leaveRequests) || (window.PDMS_DATA && window.PDMS_DATA.leaveRequests) || [];
    return Array.isArray(live) ? live : [];
  };

  PDMS.getUserLeaveHistory = function (userOrIdOrName) {
    if (!userOrIdOrName) return [];
    const list = PDMS.getAllLeaveRequests();
    const target = typeof userOrIdOrName === 'object' ? userOrIdOrName : { id: userOrIdOrName, name: userOrIdOrName, email: userOrIdOrName };
    const tId = String(target.id || '').trim().toLowerCase();
    const tEmail = String(target.email || '').trim().toLowerCase();
    const tName = String(target.name || '').trim().toLowerCase();

    return list.filter(lv => {
      if (!lv) return false;
      const lvId = String(lv.userId || '').trim().toLowerCase();
      const lvEmail = String(lv.userEmail || '').trim().toLowerCase();
      const lvName = String(lv.userName || '').trim().toLowerCase();
      return (tId && lvId === tId) || (tEmail && lvEmail === tEmail) || (tName && lvName === tName);
    }).sort((a, b) => new Date(b.createdAt || b.startDate || 0) - new Date(a.createdAt || a.startDate || 0));
  };

  PDMS.getUserActiveLeave = function (userOrIdOrName, checkDate) {
    const userLeaves = PDMS.getUserLeaveHistory(userOrIdOrName);
    if (!userLeaves.length) return null;

    const dateStr = (checkDate ? new Date(checkDate) : new Date()).toISOString().slice(0, 10);
    return userLeaves.find(lv => {
      if (String(lv.status || '').toLowerCase() !== 'approved') return false;
      const start = String(lv.startDate || '').slice(0, 10);
      const end = String(lv.endDate || '').slice(0, 10);
      if (!start || !end) return false;
      return dateStr >= start && dateStr <= end;
    }) || null;
  };

  PDMS.isUserOnLeave = function (userOrIdOrName, checkDate) {
    return !!PDMS.getUserActiveLeave(userOrIdOrName, checkDate);
  };

  PDMS.getUserUpcomingLeaves = function (userOrIdOrName, checkDate) {
    const userLeaves = PDMS.getUserLeaveHistory(userOrIdOrName);
    if (!userLeaves.length) return [];

    const dateStr = (checkDate ? new Date(checkDate) : new Date()).toISOString().slice(0, 10);
    return userLeaves.filter(lv => {
      if (String(lv.status || '').toLowerCase() !== 'approved') return false;
      const start = String(lv.startDate || '').slice(0, 10);
      return start > dateStr;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  // Shared status/bucket helpers used across all dashboard pages.
  PDMS.isSalesStatus = function (status) {
    const s = PDMS.normalizeStatus ? PDMS.normalizeStatus(status) : status;
    return ((window.PDMS_DATA && window.PDMS_DATA.salesStatuses) || []).includes(s);
  };
  PDMS.isDeliveryStatus = function (status) {
    return ((window.PDMS_DATA && window.PDMS_DATA.deliveryStatuses) || []).includes(status);
  };
  PDMS.deliveryStatusOf = function (project) {
    if (!project) return null;
    const preAwardSales = ['Lead', 'Opportunity', 'Initial Proposal', 'Negotiation', 'Invoicing', 'Award/SLA', 'Awaiting Sales Head Approval', 'Awaiting Account Approval'];
    if (preAwardSales.includes(project.status) || (project.status === 'Cancelled' && project.stage === 'Sales' && !project.deliveryStatus)) {
      return null;
    }
    const seq = PDMS.deliverySequenceFor ? PDMS.deliverySequenceFor(project) : (D && D.deliveryStatuses ? D.deliveryStatuses : ['Not Started', 'Gap Assessment', 'Risk Assessment', 'Design & Documentation/Implementation', 'VAPT', 'Training & Awareness', 'Internal Audit & Management Review', 'Remediation & Certification Readiness', 'Certification Audit', 'Completed', 'Certification & Post Engagement', 'Closure']);
    
    // 1. Check explicit deliveryStatus field
    const delivRaw = String(project.deliveryStatus || '').trim();
    if (delivRaw) {
      const matchInSeq = seq.find(s => s.toLowerCase() === delivRaw.toLowerCase());
      if (matchInSeq) return matchInSeq;
      if (delivRaw.toLowerCase() === 'management system design & documentation/implementation' || delivRaw.toLowerCase() === 'management system design and documentation/implementation' || delivRaw.toLowerCase() === 'design and documentation/implement' || delivRaw.toLowerCase() === 'design & documentation/implement') {
        const found = seq.find(s => s.toLowerCase().includes('design') && s.toLowerCase().includes('documentation'));
        if (found) return found;
      }
      if (delivRaw.toLowerCase() === 'completed' && !seq.includes('Completed') && seq.includes('Closure')) return 'Closure';
      if (delivRaw.toLowerCase() === 'closure' && !seq.includes('Closure') && seq.includes('Completed')) return 'Completed';
      if (delivRaw.toLowerCase() === 'on hold') return 'On Hold';
      if (delivRaw.toLowerCase() === 'cancelled') return 'Cancelled';
    }

    // 2. Check project.status directly against this project's pipeline sequence
    const st = String(project.status || '').trim();
    const matchStatusInSeq = seq.find(s => s.toLowerCase() === st.toLowerCase());
    if (matchStatusInSeq) return matchStatusInSeq;

    if (st.toLowerCase() === 'management system design & documentation/implementation' || st.toLowerCase() === 'management system design and documentation/implementation' || st.toLowerCase() === 'design and documentation/implement' || st.toLowerCase() === 'design & documentation/implement') {
      const found = seq.find(s => s.toLowerCase().includes('design') && s.toLowerCase().includes('documentation'));
      if (found) return found;
    }
    if (st.toLowerCase() === 'completed' && !seq.includes('Completed') && seq.includes('Closure')) return 'Closure';
    if (st.toLowerCase() === 'closure' && !seq.includes('Closure') && seq.includes('Completed')) return 'Completed';
    if (st.toLowerCase() === 'on hold') return 'On Hold';
    if (st.toLowerCase() === 'cancelled') return 'Cancelled';

    // 3. For projects with legacy generic statuses (e.g. 'In Progress', 'Awaiting Review', 'Not Started', 'Closed'),
    // map them cleanly into this project type's pipeline sequence:
    const type = String(project.type || project.projectType || '').trim();
    if (type === 'Technical/Security' || type === 'Technical / Security' || type === 'VAPT' || type === 'SAPT' || type.toLowerCase().includes('technical') || type.toLowerCase().includes('security') || type.toLowerCase().includes('vapt')) {
      if (st.toLowerCase() === 'awaiting review' || st.toLowerCase() === 'testing / quality assurance') return 'Review';
      if (st.toLowerCase() === 'in progress') return 'Internal Testing';
    } else if (type === 'Technology Transformation' || type === 'ERP' || type.toLowerCase().includes('technology transformation')) {
      if (st.toLowerCase() === 'awaiting review') return 'Testing';
      if (st.toLowerCase() === 'in progress') return 'Configuration & Design';
    } else if (type.toLowerCase().includes('framework')) {
      if (st.toLowerCase() === 'awaiting review') return 'Post-Implementation Assess';
      if (st.toLowerCase() === 'in progress') return 'Implement';
    } else if (type.toLowerCase().includes('outsourcing') || type.toLowerCase().includes('governance')) {
      if (st.toLowerCase() === 'awaiting review') return 'Monitor';
      if (st.toLowerCase() === 'in progress') return 'Transition';
    } else if (type === 'ISO Management System' || type === 'Management System' || type === 'Regulatory/Compliance' || type === 'Regulatory / Compliance' || type.toLowerCase().includes('management system') || type.toLowerCase().includes('regulatory') || type.toLowerCase().includes('compliance')) {
      if (st.toLowerCase() === 'awaiting review') return 'Certification Audit';
      if (st.toLowerCase() === 'in progress') return 'Design & Documentation/Implementation';
    } else if (type.toLowerCase().includes('surveillance') || type.toLowerCase().includes('recertification')) {
      if (st.toLowerCase() === 'awaiting review') return 'Surveillance Audit';
      if (st.toLowerCase() === 'in progress') return 'Internal Audit';
      if (st.toLowerCase() === 'internal audit remediation') return 'Remediation';
    } else if (type.toLowerCase().includes('software') || type.toLowerCase().includes('artificial') || type.toLowerCase().includes('ai')) {
      if (st.toLowerCase() === 'awaiting review' || st.toLowerCase() === 'testing / quality assurance') return 'Testing & AI Validation';
      if (st.toLowerCase() === 'in progress') return 'Software Development & AI Model Build';
    }

    // If progress % is recorded and > 0, map to corresponding step
    if (Number.isFinite(Number(project.progress)) && Number(project.progress) > 0) {
      const idx = Math.min(seq.length - 1, Math.max(0, Math.floor((Number(project.progress) / 100) * (seq.length - 1))));
      return seq[idx];
    }

    // Default to the first stage of this project type's sequence
    return seq[0] || 'Gap Assessment';
  };
  PDMS.projectBucket = function (project) {
    if (project.status === 'Awaiting Account Approval' || project.status === 'Awaiting Sales Head Approval') return 'Sales';
    if (PDMS.stageOf(project) === 'Sales') return 'Sales';
    return 'Delivery';
  };

  // Determine whether the current user may change a project's status to `newStatus`.
  // Logic: user must have the Change Status permission, and their role should
  // be appropriate for the target status (sales vs delivery). General Admins
  // and roles with Change Status will default to allowed unless restricted.
  PDMS.canChangeStatus = function (project, newStatus) {
    const user = PDMS.getUser();
    if (!user) return false;
    if (!PDMS.can('Change Status', user)) return false;
    const normalized = PDMS.normalizeStatus ? PDMS.normalizeStatus(newStatus) : newStatus;
    const targetIsSales = PDMS.isSalesStatus(normalized);
    const targetIsDelivery = PDMS.isDeliveryStatus(normalized) || normalized === 'Awaiting Account Approval' || normalized === 'Award/SLA';
    // Sales roles may only set sales statuses
    if (PDMS.isSalesRole(user)) return targetIsSales;
    // Delivery roles may only set delivery statuses
    if (PDMS.isDeliveryRole(user)) return targetIsDelivery;
    // Fallback allow for other permitted roles (HR, General Admin, etc.)
    return true;
  };
  PDMS.isPendingAccountApproval = function (project) {
    if (!project) return false;
    return project.status === 'Awaiting Account Approval';
  };

  // The patch to apply when a Sales Head approves a lead that is Awaiting Sales
  // Head Approval. A lead entered at Award/SLA is forwarded straight to Accounts
  // (Awaiting Account Approval) instead of dropping into the pipeline.
  PDMS.salesHeadApprovalPatch = function (project) {
    const target = project.requestedStatus || project.targetStatus ||
      (project.status !== 'Awaiting Sales Head Approval' ? project.status : 'Lead');
    if (target === 'Award/SLA' || target === 'SLA Signed') {
      const award = (project.awardValue !== undefined && project.awardValue !== null && project.awardValue !== '')
        ? project.awardValue
        : (project.negotiatedPrice || '');
      return {
        status: 'Awaiting Account Approval', stage: 'Delivery',
        requestedStatus: 'Award/SLA', targetStatus: 'Award/SLA',
        awardValue: award, negotiatedPrice: award,
        priceUpdatePending: false, salesHeadRejectionNote: ''
      };
    }
    return { status: target, stage: 'Sales', priceUpdatePending: false, salesHeadRejectionNote: '' };
  };
  PDMS.isPendingSalesHeadApproval = function (project) {
    return project && project.status === 'Awaiting Sales Head Approval';
  };
  PDMS.canSeePrice = function (user) {
    user = user || PDMS.getUser();
    if (!user) return false;
    return ['Accounts', 'COO', 'PM Head', 'HTD', 'Sales', 'Sales Head', 'System Administrator'].includes(user.role);
  };
  PDMS.canEditPrice = function (user) {
    user = user || PDMS.getUser();
    if (!user) return false;
    return ['Sales', 'Sales Head', 'Accounts', 'COO', 'System Administrator'].includes(user.role);
  };
  PDMS.canDeleteProject = function (project, user) {
    user = user || PDMS.getUser();
    if (!project || !user) return false;
    const role = user.role;
    // Executives and System Admins can delete any project
    if (['System Administrator', 'COO'].includes(role)) return true;

    // PMOs / Project Managers can delete ONLY projects created/onboarded by them (not assigned projects)
    if (['PMO', 'Project Manager'].includes(role)) {
      return PDMS.projectOwnedByUser(project, user);
    }

    const pStage = PDMS.stageOf(project);
    const isDeliveryStage = pStage === 'Delivery';
    const isSalesStage = pStage === 'Sales';

    // In Delivery stage: HTD and PM Head can delete
    if (isDeliveryStage) {
      return ['HTD', 'PM Head'].includes(role);
    }

    // In Sales Pipeline stage:
    if (isSalesStage) {
      // Sales Head can delete any project lead in the general sales pipeline (approved or pending)
      if (role === 'Sales Head') return true;

      // Normal Sales users can ONLY delete sales leads they created WHILE in 'Awaiting Sales Head Approval'
      if (PDMS.isSalesRole(user)) {
        const isAwaitingSalesHeadApproval = project.status === 'Awaiting Sales Head Approval';
        return PDMS.projectOwnedByUser(project, user) && isAwaitingSalesHeadApproval;
      }
    }

    return false;
  };
})(window);
