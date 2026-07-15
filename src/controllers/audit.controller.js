import { getAuditEvents } from '../models/audit.model.js';

export async function getAuditLogs(req, res) {
  const events = await getAuditEvents();
  res.json({ data: events });
}
