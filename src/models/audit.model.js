import { query } from '../db/db.js';

export async function logEvent(entry) {
  const { user_id, role, action, subject, ip_address, user_agent } = entry;
  await query(
    'INSERT INTO audit_logs (user_id, role, action, subject, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, role, action, subject, ip_address, user_agent]
  );
}

export async function getAuditEvents() {
  return query('SELECT id, user_id, role, action, subject, ip_address, user_agent, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 200');
}
