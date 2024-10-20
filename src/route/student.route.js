import express from 'express';
import {createOrUpdateStudent} from '../controller/student.controller.js';

const router = express.Router();

router.post('/', createOrUpdateStudent);

export default router;
