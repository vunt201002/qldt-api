import express from 'express';
import {getAllAccounts} from '../controller/account.controller.js';
import {verifyToken} from '../middleware/authorization.js';

const router = express.Router();

router.get('/', verifyToken, getAllAccounts);

export default router;
