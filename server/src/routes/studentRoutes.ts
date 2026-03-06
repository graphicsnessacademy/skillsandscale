import express from 'express';
import {
  getAllEnrollments,
  updateVerificationStatus,
  generateReceiptPreview,
  sendReceiptEmail,
  updateStatus,
  issueCertificate,
  updateIssueDate,
  verifyCertificate,
  publicBooking

} from '../controllers/studentController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/verify', verifyCertificate);
router.post('/book-public', publicBooking);

router.get('/enrollments', protect, admin, getAllEnrollments);

router.put('/:enrollmentId/verification-status', protect, admin, updateVerificationStatus);

router.put('/:enrollmentId/receipt-preview', protect, admin, generateReceiptPreview);

router.put('/:enrollmentId/send-receipt', protect, admin, sendReceiptEmail);

router.put('/:enrollmentId/status', protect, admin, updateStatus);

router.put('/:enrollmentId/issue-cert', protect, admin, issueCertificate);

router.put('/:enrollmentId/issue-date', protect, admin, updateIssueDate);

export default router;