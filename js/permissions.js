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
    'Assign PM':            ['HTD','COO','General Admin'],
    'Assign Lead':          ['HTD','COO','Project Manager','General Admin'],
    'Assign Consultant':    ['HTD','COO','Project Manager','General Admin'],
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
    'COO': 'dashboard-coo.html',
    'Lead Project Manager': 'dashboard-pm.html',
    'Project Manager': 'dashboard-pm.html',
    'Sales': 'dashboard-sales.html'
  };
  PDMS.dashboardFor = function(user){
    user = user || PDMS.getUser();
    return (user && DASHBOARD_BY_ROLE[user.role]) || 'dashboard.html';
  };
})(window);
