import express from 'express';
import {login, signUp, verifyAccount} from '../controller/authentication.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-code', verifyAccount);
router.post('/login', login);

export default router;
