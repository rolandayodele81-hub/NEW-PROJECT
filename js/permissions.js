/* PDMS Permissions — central role/action matrix.
   Source: PSE PDMS Technical & Business Documentation, Permission Matrix.
   Role names match PDMS_DATA.roles exactly ('PM' in the doc = 'Project Manager',
   'Admin' in the doc = 'General Admin'). Consultant isn't in the documented
   matrix — it's granted view-only access (Add Remarks / View Reports / View
   Resources), same as every other role gets those three. */
(function(global){
  const PDMS = global.PDMS = global.PDMS || {};

  const MATRIX = {
    'Onboard User':        ['HR'],
    'Create Project':      ['Sales','COO','HTD','PM Head'],
    'Assign Project':      ['COO','HTD','PM Head'],
    'Assign PM':           ['COO','HTD','PM Head'],
    'Assign Lead':         ['COO','HTD','PM Head'],
    'Assign Consultant':   ['COO','HTD','PM Head'],
    'Reassign Project':    ['COO','HTD','PM Head'],
    'Reassign Consultant': ['COO','HTD','PM Head'],
    'Change Status':       ['COO','HTD','PM Head','PMO','Sales'],
    'Start Delivery':      ['COO','HTD','PM Head','PMO'],
    'Close Project':       ['COO','HTD','PM Head','PMO'],
    'Add Remarks':         ['HR','COO','HTD','PM Head','PMO','Sales','Consultant','System Administrator'],
    'View Reports':        ['HR','COO','HTD','PM Head','PMO','Sales','Consultant','System Administrator'],
    'Manage Permissions':  ['System Administrator'],
    'View Resources':      ['HR','COO','HTD','PM Head','PMO','Sales']
  };

  PDMS.PERMISSIONS = MATRIX;

  PDMS.can = function(action, user){
    user = user || PDMS.getUser();
    if(!user) return false;
    if (user.role === 'System Administrator') return true;
    const allowed = MATRIX[action];
    return !!allowed && allowed.includes(user.role);
  };

  // Every project sits in one of two stages, each owned by a different set of
  // roles and vocabulary: Sales works the pipeline (Incoming..Approved), then a
  // delivery role (COO/HTD/PM Head/PMO) picks up an Approved lead via "Start
  // Delivery" and runs it through the delivery statuses (Not Started..Completed).
  const DELIVERY_ROLES = ['COO','HTD','PM Head','PMO'];
  PDMS.isSalesRole = function(user){
    user = user || PDMS.getUser();
    return !!user && user.role === 'Sales';
  };
  PDMS.isDeliveryRole = function(user){
    user = user || PDMS.getUser();
    return !!user && DELIVERY_ROLES.includes(user.role);
  };
  // The status options a role should see when creating a project or changing one's status.
  PDMS.statusOptionsFor = function(user){
    user = user || PDMS.getUser();
    if(!user) return [];
    if(user.role === 'System Administrator') return global.PDMS_DATA.statuses;
    if(PDMS.isSalesRole(user)) return global.PDMS_DATA.salesStatuses;
    if(PDMS.isDeliveryRole(user)) return global.PDMS_DATA.deliveryStatuses;
    return [];
  };
  // The stage a newly-created project should start in, based on who's creating it.
  PDMS.stageFor = function(user){
    user = user || PDMS.getUser();
    return PDMS.isSalesRole(user) ? 'Sales' : 'Delivery';
  };
  // A project's stage should always be explicit ('Sales'/'Delivery'), but falls
  // back to inferring from its status for records saved before the 'stage'
  // column existed on the Projects sheet, so they don't just disappear.
  PDMS.stageOf = function(project){
    if(project && (project.stage === 'Sales' || project.stage === 'Delivery')) return project.stage;
    return (project && global.PDMS_DATA.salesStatuses.includes(project.status)) ? 'Sales' : 'Delivery';
  };
  // Whether this user may change THIS project's status, given its current stage.
  PDMS.canManageStatus = function(project, user){
    user = user || PDMS.getUser();
    if(!user || !project) return false;
    if(user.role === 'System Administrator') return true;
    return PDMS.stageOf(project) === 'Sales' ? PDMS.isSalesRole(user) : PDMS.isDeliveryRole(user);
  };
  PDMS.canChangeStatus = function(project, newStatus, user){
    user = user || PDMS.getUser();
    if(!PDMS.canManageStatus(project, user)) return false;
    const list = PDMS.stageOf(project) === 'Sales' ? global.PDMS_DATA.salesStatuses : global.PDMS_DATA.deliveryStatuses;
    return list.includes(newStatus);
  };

  // Where "role-based sign-in" lands each role after auth. Consultant has no
  // dedicated variant, so it (and any unmapped role) falls back to the generic dashboard.
  const DASHBOARD_BY_ROLE = {
    'System Administrator': 'dashboard-admin.html',
    'HR': 'dashboard-hr.html',
    'HTD': 'dashboard-htd.html',
    'COO': 'dashboard-coo.html',
    'PM Head': 'dashboard-pm.html',
    'PMO': 'dashboard-pmo.html',
    'Sales': 'dashboard-sales.html',
    'Consultant': 'dashboard-consultant.html'
  };
  PDMS.dashboardFor = function(user){
    user = user || PDMS.getUser();
    return (user && DASHBOARD_BY_ROLE[user.role]) || 'dashboard.html';
  };
})(window);
