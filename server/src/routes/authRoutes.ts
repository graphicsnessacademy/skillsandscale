import express from 'express';
import { loginUser, registerUser, changePassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.put('/change-password', protect, changePassword); // 🔒 Protected

export default router;