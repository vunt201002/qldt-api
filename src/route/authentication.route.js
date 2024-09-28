import express from 'express';
import {
  changeAccountInfo,
  login,
  logout,
  signUp,
  verifyAccount,
} from '../controller/authentication.controller.js';
import {verifyToken} from '../middleware/authorization.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-code', verifyAccount);
router.post('/login', login);
router.post('/logout', logout);
router.put('/account', verifyToken, changeAccountInfo);

export default router;
