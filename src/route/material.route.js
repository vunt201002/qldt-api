import express from 'express';
import {createOrUpdateMaterial} from '../controller/material.controller.js';

const router = express.Router();

router.post('/:classId', createOrUpdateMaterial);

export default router;
