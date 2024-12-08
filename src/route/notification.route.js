import express from 'express';
import {
  createOrUpdateNotification,
  getStudentNotifications,
  markNotificationsAsRead,
} from '../controller/notification.controller.js';
import {verifyRoleAndCondition} from '../middleware/authorization.js';
import roleEnum from '../enumurator/role.enum.js';

const router = express.Router();

router.get(
  '/:studentId',
  verifyRoleAndCondition([roleEnum.ADMIN, roleEnum.STUDENT]),
  getStudentNotifications,
);

router.post(
  '/',
  verifyRoleAndCondition([roleEnum.ADMIN, roleEnum.TEACHER]),
  createOrUpdateNotification,
);
router.post(
  '/:studentId',
  verifyRoleAndCondition([roleEnum.ADMIN, roleEnum.STUDENT]),
  markNotificationsAsRead,
);

// router.put('/:id', createOrUpdateNotification);

export default router;
