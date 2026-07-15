import { Router } from 'express';
import { getUsers, patchUser } from '../controllers/users.controller.js';
import { requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', requireRole(['General Admin','HR','HTD','COO']), getUsers);
router.patch('/:id', requireRole(['General Admin','HR','HTD','COO']), patchUser);

export default router;
