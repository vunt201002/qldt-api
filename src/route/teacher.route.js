import express from 'express';
import {createOrUpdateTeacher} from '../controller/teacher.controller.js';
import {verifyAdmin} from '../middleware/authorization.js';

const router = express.Router();

router.post('/', verifyAdmin, createOrUpdateTeacher);

export default router;
