import express from 'express';
import Project from '../models/project.model.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import AuditLog from '../models/auditLog.model.js';

const router = express.Router();
router.use(authenticate);

const canViewProject = authorizeRoles('General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Sales','Consultant','Viewer');
const canEditProject = authorizeRoles('General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Sales');

router.get('/', canViewProject, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'Project Manager') filter.project_manager_id = req.user.id;
    if (req.user.role === 'Consultant') filter['$ProjectAssignments.user_id$'] = req.user.id;

    const projects = await Project.findAll({ where: filter, order: [['updatedAt','DESC']] });
    return res.json({ projects });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to load projects.', error: err.message });
  }
});

router.post('/', canEditProject, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, created_by_id: req.user.id, assigned_by_id: req.user.id });
    await AuditLog.create({ user_id: req.user.id, action: 'Create project', entity: 'Project', entity_id: String(project.id), details: project.name });
    return res.status(201).json({ project });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to create project.', error: err.message });
  }
});

router.get('/:id', canViewProject, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.json({ project });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to load project.', error: err.message });
  }
});

router.put('/:id', canEditProject, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    await project.update(req.body);
    await AuditLog.create({ user_id: req.user.id, action: 'Update project', entity: 'Project', entity_id: req.params.id, details: JSON.stringify(req.body) });
    return res.json({ project });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to update project.', error: err.message });
  }
});

router.post('/:id/status', canEditProject, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    const { status } = req.body;
    await project.update({ status });
    await AuditLog.create({ user_id: req.user.id, action: 'Change project status', entity: 'Project', entity_id: req.params.id, details: status });
    return res.json({ project });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to update project status.', error: err.message });
  }
});

export default router;
