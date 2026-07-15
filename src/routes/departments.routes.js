import { Router } from 'express';
import { requireRole } from '../middleware/auth.middleware.js';
import { getDepartments, postDepartment } from '../controllers/departments.controller.js';

const router = Router();
router.get('/', requireRole(['General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Sales','Consultant','Viewer']), getDepartments);
router.post('/', requireRole(['General Admin','HR','COO','HTD']), postDepartment);

export default router;
