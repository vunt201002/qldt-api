import express from 'express';
import {verifyToken} from '../middleware/authorization.js';
import {createMessage} from '../controller/message.controller.js';

const router = express.Router();

router.post('/', createMessage);

export default router;
