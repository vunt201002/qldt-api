import express from 'express';
import {verifyToken} from '../middleware/authorization.js';
import {createMessage, deleteMessage} from '../controller/message.controller.js';

const router = express.Router();

router.post('/', verifyToken, createMessage);

router.delete('/:id', verifyToken, deleteMessage);

export default router;
