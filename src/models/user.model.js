import { query } from '../db/db.js';

export async function findUserByEmail(email) {
  const rows = await query('SELECT id, name, email, password, role, department, status FROM users WHERE email = ?', [email]);
  return rows[0];
}

export async function findUserById(id) {
  const rows = await query('SELECT id, name, email, role, department, status FROM users WHERE id = ?', [id]);
  return rows[0];
}

export async function createUser(user) {
  const { name, email, password, role, department, status = 'Active' } = user;
  const result = await query(
    'INSERT INTO users (name, email, password, role, department, status) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, password, role, department, status]
  );
  return findUserById(result.insertId);
}

export async function updateUser(id, patch) {
  const fields = [];
  const values = [];
  Object.entries(patch).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });
  values.push(id);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findUserById(id);
}

export async function listUsers() {
  return query('SELECT id, name, email, role, department, status FROM users ORDER BY created_at DESC');
}
