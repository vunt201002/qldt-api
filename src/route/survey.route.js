import express from 'express';
import {createOrUpdateSurvey, deleteSurvey} from '../controller/survey.controller.js';
import {verifyRoleAndClassMembershipForSurvey} from '../middleware/authorization.js';

const router = express.Router();

router.post('/', verifyRoleAndClassMembershipForSurvey, createOrUpdateSurvey);

router.put('/:id', verifyRoleAndClassMembershipForSurvey, createOrUpdateSurvey);

router.delete('/:id', verifyRoleAndClassMembershipForSurvey, deleteSurvey);

export default router;
