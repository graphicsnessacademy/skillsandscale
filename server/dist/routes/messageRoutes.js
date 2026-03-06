"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/send', messageController_1.sendMessage);
router.get('/', authMiddleware_1.protect, authMiddleware_1.admin, messageController_1.getMessages);
router.put('/:id/status', authMiddleware_1.protect, authMiddleware_1.admin, messageController_1.updateMessageStatus);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, messageController_1.deleteMessage);
exports.default = router;
