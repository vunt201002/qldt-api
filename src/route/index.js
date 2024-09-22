import authRoute from './authentication.route.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRoute);

export default router;
