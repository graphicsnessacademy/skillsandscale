import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { triggerNotification } from '../utils/notificationHelper';

dotenv.config();

let transporter: any;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
} catch (error: any) {
  console.error('❌ Failed to initialize email transporter:', error.message);
}

export const generateReceiptHTML = (enrollment: any): string => {
  const isVerified = enrollment.paymentInfo.verificationStatus === 'verified';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Payment Receipt - SkillsandScale</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; background: #f8f5f8; }
  .wrapper { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  .header { padding: 24px 32px; border-bottom: 1px solid #f0ebf0; }
  .logo { vertical-align: middle; }
  .logo-icon { width: 32px; height: 32px; color: #80007d; }
  .logo-text { font-size: 18px; font-weight: 700; color: #1e293b; }
  .receipt-no { font-size: 13px; color: #80007d; font-weight: 600; }
  .hero { background: linear-gradient(135deg, #80007d, #4B0081); padding: 40px 32px; text-align: center; }
  .hero-icon { font-size: 48px; color: white; margin-bottom: 12px; }
  .hero h1 { color: white; font-size: 26px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
  .hero p { color: rgba(255,255,255,0.8); margin-top: 6px; font-size: 15px; }
  .status-bar { background: #f8f5f8; padding: 20px 32px; border-bottom: 1px solid #f0ebf0; }
  .status-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 4px; }
  .status-value { font-size: 16px; font-weight: 700; color: ${isVerified ? '#10b981' : '#ef4444'}; }
  .amount-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 4px; text-align: right; }
  .amount-value { font-size: 18px; font-weight: 800; color: #1e293b; font-style: italic; text-align: right; }
  .details { padding: 28px 32px; }
  .details h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
  .details table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .details td { padding: 12px 0; border-bottom: 1px solid #f8f5f8; font-size: 13px; line-height: 1.4; vertical-align: top; }
  .details tr:last-child td { border-bottom: none; }
  .row-label { color: #94a3b8; }
  .row-value { font-weight: 600; color: #1e293b; word-break: break-word; }
  .serial { font-weight: 700; color: #80007d; }
  .mono { font-family: monospace; }
  .footer { background: #f8f5f8; padding: 28px 32px; text-align: center; border-top: 1px solid #f0ebf0; }
  .footer p { color: #64748b; font-size: 13px; line-height: 1.6; margin-bottom: 16px; }
  .footer-links { display: flex; justify-content: center; gap: 20px; margin-bottom: 20px; }
  .footer-links a { color: #80007d; text-decoration: none; font-size: 13px; }
  .footer-meta { color: #94a3b8; font-size: 11px; line-height: 1.8; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="left" valign="middle">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle" style="padding-right: 10px;">
                <svg class="logo-icon" fill="none" viewBox="0 0 48 48"><path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"/></svg>
              </td>
              <td valign="middle">
                <span class="logo-text">SkillsandScale</span>
              </td>
            </tr>
          </table>
        </td>
        ${isVerified ? `<td align="right" valign="middle">
          <span class="receipt-no">Receipt #${enrollment.certification.serialNumber || 'Pending'}</span>
        </td>` : ''}
      </tr>
    </table>
  </div>

  <div class="hero" ${!isVerified ? 'style="background: linear-gradient(135deg, #ef4444, #b91c1c);"' : ''}>
    <div class="hero-icon">${isVerified ? '✓' : '✗'}</div>
    <h1>${isVerified ? 'Payment Receipt' : 'Verification Failed'}</h1>
    <p>${isVerified ? 'Thank you for your enrollment' : 'We could not verify your payment'}</p>
  </div>

  <div class="status-bar">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="left" valign="middle">
          <div class="status-label">Payment Status</div>
          <div class="status-value">${isVerified ? '✓ VERIFIED' : '✗ NOT VERIFIED'}</div>
        </td>
        ${isVerified ? `<td align="right" valign="middle">
          <div class="amount-label">Total Amount Paid</div>
          <div class="amount-value">Paid in Full</div>
        </td>` : ''}
      </tr>
    </table>
  </div>

  <div class="details">
    <h3>Transaction Details</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td class="row-label" width="35%">Student Name</td><td class="row-value" width="65%" align="right">${enrollment.personalInfo.fullName}</td></tr>
      <tr><td class="row-label" width="35%">Email</td><td class="row-value" width="65%" align="right">${enrollment.personalInfo.email}</td></tr>
      <tr><td class="row-label" width="35%">Course</td><td class="row-value" width="65%" align="right">${enrollment.course?.title || 'N/A'}</td></tr>
      <tr><td class="row-label" width="35%">Batch</td><td class="row-value" width="65%" align="right">${enrollment.courseInfo.batchNumber}</td></tr>
      <tr><td class="row-label" width="35%">Transaction ID</td><td class="row-value mono" width="65%" align="right">${enrollment.paymentInfo.transactionId}</td></tr>
      <tr><td class="row-label" width="35%">Payment Method</td><td class="row-value" width="65%" align="right">${enrollment.paymentInfo.method}</td></tr>
      ${isVerified ? `<tr><td class="row-label" width="35%">Serial Number</td><td class="row-value serial" width="65%" align="right">${enrollment.certification.serialNumber || 'Generating...'}</td></tr>` : ''}
    </table>
  </div>

  <div class="footer">
    ${isVerified
      ? '<p>Your payment has been successfully processed.<br/>Welcome to the SkillsandScale community!</p>'
      : '<p style="color: #ef4444; font-weight: 600;">Payment Verification Pending.<br/>Please send a valid transaction ID and a screenshot of your payment to support@skillsandscale.com.</p>'}
    <div class="footer-meta">
      <p>© 2026 SkillsandScale Academy. All rights reserved.</p>
      <p>Dhaka, Bangladesh • support@skillsandscale.com</p>
    </div>
  </div>
</div>
</body>
</html>`;
};

export const updateVerificationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    const previousStatus = enrollment.paymentInfo.verificationStatus;
    enrollment.paymentInfo.verificationStatus = status;

    if (previousStatus === 'pending' && (status === 'verified' || status === 'not_verified')) {
      if (!enrollment.certification.serialNumber || enrollment.certification.serialNumber.includes('TEST')) {
        const batchNo = 'GA';
        const yearFull = '2026';
        const d = new Date(enrollment.createdAt);
        const DD = String(d.getDate()).padStart(2, '0');
        const MM = String(d.getMonth() + 1).padStart(2, '0');
        const YY = String(d.getFullYear()).slice(-2);
        const rand = Math.floor(100 + Math.random() * 900);
        enrollment.certification.serialNumber = `${batchNo}${yearFull}${DD}${MM}${YY}${rand}`;
      }
    }

    await enrollment.save();
    res.json({ success: true, data: enrollment });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateReceiptPreview = async (req: Request, res: Response) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course', 'title');
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    if (enrollment.paymentInfo.verificationStatus === 'pending') {
      return res.status(400).json({ message: 'Payment must be verified first' });
    }

    const receiptHTML = generateReceiptHTML(enrollment);
    res.json({ success: true, receiptHTML });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const sendReceiptEmail = async (req: Request, res: Response) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course', 'title');
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    if (enrollment.paymentInfo.verificationStatus === 'pending') {
      return res.status(400).json({ message: 'Payment must be verified first' });
    }

    const receiptHTML = generateReceiptHTML(enrollment);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: enrollment.personalInfo.email,
      subject: `Payment Receipt — ${(enrollment.course as any)?.title ?? 'Your Course'} | SkillsandScale`,
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

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    if (enrollment.paymentInfo.verificationStatus !== 'verified') {
      return res.status(400).json({ message: 'Action Locked: Payment must be VERIFIED first.' });
    }
    if (!enrollment.receiptSent) {
      return res.status(400).json({ message: 'Action Locked: Receipt Email must be SENT first.' });
    }

    enrollment.status = status;
    await enrollment.save();
    res.json({ success: true, status: enrollment.status });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const issueCertificate = async (req: Request, res: Response) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).json({ message: 'Record not found' });

    if (enrollment.status !== 'completed') {
      return res.status(400).json({ message: 'Course must be completed to issue certificate' });
    }

    enrollment.certification.isCertified = !enrollment.certification.isCertified;
    enrollment.certification.isVerifiable = enrollment.certification.isCertified;

    if (enrollment.certification.isCertified) {
      enrollment.certification.issueDate = enrollment.certification.issueDate || new Date();
      enrollment.certification.qrCodeString = `https://skillsandscale.com/verify/${enrollment.certification.serialNumber}`;
    }

    await enrollment.save();
    res.json({ success: true, isCertified: enrollment.certification.isCertified });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIssueDate = async (req: Request, res: Response) => {
  try {
    const { issueDate } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);
    if (enrollment) {
      enrollment.certification.issueDate = new Date(issueDate);
      await enrollment.save();
      res.json({ success: true });
    }
  } catch (error: any) { res.status(500).json({ message: error.message }); }
};

export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const { serial } = req.query;
    const enrollment = await Enrollment.findOne({ 'certification.serialNumber': serial }).populate('course', 'title');
    if (!enrollment || !enrollment.certification.isCertified) {
      return res.status(404).json({ message: 'Invalid Certificate' });
    }
    const doc: any = enrollment;
    const finalDate = enrollment.certification.issueDate || doc.updatedAt || new Date();
    res.json({
      success: true,
      data: {
        studentName: enrollment.personalInfo.fullName,
        courseName: (enrollment.course as any).title,
        serialNumber: enrollment.certification.serialNumber,
        issueDate: finalDate,
      },
    });
  } catch (error: any) { res.status(500).json({ message: error.message }); }
};

export const publicBooking = async (req: Request, res: Response) => {
  try {
    const newEnrollment = new Enrollment({ ...req.body, status: 'pending' });
    await newEnrollment.save();
    res.status(201).json({ success: true, enrollmentId: newEnrollment._id });
  } catch (error: any) { res.status(500).json({ message: error.message }); }
};

export const getAllEnrollments = async (req: Request, res: Response) => {
  try {
    const data = await Enrollment.find().populate('course', 'title').sort({ createdAt: -1 });
    res.json(data);
  } catch (error: any) { res.status(500).json({ message: error.message }); }
};