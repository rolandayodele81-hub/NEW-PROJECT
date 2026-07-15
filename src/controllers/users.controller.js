import { listUsers, updateUser } from '../models/user.model.js';
import { logEvent } from '../models/audit.model.js';

export async function getUsers(req, res) {
  const users = await listUsers();
  res.json({ data: users });
}

export async function patchUser(req, res) {
  const { id } = req.params;
  const patch = req.body;
  const updated = await updateUser(id, patch);
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Update user', subject: `User ${id}`, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.json({ data: updated });
}
