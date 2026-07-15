import { listClients, createClient } from '../models/client.model.js';
import { logEvent } from '../models/audit.model.js';

export async function getClients(req, res) {
  const clients = await listClients();
  res.json({ data: clients });
}

export async function postClient(req, res) {
  const client = await createClient(req.body);
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Create client', subject: client.name, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.status(201).json({ data: client });
}
