"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/verify', studentController_1.verifyCertificate);
router.post('/book-public', studentController_1.publicBooking);
router.get('/enrollments', authMiddleware_1.protect, authMiddleware_1.admin, studentController_1.getAllEnrollments);
router.put('/:enrollmentId/verification-status', authMiddleware_1.protect, authMiddleware_1.admin, studentController_1.updateVerificationStatus);
router.put('/:enrollmentId/receipt-preview', authMiddleware_1.protect, authMiddleware_1.admin, studentController_1.generateReceiptPreview);
router.put('/:enrollmentId/send-receipt', authMiddleware_1.protect, authMiddleware_1.admin, studentController_1.sendReceiptEmail);
router.put('/:enrollmentId/status', authMiddleware_1.protect, authMiddleware_1.admin, studentController_1.updateStatus);
router.put('/:enrollmentId/issue-cert', authMiddleware_1.protect, authMiddleware_1.admin, studentController_1.issueCertificate);
router.put('/:enrollmentId/issue-date', authMiddleware_1.protect, authMiddleware_1.admin, studentController_1.updateIssueDate);
exports.default = router;
