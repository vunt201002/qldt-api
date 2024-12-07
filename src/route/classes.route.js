import express from 'express';
import {
  createOrUpdateClass,
  deleteClass,
  getAllClasses,
  getClassSchedule,
  getOneClass,
} from '../controller/classes.controller.js';
import {
  verifyAccessApi,
  verifyAdmin,
  verifyRoleAndCondition,
  verifyToken,
} from '../middleware/authorization.js';
import roleEnum from '../enumurator/role.enum.js';
import isTeacherOwnerOfClass from '../middleware/isTeacherOwnerOfClass.js';

const router = express.Router();

router.get('/', verifyToken, getAllClasses);
router.get('/:id', verifyToken, getOneClass);
router.get('/schedules/:id', getClassSchedule);

router.post('/', verifyRoleAndCondition([roleEnum.ADMIN]), createOrUpdateClass);
router.put(
  '/:id',
  verifyRoleAndCondition([roleEnum.ADMIN, roleEnum.TEACHER], isTeacherOwnerOfClass),
  createOrUpdateClass,
);

router.delete('/:id', verifyAdmin, deleteClass);

export default router;
