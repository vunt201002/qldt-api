import authRoute from './authentication.route.js';
import express from 'express';
import accountRoute from './account.route.js';
import classesRoute from './classes.route.js';
import teacherRoute from './teacher.route.js';
import studentRoute from './student.route.js';
import materialRoute from './material.route.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/accounts', accountRoute);
router.use('/classes', classesRoute);
router.use('/teachers', teacherRoute);
router.use('/students', studentRoute);
router.use('/materials', materialRoute);

export default router;
