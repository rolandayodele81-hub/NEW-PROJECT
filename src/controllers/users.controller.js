import { listUsers, createUser as createUserModel, updateUser } from '../models/user.model.js';
import { logEvent } from '../models/audit.model.js';

export async function getUsers(req, res) {
  const users = await listUsers();
  res.json({ data: users });
}

export async function createUser(req, res) {
  const payload = req.body;
  const user = await createUserModel({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    department: payload.department || payload.dept,
    phone: payload.phone,
    availability: payload.availability,
    workload: payload.workload,
    specialty: payload.specialty,
    rate: payload.rate,
    projects: payload.projects,
    rating: payload.rating,
    status: payload.status || 'Active'
  });
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Create user', subject: user.email, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.status(201).json({ data: user });
}

export async function patchUser(req, res) {
  const { id } = req.params;
  const patch = req.body;
  const updated = await updateUser(id, patch);
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Update user', subject: `User ${id}`, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.json({ data: updated });
}
