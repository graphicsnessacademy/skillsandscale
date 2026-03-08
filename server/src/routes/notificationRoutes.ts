import { Router } from 'express';
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createTestNotification
} from '../controllers/notificationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// Public test
router.get('/test-trigger', createTestNotification);

// Protected Admin Routes - Changed PATCH to PUT to match Frontend
router.get('/', protect, admin, getNotifications);
router.put('/read-all', protect, admin, markAllAsRead);
router.put('/:id/read', protect, admin, markAsRead);
router.delete('/:id', protect, admin, deleteNotification);

export default router;