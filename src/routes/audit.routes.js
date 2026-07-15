import { Router } from 'express';
import { getAuditLogs } from '../controllers/audit.controller.js';
import { requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', requireRole(['General Admin','COO','HTD']), getAuditLogs);
export default router;
