import { Router } from 'express';
import { getNotifications, markAsRead } from './notification.controller.js';
import { authenticate } from '../../common/middleware/auth.middleware.js';

const router = Router();

// GET /api/notifications/:userId
router.get('/:userId', authenticate, getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticate, markAsRead);

export default router;