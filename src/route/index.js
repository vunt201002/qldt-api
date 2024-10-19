import authRoute from './authentication.route.js';
import express from 'express';
import accountRoute from './account.route.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/accounts', accountRoute);

export default router;
