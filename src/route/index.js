import authRoute from './authentication.route.js';
import express from 'express';
import accountRoute from './account.route.js';
import classesRoute from './classes.route.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/accounts', accountRoute);
router.use('/classes', classesRoute);

export default router;
