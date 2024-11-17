import express from 'express';
import {
  createOrUpdateAbsenceRequest,
  getAllAbsenceRequests,
} from '../controller/absenceRequest.controller.js';
import {verifyToken} from '../middleware/authorization.js';

const router = express.Router();

router.get('/', verifyToken, getAllAbsenceRequests);

router.post('/', createOrUpdateAbsenceRequest);

router.put('/:id', createOrUpdateAbsenceRequest);
router.put('/review/:id', createOrUpdateAbsenceRequest);

export default router;
