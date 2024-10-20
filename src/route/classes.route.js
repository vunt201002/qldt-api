import express from 'express';
import {getAllClasses} from '../controller/classes.controller.js';

const router = express.Router();

router.get('/', getAllClasses);

export default router;
