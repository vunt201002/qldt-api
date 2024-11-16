import express from 'express';
import {
  createOrUpdateMaterial,
  deleteMaterial,
  getClassMaterials,
  getOneMaterial,
} from '../controller/material.controller.js';

const router = express.Router();

router.get('/all/:classId', getClassMaterials);
router.get('/:id', getOneMaterial);

router.delete('/:id', deleteMaterial);

router.post('/:classId', createOrUpdateMaterial);

export default router;
