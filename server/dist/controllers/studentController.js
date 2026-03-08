"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnrollmentById = exports.getAllEnrollments = exports.verifyCertificate = exports.issueCertificate = exports.updateIssueDate = exports.updateStatus = exports.sendReceiptEmail = exports.generateReceiptPreview = exports.updateVerificationStatus = exports.publicBooking = exports.generateReceiptHTML = void 0;
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const notificationHelper_1 = require("../utils/notificationHelper");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ── PROFESSIONAL SMTP CONFIGURATION (cPanel) ──────────────────────────────
const transporter = nodemailer_1.default.createTransport({
    host: 'mail.skillsandscale.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// ── HTML RECEIPT TEMPLATE ──────────────────────────────────────────────────
const generateReceiptHTML = (enrollment) => {
    var _a;
    const isVerified = enrollment.paymentInfo.verificationStatus === 'verified';
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/><title>Receipt - SkillsandScale</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f7ff; color: #333; }
  .wrapper { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
  .header { background: #6366f1; padding: 30px; text-align: center; color: white; }
  .content { padding: 40px; }
  .status-badge { display: inline-block; padding: 6px 12px; border-radius: 50px; font-size: 12px; font-weight: 800; text-transform: uppercase; background: ${isVerified ? '#dcfce7' : '#fee2e2'}; color: ${isVerified ? '#166534' : '#991b1b'}; }
  .details-table { width: 100%; margin-top: 25px; border-collapse: collapse; }
  .details-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  .label { color: #64748b; font-weight: 600; }
  .value { text-align: right; font-weight: 700; color: #1e293b; }
  .footer { padding: 30px; background: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; }
  .serial { font-family: monospace; color: #6366f1; font-size: 16px; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1 style="margin:0; letter-spacing: 2px;">SKILLSANDSCALE</h1>
    <p style="opacity: 0.8;">Official Payment Receipt</p>
  </div>
  <div class="content">
    <div style="text-align: center; margin-bottom: 20px;">
        <div class="status-badge">${isVerified ? 'Verified' : 'Pending Verification'}</div>
    </div>
    <table class="details-table">
      <tr><td class="label">Student Name</td><td class="value">${enrollment.personalInfo.fullName}</td></tr>
      <tr><td class="label">Course Name</td><td class="value">${((_a = enrollment.course) === null || _a === void 0 ? void 0 : _a.title) || 'Course Enrollment'}</td></tr>
      <tr><td class="label">Transaction ID</td><td class="value">${enrollment.paymentInfo.transactionId}</td></tr>
      <tr><td class="label">Payment Method</td><td class="value">${enrollment.paymentInfo.method}</td></tr>
      ${isVerified ? `<tr><td class="label">Enrollment Serial</td><td class="value serial">${enrollment.certification.serialNumber}</td></tr>` : ''}
    </table>
  </div>
  <div class="footer">
    <p>© 2026 SkillsandScale Academy. All Rights Reserved.</p>
    <p>Dhaka, Bangladesh | support@skillsandscale.com</p>
  </div>
</div>
</body>
</html>`;
};
exports.generateReceiptHTML = generateReceiptHTML;
// ── 1. PUBLIC BOOKING ──────────────────────────────────────────────────────
const publicBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEnrollment = new Enrollment_1.default(Object.assign(Object.assign({}, req.body), { status: 'pending' }));
        yield newEnrollment.save();
        yield (0, notificationHelper_1.triggerNotification)('business', 'New Booking Entry', `${req.body.personalInfo.fullName} applied for a course via ${req.body.paymentInfo.method}.`, '/admin/students');
        res.status(201).json({ success: true, enrollmentId: newEnrollment._id });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.publicBooking = publicBooking;
// ── 2. VERIFY PAYMENT ──────────────────────────────────────────────────────
const updateVerificationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const enrollment = yield Enrollment_1.default.findById(req.params.enrollmentId);
        if (!enrollment)
            return res.status(404).json({ message: 'Record not found' });
        const previousStatus = enrollment.paymentInfo.verificationStatus;
        enrollment.paymentInfo.verificationStatus = status;
        if (previousStatus === 'pending' && status === 'verified') {
            const year = new Date().getFullYear().toString().slice(-2);
            const rand = Math.floor(1000 + Math.random() * 9000);
            const batch = enrollment.courseInfo.batchNumber.substring(0, 2).toUpperCase() || 'SS';
            enrollment.certification.serialNumber = `${batch}${year}${rand}`;
            enrollment.status = 'ongoing';
            yield (0, notificationHelper_1.triggerNotification)('academic', 'Enrollment Verified', `${enrollment.personalInfo.fullName} is now an active student.`, '/admin/students');
        }
        yield enrollment.save();
        res.json({ success: true, data: enrollment });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateVerificationStatus = updateVerificationStatus;
// ── 3. RECEIPT PREVIEW (Restored) ──────────────────────────────────────────
const generateReceiptPreview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollment = yield Enrollment_1.default.findById(req.params.enrollmentId).populate('course', 'title');
        if (!enrollment)
            return res.status(404).json({ message: 'Record not found' });
        const receiptHTML = (0, exports.generateReceiptHTML)(enrollment);
        res.json({ success: true, receiptHTML });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.generateReceiptPreview = generateReceiptPreview;
// ── 4. SEND RECEIPT EMAIL ──────────────────────────────────────────────────
const sendReceiptEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollment = yield Enrollment_1.default.findById(req.params.enrollmentId).populate('course', 'title');
        if (!enrollment)
            return res.status(404).json({ message: 'Record not found' });
        if (enrollment.paymentInfo.verificationStatus !== 'verified') {
            return res.status(400).json({ message: 'Cannot send receipt for unverified payment.' });
        }
        const receiptHTML = (0, exports.generateReceiptHTML)(enrollment);
        yield transporter.sendMail({
            from: `"SkillsandScale Academy" <${process.env.EMAIL_USER}>`,
            to: enrollment.personalInfo.email,
            subject: `Payment Verified — ${enrollment.personalInfo.fullName} | SkillsandScale`,
            html: receiptHTML,
        });
        enrollment.receiptSent = true;
        enrollment.receiptSentAt = new Date();
        yield enrollment.save();
        res.json({ success: true, message: 'Receipt email sent successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Email failed: ' + error.message });
    }
});
exports.sendReceiptEmail = sendReceiptEmail;
// ── 5. UPDATE STATUS & DATE (Restored) ─────────────────────────────────────
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const enrollment = yield Enrollment_1.default.findById(req.params.enrollmentId);
        if (!enrollment)
            return res.status(404).json({ message: 'Record not found' });
        enrollment.status = status;
        yield enrollment.save();
        if (status === 'completed') {
            yield (0, notificationHelper_1.triggerNotification)('academic', 'Course Completed', `${enrollment.personalInfo.fullName} has finished their curriculum.`, '/admin/students');
        }
        res.json({ success: true, status: enrollment.status });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateStatus = updateStatus;
const updateIssueDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { issueDate } = req.body;
        const enrollment = yield Enrollment_1.default.findById(req.params.enrollmentId);
        if (!enrollment)
            return res.status(404).json({ message: 'Record not found' });
        enrollment.certification.issueDate = new Date(issueDate);
        yield enrollment.save();
        res.json({ success: true, message: 'Certification date updated' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateIssueDate = updateIssueDate;
// ── 6. ISSUE CERTIFICATE ───────────────────────────────────────────────────
const issueCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollment = yield Enrollment_1.default.findById(req.params.enrollmentId);
        if (!enrollment)
            return res.status(404).json({ message: 'Record not found' });
        if (enrollment.status !== 'completed') {
            return res.status(400).json({ message: 'Course must be COMPLETED to issue certificate' });
        }
        enrollment.certification.isCertified = true;
        enrollment.certification.isVerifiable = true;
        enrollment.certification.issueDate = enrollment.certification.issueDate || new Date();
        enrollment.certification.qrCodeString = `https://skillsandscale.com/certification?serial=${enrollment.certification.serialNumber}`;
        yield enrollment.save();
        yield (0, notificationHelper_1.triggerNotification)('academic', 'Certificate Issued', `Credential generated for ${enrollment.personalInfo.fullName}.`, '/admin/students');
        res.json({ success: true, isCertified: true });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.issueCertificate = issueCertificate;
// ── 7. DATA RETRIEVAL ──────────────────────────────────────────────────────
const verifyCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { serial } = req.query;
        const enrollment = yield Enrollment_1.default.findOne({
            'certification.serialNumber': serial,
            'certification.isCertified': true
        }).populate('course', 'title');
        if (!enrollment) {
            return res.status(404).json({ message: 'Certificate not found or invalid' });
        }
        res.json({
            success: true,
            data: {
                studentName: enrollment.personalInfo.fullName,
                courseName: (_a = enrollment.course) === null || _a === void 0 ? void 0 : _a.title,
                serialNumber: enrollment.certification.serialNumber,
                issueDate: enrollment.certification.issueDate,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.verifyCertificate = verifyCertificate;
const getAllEnrollments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Enrollment_1.default.find()
            .populate('course', 'title image price')
            .sort({ createdAt: -1 });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllEnrollments = getAllEnrollments;
const getEnrollmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollment = yield Enrollment_1.default.findById(req.params.id).populate('course');
        if (!enrollment)
            return res.status(404).json({ message: 'Not found' });
        res.json(enrollment);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getEnrollmentById = getEnrollmentById;
