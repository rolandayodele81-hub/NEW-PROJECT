import { query } from '../db/db.js';

export async function listProjects() {
  return query(`SELECT p.id, p.project_code, p.name, c.name AS client, p.description, d.name AS department, p.priority, p.status, p.budget, u.name AS project_manager, l.name AS project_lead, p.created_by, p.assigned_by, p.start_date, p.due_date, p.completion_date, p.progress, p.created_at, p.updated_at FROM projects p LEFT JOIN clients c ON p.client_id = c.id LEFT JOIN departments d ON p.department_id = d.id LEFT JOIN users u ON p.project_manager = u.id LEFT JOIN users l ON p.project_lead = l.id ORDER BY p.created_at DESC`);
}

export async function findProject(id) {
  const rows = await query('SELECT * FROM projects WHERE id = ?', [id]);
  return rows[0];
}

export async function createProject(project) {
  const {
    project_code,
    name,
    client_id,
    description,
    department_id,
    priority,
    status,
    budget,
    project_manager,
    project_lead,
    created_by,
    assigned_by,
    start_date,
    due_date,
    completion_date,
    progress
  } = project;

  const result = await query(
    `INSERT INTO projects (project_code, name, client_id, description, department_id, priority, status, budget, project_manager, project_lead, created_by, assigned_by, start_date, due_date, completion_date, progress)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [project_code, name, client_id, description, department_id, priority, status, budget, project_manager, project_lead, created_by, assigned_by, start_date, due_date, completion_date, progress]
  );
  return findProject(result.insertId);
}

export async function updateProject(id, patch) {
  const fields = [];
  const values = [];
  Object.entries(patch).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });
  values.push(id);
  await query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
  return findProject(id);
}
