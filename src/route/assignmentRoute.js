import express from 'express';
import {
  createOrUpdateAssignment,
  deleteAssignment,
  getAssignment,
} from '../controller/assignment.controller.js';

const router = express.Router();

router.get('/', getAssignment);
router.get('/:id', getAssignment);

router.delete('/:id', deleteAssignment);

router.post('/', createOrUpdateAssignment);

router.put('/:id', createOrUpdateAssignment);

export default router;
