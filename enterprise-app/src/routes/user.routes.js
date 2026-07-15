import express from 'express';
import { getAllUsers, createUser, updateUser, disableUser, resetPassword } from '../controllers/user.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticate);
router.get('/', authorizeRoles('General Admin','HR','COO','HTD','Lead Project Manager'), getAllUsers);
router.post('/', authorizeRoles('General Admin','HR'), createUser);
router.put('/:id', authorizeRoles('General Admin'), updateUser);
router.post('/:id/disable', authorizeRoles('General Admin'), disableUser);
router.post('/:id/reset-password', authorizeRoles('General Admin'), resetPassword);

export default router;
