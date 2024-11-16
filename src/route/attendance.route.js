import express from 'express';
import {
  createOrUpdateAttendance,
  getClassAttendance,
  getStudentAttendance,
  takeAttendance,
} from '../controller/attendance.controller.js';
import {verifyToken} from '../middleware/authorization.js';

const router = express.Router();

router.get('/student/:studentId', verifyToken, getStudentAttendance);
router.get('/class/:classId', getClassAttendance);

router.post('/', takeAttendance);

router.put('/:id', createOrUpdateAttendance);

export default router;
