import express from 'express';
import {
  createOrUpdateSurveyResponse,
  getAllSurveyResponses,
  gradeSurveyResponses,
} from '../controller/surveyResponse.controller.js';
import {
  verifyRoleAndCondition,
  verifyRoleAndMembership,
  verifyToken,
} from '../middleware/authorization.js';
import roleEnum from '../enumurator/role.enum.js';
import {canGradeResponses} from '../service/surveyResponse.js';

const router = express.Router();

router.get('/', verifyToken, getAllSurveyResponses);

router.post('/submit', verifyRoleAndMembership, createOrUpdateSurveyResponse);

router.put('/:id', verifyRoleAndMembership, createOrUpdateSurveyResponse);
router.post(
  '/grade',
  verifyRoleAndCondition([roleEnum.ADMIN, roleEnum.TEACHER], canGradeResponses),
  gradeSurveyResponses,
);

export default router;
