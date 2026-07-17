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
    'Close Project':       ['COO','HTD','PM Head','PMO'],
    'Add Remarks':         ['HR','COO','HTD','PM Head','PMO','Sales','Consultant','System Administrator'],
    'View Reports':        ['HR','COO','HTD','PM Head','PMO','Sales','Consultant','System Administrator'],
    'Manage Permissions':  ['System Administrator'],
    'Confirm Project':     ['Sales'],
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
