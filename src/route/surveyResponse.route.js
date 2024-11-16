import express from 'express';
import {
  createOrUpdateSurveyResponse,
  getAllSurveyResponses,
} from '../controller/surveyResponse.controller.js';

const router = express.Router();

router.get('/', getAllSurveyResponses);

router.post('/submit', createOrUpdateSurveyResponse);

router.put('/:id', createOrUpdateSurveyResponse);

export default router;
