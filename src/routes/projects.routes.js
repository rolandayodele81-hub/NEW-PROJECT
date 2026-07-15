import { Router } from 'express';
import { getProjects, postProject, patchProject } from '../controllers/projects.controller.js';
import { requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', requireRole(['General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Sales','Consultant','Viewer']), getProjects);
router.post('/', requireRole(['General Admin','HR','HTD','COO','Sales','Lead Project Manager']), postProject);
router.patch('/:id', requireRole(['General Admin','HR','HTD','COO','Lead Project Manager','Project Manager']), patchProject);

export default router;
