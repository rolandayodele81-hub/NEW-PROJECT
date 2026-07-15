export function requirePermission(permission) {
  return (req, res, next) => {
    const rolePermissions = {
      'General Admin': ['manage_users','manage_projects','manage_settings','view_reports','view_audit'],
      'HR': ['manage_users','assign_projects','close_projects','view_reports'],
      'HTD': ['manage_users','assign_projects','manage_delivery','view_reports'],
      'COO': ['manage_users','assign_projects','approve_projects','view_reports','view_analytics'],
      'Lead Project Manager': ['assign_pm','assign_consultants','create_milestones','view_reports'],
      'Project Manager': ['manage_assigned_projects','assign_consultants','update_progress','upload_documents'],
      'Sales': ['create_projects','create_clients','view_pipeline','update_status'],
      'Consultant': ['view_assigned_projects','update_task_progress','upload_deliverables'],
      'Viewer': ['view_only']
    };
    const userRole = req.user?.role;
    if (!userRole) return res.status(401).json({ error: 'Authentication required' });
    if (!rolePermissions[userRole] || !rolePermissions[userRole].includes(permission)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
}
