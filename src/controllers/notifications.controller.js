import { listNotifications, createNotification, markNotificationRead } from '../models/notification.model.js';
import { logEvent } from '../models/audit.model.js';

export async function getNotifications(req, res) {
  const notifications = await listNotifications(req.user.id);
  res.json({ data: notifications });
}

export async function postNotification(req, res) {
  const notification = await createNotification({ ...req.body, user_id: req.user.id });
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Create notification', subject: notification.title, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.status(201).json({ data: notification });
}

export async function putNotificationRead(req, res) {
  const notification = await markNotificationRead(req.params.id);
  res.json({ data: notification });
}
