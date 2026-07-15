import { query } from '../db/db.js';

export async function listClients() {
  const rows = await query('SELECT id, name, industry, contact, email, phone, projects, revenue FROM clients ORDER BY name');
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    industry: row.industry,
    contact: row.contact,
    email: row.email,
    phone: row.phone,
    projects: row.projects || 0,
    revenue: Number(row.revenue) || 0
  }));
}

export async function createClient(data) {
  const { name, industry, contact = '', email = '', phone = '', projects = 0, revenue = 0 } = data;
  const result = await query(
    'INSERT INTO clients (name, industry, contact, email, phone, projects, revenue) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, industry, contact, email, phone, projects, revenue]
  );
  const rows = await query('SELECT id, name, industry, contact, email, phone, projects, revenue FROM clients WHERE id = ?', [result.insertId]);
  return rows[0];
}
