import { query } from '../db/db.js';

function normalizeProject(row) {
  if (!row) return null;
  const consultants = row.consultants ? (() => {
    try { return JSON.parse(row.consultants); } catch (err) { return String(row.consultants).split(',').map(v => v.trim()).filter(Boolean); }
  })() : [];

  return {
    id: row.id,
    project_code: row.project_code,
    name: row.name,
    client: row.client,
    description: row.description,
    dept: row.department || row.dept || '',
    department: row.department || row.dept || '',
    priority: row.priority,
    status: row.status,
    budget: Number(row.budget) || 0,
    pm: row.project_manager || row.pm || '',
    lead: row.project_lead || row.lead || '',
    sales: row.sales || row.sales_rep || '',
    consultants,
    files: row.files || 0,
    remarks: row.remarks || 0,
    start: row.start || row.start_date || null,
    due: row.due || row.due_date || null,
    completion: row.completion || row.completion_date || null,
    project_type: row.type || row.project_type || '',
    type: row.type || row.project_type || '',
    progress: Number(row.progress) || 0,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export async function listProjects() {
  const rows = await query(`SELECT p.id, p.project_code, p.name, c.name AS client, p.description, d.name AS department, p.type, p.sales, p.consultants, p.files, p.remarks, p.priority, p.status, p.budget, u.name AS project_manager, l.name AS project_lead, p.created_by, p.assigned_by, strftime('%Y-%m-%d', p.start_date) AS start, strftime('%Y-%m-%d', p.due_date) AS due, strftime('%Y-%m-%d', p.completion_date) AS completion, p.progress, p.created_at, p.updated_at FROM projects p LEFT JOIN clients c ON p.client_id = c.id LEFT JOIN departments d ON p.department_id = d.id LEFT JOIN users u ON p.project_manager = u.id LEFT JOIN users l ON p.project_lead = l.id ORDER BY p.created_at DESC`);
  return rows.map(normalizeProject);
}

export async function findProject(id) {
  const rows = await query('SELECT * FROM projects WHERE id = ?', [id]);
  return normalizeProject(rows[0]);
}

function mapProjectPatch(patch) {
  const mapped = { ...patch };
  if (mapped.start) { mapped.start_date = mapped.start; delete mapped.start; }
  if (mapped.due) { mapped.due_date = mapped.due; delete mapped.due; }
  if (mapped.completion) { mapped.completion_date = mapped.completion; delete mapped.completion; }
  if (mapped.type) { mapped.type = mapped.type; }
  if (mapped.sales) { mapped.sales = mapped.sales; }
  if (mapped.consultants && Array.isArray(mapped.consultants)) { mapped.consultants = JSON.stringify(mapped.consultants); }
  if (mapped.consultants && typeof mapped.consultants !== 'string') { mapped.consultants = String(mapped.consultants); }
  return mapped;
}

export async function createProject(project) {
  const mapped = mapProjectPatch(project);
  const {
    project_code,
    name,
    client_id,
    description,
    department_id,
    type,
    priority,
    status,
    budget,
    project_manager,
    project_lead,
    sales,
    consultants,
    files = 0,
    remarks = 0,
    created_by,
    assigned_by,
    start_date,
    due_date,
    completion_date,
    progress = 0
  } = mapped;

  const result = await query(
    `INSERT INTO projects (project_code, name, client_id, description, department_id, type, priority, status, budget, project_manager, project_lead, sales, consultants, files, remarks, created_by, assigned_by, start_date, due_date, completion_date, progress)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [project_code, name, client_id, description, department_id, type, priority, status, budget, project_manager, project_lead, sales, consultants, files, remarks, created_by, assigned_by, start_date, due_date, completion_date, progress]
  );
  return findProject(result.insertId);
}

export async function updateProject(id, patch) {
  const mapped = mapProjectPatch(patch);
  const fields = [];
  const values = [];
  Object.entries(mapped).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });
  values.push(id);
  await query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
  return findProject(id);
}
