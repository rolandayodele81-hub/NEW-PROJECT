import { listConsultants, updateConsultant } from '../models/consultant.model.js';
import { logEvent } from '../models/audit.model.js';

export async function getConsultants(req, res) {
  const consultants = await listConsultants();
  res.json({ data: consultants });
}

export async function patchConsultant(req, res) {
  const { id } = req.params;
  const updated = await updateConsultant(id, req.body);
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Update consultant', subject: updated.name, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.json({ data: updated });
}
