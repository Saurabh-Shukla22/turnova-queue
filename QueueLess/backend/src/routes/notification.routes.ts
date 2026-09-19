import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  updateSettings,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getNotifications);
router.patch('/read-all', authenticate, markAllAsRead);
router.patch('/settings', authenticate, updateSettings);
router.patch('/:id/read', authenticate, markAsRead);

export default router;
