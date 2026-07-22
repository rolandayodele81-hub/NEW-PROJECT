/* PDMS Permissions — central role/action matrix.
   Source: PSE PDMS Technical & Business Documentation, Permission Matrix.
   Role names match PDMS_DATA.roles exactly ('PM' in the doc = 'Project Manager',
   'Admin' in the doc = 'General Admin'). Consultant isn't in the documented
   matrix — it's granted view-only access (Add Remarks / View Reports / View
   Resources), same as every other role gets those three. */
(function(global){
  const PDMS = global.PDMS = global.PDMS || {};

  const MATRIX = {
    'Onboard User':        ['HR','HTD','COO','General Admin'],
    'Create Project':      ['Sales','General Admin'],
    'Assign Project':      ['HR','HTD','COO','Project Manager','General Admin'],
    'Assign PM':            ['HR','HTD','COO','General Admin'],
    'Assign Lead':          ['HR','HTD','COO','Project Manager','General Admin'],
    'Assign Consultant':    ['HR','HTD','COO','Project Manager','General Admin'],
    'Reassign Project':     ['HTD','COO','Project Manager','General Admin'],
    'Reassign Consultant':  ['HTD','COO','Project Manager','General Admin'],
    'Change Status':        ['HR','HTD','COO','Project Manager','General Admin'],
    'Close Project':        ['HR','HTD','COO','Project Manager','General Admin'],
    'Add Remarks':          ['HR','HTD','COO','Sales','Project Manager','General Admin','Consultant'],
    'View Reports':         ['HR','HTD','COO','Sales','Project Manager','General Admin','Consultant'],
    'Manage Permissions':   ['General Admin'],
    'Confirm Project':      ['Sales','General Admin'],
    'View Resources':       ['HTD','COO','Sales','Project Manager','General Admin','Consultant']
  };

  PDMS.PERMISSIONS = MATRIX;

  PDMS.can = function(action, user){
    user = user || PDMS.getUser();
    if(!user) return false;
    const allowed = MATRIX[action];
    return !!allowed && allowed.includes(user.role);
  };

  // The matrix marks Sales as "Ltd" on Change Status: they may only move a
  // project Incoming -> Confirmed, which is the same capability it separately
  // calls "Confirm Project". Every other role with Change Status can set any status.
  PDMS.canChangeStatus = function(fromStatus, toStatus, user){
    user = user || PDMS.getUser();
    if(!user) return false;
    if(PDMS.can('Change Status', user)) return true;
    if(PDMS.can('Confirm Project', user)) return fromStatus === 'Incoming' && toStatus === 'Confirmed';
    return false;
  };

  // Where "role-based sign-in" lands each role after auth. Consultant has no
  // dedicated variant, so it (and any unmapped role) falls back to the generic dashboard.
  const DASHBOARD_BY_ROLE = {
    'General Admin': 'dashboard-admin.html',
    'HR': 'dashboard-hr.html',
    'HTD': 'dashboard-htd.html',
    'COO': 'dashboard-htd.html',
    'Project Manager': 'dashboard-htd.html',
    'Sales': 'dashboard-sales.html'
  };
  PDMS.dashboardFor = function(user){
    user = user || PDMS.getUser();
    return (user && DASHBOARD_BY_ROLE[user.role]) || 'dashboard.html';
  };

  // Delivery roles are the non-Sales, non-HR operational roles.
  const DELIVERY_ROLES = ['HTD','COO','Project Manager','PMO','General Admin'];
  const SALES_ROLES    = ['Sales'];

  PDMS.isDeliveryRole = function(user){
    user = user || PDMS.getUser();
    return !!user && DELIVERY_ROLES.includes(user.role);
  };
  PDMS.isSalesRole = function(user){
    user = user || PDMS.getUser();
    return !!user && SALES_ROLES.includes(user.role);
  };

  // `createdByRole` is stored on the project; fall back to inferring from stage field.
  PDMS.createdByRoleOf = function(project){
    if(project.createdByRole) return project.createdByRole;
    if(project.stage) return project.stage === 'Sales' ? 'Sales' : 'HTD';
    return 'Sales'; // safest default for legacy rows
  };

  // Infer stage from status when the `stage` field is absent (legacy rows).
  const SALES_STATUSES = ['Incoming','Initial Contact','Requirement Gathering','Proposal Sent','Negotiation','PO / Award Granted','SLA Signed','Awaiting Client Approval','Closed','On Hold','Cancelled'];
  PDMS.stageOf = function(project){
    if(project.stage) return project.stage;
    // createdByRole is more reliable than status (some statuses appear in both lists)
    if(project.createdByRole){
      return DELIVERY_ROLES.includes(project.createdByRole) ? 'Delivery' : 'Sales';
    }
    return SALES_STATUSES.includes(project.status) ? 'Sales' : 'Delivery';
  };

  // Statuses available for the status-change dropdown, scoped to the current user's role.
  PDMS.statusOptionsFor = function(user){
    user = user || PDMS.getUser();
    if(!user) return [];
    const D = window.PDMS_DATA;
    if(!D) return [];
    if(PDMS.isSalesRole(user)) return D.salesStatuses || [];
    if(PDMS.isDeliveryRole(user)) return D.deliveryStatuses || [];
    // HR & others: both lists combined, deduped
    return [...new Set([...(D.salesStatuses||[]), ...(D.deliveryStatuses||[])])];
  };

  // Whether the current user can change the status of a given project.
  PDMS.canManageStatus = function(project, user){
    user = user || PDMS.getUser();
    if(!user) return false;
    if(!PDMS.can('Change Status', user)) return false;
    const stage = PDMS.stageOf(project);
    // Sales can only touch Sales-stage projects; delivery roles touch Delivery-stage.
    if(PDMS.isSalesRole(user)) return stage === 'Sales';
    if(PDMS.isDeliveryRole(user)) return stage === 'Delivery';
    // HR and General Admin can manage both stages.
    return true;
  };

  // Whether a user can start delivery (move a Sales-Approved project into delivery).
  PDMS.PERMISSIONS['Start Delivery'] = ['HTD','COO','General Admin'];
})(window);
