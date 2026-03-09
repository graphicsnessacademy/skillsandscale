import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import nodemailer from 'nodemailer';
import { triggerNotification } from '../utils/notificationHelper';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});


// ── HTML RECEIPT TEMPLATE ──────────────────────────────────────────────────
export const generateReceiptHTML = (enrollment: any): string => {
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
    <h1 style="margin:0; letter-spacing: 2px;">SKILLS AND SCALE</h1>
    <p style="opacity: 0.8;">Official Payment Receipt</p>
  </div>
  <div class="content">
    <div style="text-align: center; margin-bottom: 20px;">
        <div class="status-badge">${isVerified ? 'Verified' : 'Pending Verification'}</div>
    </div>
    <table class="details-table">
      <tr><td class="label">Student Name</td><td class="value">${enrollment.personalInfo.fullName}</td></tr>
      <tr><td class="label">Course Name</td><td class="value">${enrollment.course?.title || 'Course Enrollment'}</td></tr>
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

// ── 1. PUBLIC BOOKING ──────────────────────────────────────────────────────
export const publicBooking = async (req: Request, res: Response) => {
  try {
    const newEnrollment = new Enrollment({ ...req.body, status: 'pending' });
    await newEnrollment.save();

    await triggerNotification(
      'business',
      'New Booking Entry',
      `${req.body.personalInfo.fullName} applied for a course via ${req.body.paymentInfo.method}.`,
      '/admin/students'
    );

    res.status(201).json({ success: true, enrollmentId: newEnrollment._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── 2. VERIFY PAYMENT ──────────────────────────────────────────────────────
export const updateVerificationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    const previousStatus = enrollment.paymentInfo.verificationStatus;
    enrollment.paymentInfo.verificationStatus = status;

    if (previousStatus === 'pending' && status === 'verified') {
      const year = new Date().getFullYear().toString().slice(-2);
      const rand = Math.floor(1000 + Math.random() * 9000);
      const batch = enrollment.courseInfo.batchNumber.substring(0, 2).toUpperCase() || 'SS';

      enrollment.certification.serialNumber = `${batch}${year}${rand}`;
      enrollment.status = 'ongoing';

      await triggerNotification(
        'academic',
        'Enrollment Verified',
        `${enrollment.personalInfo.fullName} is now an active student.`,
        '/admin/students'
      );
    }

    await enrollment.save();
    res.json({ success: true, data: enrollment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── 3. RECEIPT PREVIEW (Restored) ──────────────────────────────────────────
export const generateReceiptPreview = async (req: Request, res: Response) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course', 'title');
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    const receiptHTML = generateReceiptHTML(enrollment);
    res.json({ success: true, receiptHTML });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── 4. SEND RECEIPT EMAIL ──────────────────────────────────────────────────
export const sendReceiptEmail = async (req: Request, res: Response) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course', 'title');
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    if (enrollment.paymentInfo.verificationStatus !== 'verified') {
      return res.status(400).json({ message: 'Cannot send receipt for unverified payment.' });
    }

    const receiptHTML = generateReceiptHTML(enrollment);
    await transporter.sendMail({
      from: `"Skills And Scale" <${process.env.EMAIL_USER}>`,
      to: enrollment.personalInfo.email,
      subject: `Payment Receipt — Skills And Scale`,
      html: receiptHTML,
    });

    enrollment.receiptSent = true;
    enrollment.receiptSentAt = new Date();
    await enrollment.save();

    res.json({ success: true, message: 'Receipt email sent successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Email failed: ' + error.message });
  }
};

// ── 5. UPDATE STATUS & DATE (Restored) ─────────────────────────────────────
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    enrollment.status = status;
    await enrollment.save();

    if (status === 'completed') {
      await triggerNotification(
        'academic',
        'Course Completed',
        `${enrollment.personalInfo.fullName} has finished their curriculum.`,
        '/admin/students'
      );
    }

    res.json({ success: true, status: enrollment.status });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIssueDate = async (req: Request, res: Response) => {
  try {
    const { issueDate } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    enrollment.certification.issueDate = new Date(issueDate);
    await enrollment.save();

    res.json({ success: true, message: 'Certification date updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── 6. ISSUE CERTIFICATE ───────────────────────────────────────────────────
export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    if (enrollment.status !== 'completed') {
      return res.status(400).json({ message: 'Course must be COMPLETED to issue certificate' });
    }

    enrollment.certification.isCertified = true;
    enrollment.certification.isVerifiable = true;
    enrollment.certification.issueDate = enrollment.certification.issueDate || new Date();
    enrollment.certification.qrCodeString = `https://skillsandscale.com/certification?serial=${enrollment.certification.serialNumber}`;

    await enrollment.save();

    await triggerNotification(
      'academic',
      'Certificate Issued',
      `Credential generated for ${enrollment.personalInfo.fullName}.`,
      '/admin/students'
    );

    res.json({ success: true, isCertified: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── 7. DATA RETRIEVAL ──────────────────────────────────────────────────────
export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { serial } = req.query;
    const enrollment = await Enrollment.findOne({
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
        courseName: (enrollment.course as any)?.title,
        serialNumber: enrollment.certification.serialNumber,
        issueDate: enrollment.certification.issueDate,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const data = await Enrollment.find()
      .populate('course', 'title image price')
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEnrollmentById = async (req: Request, res: Response) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate('course');
    if (!enrollment) return res.status(404).json({ message: 'Not found' });
    res.json(enrollment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};