import { listProjects, createProject, updateProject } from '../models/project.model.js';
import { logEvent } from '../models/audit.model.js';

export async function getProjects(req, res) {
  const projects = await listProjects();
  res.json({ data: projects });
}

export async function postProject(req, res) {
  const payload = req.body;
  const project = await createProject({
    ...payload,
    created_by: req.user.id,
    assigned_by: req.user.id,
    project_code: payload.project_code || `PSE-${Date.now()}`
  });
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Create project', subject: project.name, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.status(201).json({ data: project });
}

export async function patchProject(req, res) {
  const { id } = req.params;
  const project = await updateProject(id, req.body);
  await logEvent({ user_id: req.user.id, role: req.user.role, action: 'Update project', subject: project.name, ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.json({ data: project });
}
