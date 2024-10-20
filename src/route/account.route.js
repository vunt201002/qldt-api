import express from 'express';
import {getAllAccounts, setAccountInfo} from '../controller/account.controller.js';
import {verifyAccessApi, verifyAdmin} from '../middleware/authorization.js';

const router = express.Router();

router.get('/', verifyAdmin, getAllAccounts);
router.put('/:id', verifyAccessApi, setAccountInfo);
router.put('/role/:id', setAccountInfo);
router.put('/deactivated/:id', setAccountInfo);
router.put('/reactivated/:id', setAccountInfo);

export default router;
