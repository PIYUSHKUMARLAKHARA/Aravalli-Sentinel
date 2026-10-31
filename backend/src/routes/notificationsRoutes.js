import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import {
  getCitizenNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notificationsController.js';

const router = express.Router();

// All notification endpoints require authenticated user session
router.use(authenticateUser);

// GET /api/notifications
router.get('/', getCitizenNotifications);

// PATCH /api/notifications/read-all
router.patch('/read-all', markAllNotificationsAsRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markNotificationAsRead);

export default router;
