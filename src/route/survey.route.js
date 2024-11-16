import express from 'express';
import {createOrUpdateSurvey, deleteSurvey} from '../controller/survey.controller.js';

const router = express.Router();

router.post('/', createOrUpdateSurvey);

router.put('/:id', createOrUpdateSurvey);

router.delete('/:id', deleteSurvey);

export default router;
