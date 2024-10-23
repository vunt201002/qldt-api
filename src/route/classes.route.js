import express from 'express';
import {
  createOrUpdateClass,
  deleteClass,
  getAllClasses,
  getClassSchedule,
  getOneClass,
} from '../controller/classes.controller.js';
import {verifyToken} from '../middleware/authorization.js';

const router = express.Router();

router.get('/', verifyToken, getAllClasses);
router.get('/:id', verifyToken, getOneClass);
router.get('/schedules/:id', getClassSchedule);

router.post('/', createOrUpdateClass);
router.put('/:id', createOrUpdateClass);

router.delete('/:id', deleteClass);

export default router;
