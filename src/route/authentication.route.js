import express from 'express';
import {signUp, verifyAccount} from '../controller/authentication.controller.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-code', verifyAccount);

export default router;
