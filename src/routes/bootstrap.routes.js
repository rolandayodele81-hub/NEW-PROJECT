import { Router } from 'express';
import { bootstrap } from '../controllers/bootstrap.controller.js';

const router = Router();
router.get('/', bootstrap);
export default router;
