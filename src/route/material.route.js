import express from 'express';
import {
  createOrUpdateMaterial,
  deleteMaterial,
  getClassMaterials,
  getOneMaterial,
} from '../controller/material.controller.js';
import {
  verifyAdmin,
  verifyRoleAndClassMembership,
  verifyToken,
} from '../middleware/authorization.js';

const router = express.Router();

router.get('/all/:classId', verifyRoleAndClassMembership, getClassMaterials);
router.get('/:id', verifyRoleAndClassMembership, getOneMaterial);

router.delete('/:id', verifyRoleAndClassMembership, deleteMaterial);

router.post('/:classId', verifyRoleAndClassMembership, createOrUpdateMaterial);

router.put('/:id', verifyRoleAndClassMembership, createOrUpdateMaterial);

export default router;
