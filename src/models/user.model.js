import { query } from '../db/db.js';

function normalizeUser(row) {
  if (!row) return null;
  const joinedDate = row.created_at ? new Date(row.created_at) : null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    dept: row.department || row.dept || '',
    department: row.department || row.dept || '',
    status: row.status,
    joined: joinedDate ? joinedDate.toISOString().slice(0, 10) : null,
    phone: row.phone || '',
    availability: row.availability || 'Available',
    workload: row.workload || 0
  };
}

export async function findUserByEmail(email) {
  const rows = await query('SELECT id, name, email, password, role, department, status, created_at FROM users WHERE email = ?', [email]);
  return rows[0];
}

export async function findUserById(id) {
  const rows = await query('SELECT id, name, email, role, department, status, created_at, phone, availability, workload FROM users WHERE id = ?', [id]);
  return normalizeUser(rows[0]);
}

export async function createUser(user) {
  const { name, email, password, role, department, status = 'Active' } = user;
  const result = await query(
    'INSERT INTO users (name, email, password, role, department, status) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, password, role, department, status]
  );
  return findUserById(result.lastID);
}

export async function updateUser(id, patch) {
  const fields = [];
  const values = [];
  Object.entries(patch).forEach(([key, value]) => {
    const column = key === 'dept' ? 'department' : key;
    fields.push(`${column} = ?`);
    values.push(value);
  });
  values.push(id);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findUserById(id);
}

export async function listUsers() {
  const rows = await query('SELECT id, name, email, role, department AS dept, status, created_at, phone, availability, workload FROM users ORDER BY created_at DESC');
  return rows.map(normalizeUser);
}
