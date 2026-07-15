import { Router } from 'express';
import { requireRole } from '../middleware/auth.middleware.js';
import { getConsultants, patchConsultant } from '../controllers/consultants.controller.js';

const router = Router();
router.get('/', requireRole(['General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Consultant','Viewer']), getConsultants);
router.patch('/:id', requireRole(['General Admin','HR','HTD','COO','Lead Project Manager','Project Manager']), patchConsultant);

export default router;
