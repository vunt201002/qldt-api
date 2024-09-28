import express from 'express';
import {login, logout, signUp, verifyAccount} from '../controller/authentication.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-code', verifyAccount);
router.post('/login', login);
router.post('/logout', logout);

export default router;
