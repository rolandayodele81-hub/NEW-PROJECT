import { query } from '../db/db.js';
import { listProjects } from './project.model.js';

function normalizeUser(row) {
  const joinedDate = row.created_at ? new Date(row.created_at) : null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    dept: row.department || row.dept || '',
    status: row.status,
    joined: joinedDate ? joinedDate.toISOString().slice(0, 10) : null,
    phone: row.phone || '',
    availability: row.availability || 'Available',
    workload: row.workload || 0
  };
}

function normalizeDepartment(row) {
  return {
    id: row.id,
    name: row.name,
    head: row.manager || row.head || '',
    count: row.count || 0,
    color: row.color || 'primary'
  };
}

function normalizeClient(row) {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    contact: row.contact || '',
    email: row.email,
    phone: row.phone,
    projects: row.projects || 0,
    revenue: Number(row.revenue) || 0
  };
}

function normalizeActivity(row) {
  const time = row.created_at ? new Date(row.created_at).toLocaleString('en-US', { hour12: true, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';
  return {
    id: row.id,
    user: row.user || 'System',
    role: row.role,
    action: row.action,
    target: row.target || row.subject || '',
    ip_address: row.ip_address,
    user_agent: row.user_agent,
    created_at: row.created_at,
    time
  };
}

export async function loadBootstrapData() {
  const [users, departments, clients, notifications, activities] = await Promise.all([
    query('SELECT id, name, email, role, department, status, created_at, phone, availability, workload FROM users ORDER BY created_at DESC'),
    query('SELECT id, name, manager, count, color FROM departments ORDER BY name'),
    query('SELECT id, name, industry, contact, email, phone, projects, revenue FROM clients ORDER BY name'),
    query('SELECT id, title, message, type, read_flag AS unread, created_at FROM notifications ORDER BY created_at DESC LIMIT 50'),
    query('SELECT a.id, u.name AS user, a.role, a.action, a.subject AS target, a.ip_address, a.user_agent, a.created_at FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 50')
  ]);

  const projects = await listProjects();
  const consultants = users.filter(u => u.role === 'Consultant').map(normalizeUser);
  const roles = ['General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Sales','Consultant','Viewer'];
  const priorities = ['Critical','High','Medium','Low'];
  const statuses = ['Incoming','Pending','Assigned','Confirmed','In Progress','Waiting Client','Review','Testing','Completed','Delivered','Closed','Cancelled'];

  return {
    users: users.map(normalizeUser),
    departments: departments.map(normalizeDepartment),
    clients: clients.map(normalizeClient),
    notifications,
    activities: activities.map(normalizeActivity),
    projects,
    consultants,
    roles,
    priorities,
    statuses
  };
}
