import { query } from '../db/db.js';

export async function createNotification(notification) {
  const { user_id, title, message, type, read_flag = 0 } = notification;
  const result = await query(
    'INSERT INTO notifications (user_id, title, message, type, read_flag) VALUES (?, ?, ?, ?, ?)',
    [user_id, title, message, type, read_flag]
  );
  return query('SELECT * FROM notifications WHERE id = ?', [result.insertId]).then(rows => rows[0]);
}

export async function listNotifications(user_id) {
  return query('SELECT id, title, message, type, read_flag, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100', [user_id]);
}

export async function markNotificationRead(id) {
  await query('UPDATE notifications SET read_flag = 1 WHERE id = ?', [id]);
  return query('SELECT * FROM notifications WHERE id = ?', [id]).then(rows => rows[0]);
}
