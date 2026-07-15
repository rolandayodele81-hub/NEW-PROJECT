import { Router } from 'express';
import { requireRole } from '../middleware/auth.middleware.js';
import { getClients, postClient } from '../controllers/clients.controller.js';

const router = Router();
router.get('/', requireRole(['General Admin','HR','HTD','COO','Sales','Lead Project Manager','Project Manager','Consultant','Viewer']), getClients);
router.post('/', requireRole(['General Admin','HR','HTD','COO','Sales']), postClient);

export default router;
