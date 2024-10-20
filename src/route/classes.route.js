import express from 'express';
import {
  createOrUpdateClass,
  deleteClass,
  getAllClasses,
  getClassSchedule,
  getOneClass,
} from '../controller/classes.controller.js';

const router = express.Router();

router.get('/', getAllClasses);
router.get('/:id', getOneClass);
router.get('/schedules/:id', getClassSchedule);

router.post('/', createOrUpdateClass);
router.put('/:id', createOrUpdateClass);

router.delete('/:id', deleteClass);

export default router;
