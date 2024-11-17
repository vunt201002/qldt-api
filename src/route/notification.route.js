import express from 'express';
import {
  createOrUpdateNotification,
  getStudentNotifications,
  markNotificationsAsRead,
} from '../controller/notification.controller.js';

const router = express.Router();

router.get('/:studentId', getStudentNotifications);

router.post('/', createOrUpdateNotification);
router.post('/:studentId', markNotificationsAsRead);

router.put('/:id', createOrUpdateNotification);

export default router;
