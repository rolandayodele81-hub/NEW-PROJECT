import { Router } from 'express';
import { getNotifications, postNotification, putNotificationRead } from '../controllers/notifications.controller.js';

const router = Router();
router.get('/', getNotifications);
router.post('/', postNotification);
router.put('/:id/read', putNotificationRead);
export default router;
