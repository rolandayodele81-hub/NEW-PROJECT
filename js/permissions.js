/* PDMS Permissions — central role/action matrix.
   Roles: System Administrator, HR, COO, HTD, PM Head, PMO, Sales, Sales Head, Consultant, General Admin */
(function(global){
  const PDMS = global.PDMS = global.PDMS || {};

  const MATRIX = {
    'Onboard User':        ['HR','HTD','COO','PM Head','General Admin'],
    'Create Project':      ['Sales','Sales Head','General Admin'],
    'Assign Project':      ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Assign PM':           ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Assign Lead':         ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Assign Consultant':   ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Reassign Project':    ['HTD','COO','PM Head','PMO','General Admin'],
    'Reassign Consultant': ['HTD','COO','PM Head','PMO','General Admin'],
    'Change Status':       ['HR','HTD','COO','PM Head','PMO','Sales','Sales Head','General Admin'],
    'Close Project':       ['HR','HTD','COO','PM Head','PMO','General Admin'],
    'Add Remarks':         ['HR','HTD','COO','PM Head','PMO','Sales','Sales Head','Accounts','General Admin','Consultant'],
    'View Reports':        ['HR','HTD','COO','PM Head','PMO','Sales','Sales Head','Accounts','General Admin','Consultant'],
    'Manage Permissions':  ['General Admin'],
    'Confirm Project':     ['Sales','Sales Head','General Admin'],
    'View Resources':      ['HTD','COO','PM Head','PMO','Sales','Sales Head','Accounts','General Admin','Consultant'],
    'Start Delivery':      ['HTD','COO','PM Head','General Admin'],
    'Approve Project':     ['Accounts','General Admin'],
    'Approve Sales Project': ['Sales Head','General Admin'],
  };

  PDMS.PERMISSIONS = MATRIX;

  PDMS.can = function(action, user){
    user = user || PDMS.getUser();
    if(!user) return false;
    const allowed = MATRIX[action];
    return !!allowed && allowed.includes(user.role);
  };

  const DASHBOARD_BY_ROLE = {
    'System Administrator': 'dashboard-admin.html',
    'General Admin':        'dashboard-admin.html',
    'HR':                   'dashboard-hr.html',
    'HTD':                  'dashboard-htd.html',
    'COO':                  'dashboard-htd.html',
    'PM Head':              'dashboard-htd.html',
    'PMO':                  'dashboard-pmo.html',
    'Accounts':             'dashboard-accounts.html',
    'Sales':                'dashboard-sales.html',
    'Sales Head':           'dashboard-sales.html',
  };
  PDMS.dashboardFor = function(user){
    user = user || PDMS.getUser();
    return (user && DASHBOARD_BY_ROLE[user.role]) || 'dashboard.html';
  };

  const DELIVERY_ROLES = ['HTD','COO','PM Head','PMO','General Admin'];
  const SALES_ROLES    = ['Sales','Sales Head'];

  PDMS.isDeliveryRole = function(user){
    user = user || PDMS.getUser();
    return !!user && DELIVERY_ROLES.includes(user.role);
  };
  PDMS.isSalesRole = function(user){
    user = user || PDMS.getUser();
    return !!user && SALES_ROLES.includes(user.role);
  };

  PDMS.isSalesHeadRole = function(user){
    user = user || PDMS.getUser();
    return !!user && user.role === 'Sales Head';
  };

  PDMS.stageOf = function(project){
    if(project && (project.status === 'Awaiting Account Approval' || project.status === 'Awaiting Sales Head Approval')) return 'Sales';
    const salesStatuses = (window.PDMS_DATA && window.PDMS_DATA.salesStatuses) || [];
    const deliveryStatuses = (window.PDMS_DATA && window.PDMS_DATA.deliveryStatuses) || [];
    const normalized = PDMS.normalizeStatus ? PDMS.normalizeStatus(project.status) : project.status;
    if(deliveryStatuses.includes(normalized) || deliveryStatuses.includes(project.status)) return 'Delivery';
    if(salesStatuses.includes(normalized)) return 'Sales';
    if(project.stage) return project.stage;
    if(project.createdByRole) return DELIVERY_ROLES.includes(project.createdByRole) ? 'Delivery' : 'Sales';
    return 'Delivery';
  };

  PDMS.statusOptionsFor = function(user){
    user = user || PDMS.getUser();
    if(!user) return [];
    const D = window.PDMS_DATA;
    if(!D) return [];
    const exclude = ['Awaiting Sales Head Approval', 'Awaiting Account Approval'];
    if(PDMS.isSalesRole(user) || PDMS.isSalesHeadRole(user)) return (D.salesStatuses || []).filter(s => !exclude.includes(s));
    if(PDMS.isDeliveryRole(user)) return (D.deliveryStatuses || []).filter(s => !exclude.includes(s));
    return [...new Set([...(D.salesStatuses||[]), ...(D.deliveryStatuses||[])])].filter(s => !exclude.includes(s));
  };

  // Shared status/bucket helpers used across all dashboard pages.
  PDMS.isSalesStatus = function(status){
    if(status === 'Awaiting Sales Head Approval' || status === 'Awaiting Account Approval') return true;
    const normalized = PDMS.normalizeStatus ? PDMS.normalizeStatus(status) : status;
    return ((window.PDMS_DATA && window.PDMS_DATA.salesStatuses) || []).includes(normalized);
  };
  PDMS.isDeliveryStatus = function(status){
    return ((window.PDMS_DATA && window.PDMS_DATA.deliveryStatuses) || []).includes(status);
  };
  PDMS.deliveryStatusOf = function(project){
    if(!project) return 'Not Started';
    if(project.deliveryStatus) return project.deliveryStatus;
    const st = project.status;
    const dList = (window.D && window.D.deliveryStatuses) || (window.PDMS_DATA && window.PDMS_DATA.deliveryStatuses) || [];
    if(st && st !== 'Closed' && dList.includes(st) && st !== 'Awaiting Account Approval' && st !== 'Awaiting Sales Head Approval') {
      return st;
    }
    return 'Not Started';
  };
  PDMS.projectBucket = function(project){
    if(project.status === 'Awaiting Account Approval' || project.status === 'Awaiting Sales Head Approval') return 'Sales'; // pending but locked
    if(PDMS.isDeliveryStatus(project.status)) return 'Delivery';
    if(PDMS.isSalesStatus(project.status)) return 'Sales';
    return 'Delivery';
  };
  
  // Determine whether the current user may change a project's status to `newStatus`.
  // Logic: user must have the Change Status permission, and their role should
  // be appropriate for the target status (sales vs delivery). General Admins
  // and roles with Change Status will default to allowed unless restricted.
  PDMS.canChangeStatus = function(project, newStatus){
    const user = PDMS.getUser();
    if(!user) return false;
    if(!PDMS.can('Change Status', user)) return false;
    const normalized = PDMS.normalizeStatus ? PDMS.normalizeStatus(newStatus) : newStatus;
    const targetIsSales = PDMS.isSalesStatus(normalized);
    const targetIsDelivery = PDMS.isDeliveryStatus(normalized) || normalized === 'Awaiting Account Approval' || normalized === 'Award/SLA';
    // Sales roles may only set sales statuses
    if(PDMS.isSalesRole(user)) return targetIsSales;
    // Delivery roles may only set delivery statuses
    if(PDMS.isDeliveryRole(user)) return targetIsDelivery;
    // Fallback allow for other permitted roles (HR, General Admin, etc.)
    return true;
  };
  PDMS.isPendingAccountApproval = function(project){
    return project && (project.status === 'Awaiting Account Approval' || (project.status === 'Award/SLA' && !project.rejectionNote));
  };
  PDMS.isPendingSalesHeadApproval = function(project){
    return project && project.status === 'Awaiting Sales Head Approval';
  };
  PDMS.canSeePrice = function(user){
    user = user || PDMS.getUser();
    if(!user) return false;
    return ['Accounts','COO','PM Head','HTD','Sales','Sales Head','System Administrator'].includes(user.role);
  };
  PDMS.canEditPrice = function(user){
    user = user || PDMS.getUser();
    if(!user) return false;
    return ['Sales','Sales Head','Accounts','COO','System Administrator'].includes(user.role);
  };
})(window);
