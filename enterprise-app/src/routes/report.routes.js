import express from 'express';
import { queryReports } from '../controllers/report.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorizeRoles('General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Sales'), queryReports);

export default router;
