import { query } from '../db/db.js';

export async function listConsultants() {
  const rows = await query('SELECT id, name, email, role, department, status, phone, availability, workload, specialty, rate, projects, rating FROM users WHERE role = ? ORDER BY name', ['Consultant']);
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    dept: row.department || '',
    status: row.status,
    phone: row.phone || '',
    availability: row.availability || 'Available',
    workload: row.workload || 0,
    specialty: row.specialty || 'Consulting',
    rate: Number(row.rate) || 0,
    projects: row.projects || 0,
    rating: row.rating || '4.8'
  }));
}

export async function updateConsultant(id, patch) {
  const fields = [];
  const values = [];
  Object.entries(patch).forEach(([key, value]) => {
    const column = key === 'dept' ? 'department' : key;
    fields.push(`${column} = ?`);
    values.push(value);
  });
  values.push(id);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  const rows = await query('SELECT id, name, email, role, department, status, phone, availability, workload, specialty, rate, projects, rating FROM users WHERE id = ?', [id]);
  return rows[0];
}
