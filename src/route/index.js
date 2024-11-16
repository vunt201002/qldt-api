import authRoute from './authentication.route.js';
import express from 'express';
import accountRoute from './account.route.js';
import classesRoute from './classes.route.js';
import teacherRoute from './teacher.route.js';
import studentRoute from './student.route.js';
import materialRoute from './material.route.js';
import surveyRoute from './survey.route.js';
import surveyResponseRoute from './surveyResponse.route.js';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/accounts', accountRoute);
router.use('/classes', classesRoute);
router.use('/teachers', teacherRoute);
router.use('/students', studentRoute);
router.use('/materials', materialRoute);
router.use('/surveys', surveyRoute);
router.use('/surveyResponses', surveyResponseRoute);

export default router;
