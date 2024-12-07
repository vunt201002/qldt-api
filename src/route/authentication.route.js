import express from 'express';
import {
  changeAccountInfo,
  getAccountVerifyCode,
  login,
  logout,
  signUp,
  verifyAccount,
} from '../controller/authentication.controller.js';
import {verifyToken} from '../middleware/authorization.js';
import {verifyAccountExists} from '../middleware/verifyAccount.js';
import upload from '../config/multer.config.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-code', verifyAccountExists, verifyAccount);
router.get('/verify-code', verifyAccountExists, getAccountVerifyCode);
router.post('/login', verifyAccountExists, login);
router.post('/logout', verifyAccountExists, logout);
router.put('/account', verifyToken, upload.single('avatar'), changeAccountInfo);

export default router;
