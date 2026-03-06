"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settingsController_1 = require("../controllers/settingsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/login-history', authMiddleware_1.protect, settingsController_1.getLoginHistory);
router.put('/password', authMiddleware_1.protect, authMiddleware_1.admin, settingsController_1.updatePassword);
router.get('/staff', authMiddleware_1.protect, authMiddleware_1.masterAdmin, settingsController_1.getStaff);
router.post('/staff', authMiddleware_1.protect, authMiddleware_1.masterAdmin, settingsController_1.createSubAdmin);
router.put('/staff/:id', authMiddleware_1.protect, authMiddleware_1.masterAdmin, settingsController_1.updateStaff);
router.delete('/staff/:id', authMiddleware_1.protect, authMiddleware_1.masterAdmin, settingsController_1.deleteStaff);
exports.default = router;
