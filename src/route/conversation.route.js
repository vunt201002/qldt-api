import express from 'express';
import {createConversation, getAccountConversation} from '../controller/conversation.controller.js';
import {verifyToken} from '../middleware/authorization.js';

const router = express.Router();

router.get('/', verifyToken, getAccountConversation);

router.post('/', verifyToken, createConversation);

export default router;
