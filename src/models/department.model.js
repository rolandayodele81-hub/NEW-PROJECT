import { query } from '../db/db.js';

export async function listDepartments() {
  const rows = await query('SELECT id, name, manager, count, color FROM departments ORDER BY name');
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    head: row.manager,
    count: row.count || 0,
    color: row.color || 'primary'
  }));
}

export async function createDepartment(data) {
  const { name, manager = '', count = 0, color = 'primary' } = data;
  const result = await query(
    'INSERT INTO departments (name, manager, count, color) VALUES (?, ?, ?, ?)',
    [name, manager, count, color]
  );
  const rows = await query('SELECT id, name, manager, count, color FROM departments WHERE id = ?', [result.insertId]);
  return {
    id: rows[0].id,
    name: rows[0].name,
    head: rows[0].manager,
    count: rows[0].count || 0,
    color: rows[0].color || 'primary'
  };
}
