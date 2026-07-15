import { listDepartments, createDepartment } from '../models/department.model.js';
import { logEvent } from '../models/audit.model.js';

export async function getDepartments(req, res) {
  const departments = await listDepartments();
  res.json({ data: departments });
}

export async function postDepartment(req, res) {
  const department = await createDepartment(req.body);
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Create department', subject: department.name, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.status(201).json({ data: department });
}
