import express from 'express';
import {createConversation} from '../controller/conversation.controller.js';
import {verifyToken} from '../middleware/authorization.js';

const router = express.Router();

router.post('/', verifyToken, createConversation);

export default router;
