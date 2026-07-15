import { query } from '../db/db.js';
import { listProjects } from './project.model.js';

export async function loadBootstrapData() {
  const [users, departments, clients, notifications, activities] = await Promise.all([
    query('SELECT id, name, email, role, department, status FROM users ORDER BY created_at DESC'),
    query('SELECT id, name, manager FROM departments ORDER BY name'),
    query('SELECT id, name, industry, email, phone FROM clients ORDER BY name'),
    query('SELECT id, title, message, type, read_flag AS unread, created_at FROM notifications ORDER BY created_at DESC LIMIT 50'),
    query('SELECT id, user_id, role, action, subject, ip_address, user_agent, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 50')
  ]);

  const projects = await listProjects();
  const consultants = users.filter(u => u.role === 'Consultant');
  const roles = ['General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Sales','Consultant','Viewer'];
  const priorities = ['Critical','High','Medium','Low'];
  const statuses = ['Incoming','Pending','Assigned','In Progress','Waiting Client','Review','Testing','Completed','Delivered','Closed','Cancelled'];

  return { users, departments, clients, projects, notifications, activities, consultants, roles, priorities, statuses };
}
