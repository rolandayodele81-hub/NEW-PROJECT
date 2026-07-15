import express from 'express';
import { login, currentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/login', login);
router.get('/me', authenticate, currentUser);

export default router;
