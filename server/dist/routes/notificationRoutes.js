"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public test
router.get('/test-trigger', notificationController_1.createTestNotification);
// Protected Admin Routes - Changed PATCH to PUT to match Frontend
router.get('/', authMiddleware_1.protect, authMiddleware_1.admin, notificationController_1.getNotifications);
router.put('/read-all', authMiddleware_1.protect, authMiddleware_1.admin, notificationController_1.markAllAsRead);
router.put('/:id/read', authMiddleware_1.protect, authMiddleware_1.admin, notificationController_1.markAsRead);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, notificationController_1.deleteNotification);
exports.default = router;
