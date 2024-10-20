import express from 'express';
import {createOrUpdateTeacher} from '../controller/teacher.controller.js';

const router = express.Router();

router.post('/', createOrUpdateTeacher);

export default router;
