import express from 'express';
import {createOrUpdateTeacher} from '../controller/teacher.controller.js';
import {requiredField} from '../middleware/requiredField.js';
import TeacherModel from '../model/teacher.model.js';

const router = express.Router();

router.post('/', requiredField(TeacherModel), createOrUpdateTeacher);

export default router;
