import express from 'express';
import {
    getStaff,
    createSubAdmin,
    deleteStaff,
    updatePassword,
    updateStaff,
    getLoginHistory
} from '../controllers/settingsController';
import { protect, admin, masterAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/login-history', protect, getLoginHistory);

router.put('/password', protect, admin, updatePassword);

router.get('/staff', protect, masterAdmin, getStaff);
router.post('/staff', protect, masterAdmin, createSubAdmin);
router.put('/staff/:id', protect, masterAdmin, updateStaff);
router.delete('/staff/:id', protect, masterAdmin, deleteStaff);


export default router;