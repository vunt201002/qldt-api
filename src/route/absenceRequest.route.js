import express from 'express';
import {
  createOrUpdateAbsenceRequest,
  getAllAbsenceRequests,
  reviewAbsenceRequests,
} from '../controller/absenceRequest.controller.js';
import {verifyRoleAndCondition, verifyToken} from '../middleware/authorization.js';
import roleEnum from '../enumurator/role.enum.js';
import {verifyStudentSendAr} from '../service/absenseRequestService.js';

const router = express.Router();

router.get('/', verifyToken, getAllAbsenceRequests);

router.post(
  '/',
  verifyRoleAndCondition([roleEnum.ADMIN, roleEnum.STUDENT], verifyStudentSendAr),
  createOrUpdateAbsenceRequest,
);

// router.put('/:id', createOrUpdateAbsenceRequest);
router.put(
  '/review',
  verifyRoleAndCondition([roleEnum.ADMIN, roleEnum.TEACHER]),
  reviewAbsenceRequests,
);

export default router;
