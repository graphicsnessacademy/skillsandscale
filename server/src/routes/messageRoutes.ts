import express from 'express';
import { sendMessage, getMessages, deleteMessage, updateMessageStatus } from '../controllers/messageController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/send', sendMessage);

router.get('/', protect, admin, getMessages);
router.put('/:id/status', protect, admin, updateMessageStatus);
router.delete('/:id', protect, admin, deleteMessage);

export default router;