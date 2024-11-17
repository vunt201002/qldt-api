import express from 'express';
import {createOrUpdateNotification} from '../controller/notification.controller.js';

const router = express.Router();

router.post('/', createOrUpdateNotification);

export default router;
