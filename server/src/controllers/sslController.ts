import { Request, Response } from 'express';
import SSLCommerzPayment from 'sslcommerz-lts';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import { generateReceiptHTML } from './studentController';
import { notifyNewEnrollment } from './notificationController';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = process.env.NODE_ENV === 'production';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ── 1. Initialize Payment ─────────────────────────────────────────────────
export const initPayment = async (req: Request, res: Response) => {
  try {
    const { courseId, personalInfo, courseInfo } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const tran_id = `TRX-${Date.now()}`;

    const amount = course.originalPrice && course.originalPrice > 0
      ? course.originalPrice
      : parseInt(course.price.replace(/[^0-9]/g, ''), 10);

    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Invalid course price' });

    await Enrollment.create({
      course: courseId,
      personalInfo,
      courseInfo,
      paymentInfo: {
        method: 'SSLCommerz',
        transactionId: tran_id,
        screenshotUrl: 'online-payment',
        verificationStatus: 'pending',
      },
      status: 'pending',
    });

    const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';

    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id,
      success_url: `${serverUrl}/api/payment/success/${tran_id}`,
      fail_url: `${serverUrl}/api/payment/fail/${tran_id}`,
      cancel_url: `${serverUrl}/api/payment/cancel/${tran_id}`,
      ipn_url: `${serverUrl}/api/payment/ipn`,
      shipping_method: 'Courier',
      product_name: course.title,
      product_category: 'Education',
      product_profile: 'general',
      cus_name: personalInfo.fullName,
      cus_email: personalInfo.email,
      cus_add1: personalInfo.address || 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: personalInfo.phone,
      cus_fax: personalInfo.phone,
      ship_name: personalInfo.fullName,
      ship_add1: personalInfo.address || 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse: any) => {
      const GatewayPageURL = apiResponse.GatewayPageURL;
      if (!GatewayPageURL)
        return res.status(500).json({ message: 'Failed to get payment URL from SSLCommerz' });
      res.json({ url: GatewayPageURL });
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ── 2. Payment Success ────────────────────────────────────────────────────
export const paymentSuccess = async (req: Request, res: Response) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  try {
    const { tranId } = req.params;

    const enrollment = await Enrollment.findOne({ 'paymentInfo.transactionId': tranId })
      .populate<{ course: { title: string } }>('course', 'title');

    if (!enrollment)
      return res.redirect(`${clientUrl}/payment/fail?reason=not_found`);

    // Generate serial number
    const batchNo = 'GA';
    const yearFull = '2026';
    const d = new Date(enrollment.createdAt);
    const DD = String(d.getDate()).padStart(2, '0');
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const YY = String(d.getFullYear()).slice(-2);
    const rand = Math.floor(100 + Math.random() * 900);
    enrollment.certification.serialNumber = `${batchNo}${yearFull}${DD}${MM}${YY}${rand}`;

    enrollment.paymentInfo.verificationStatus = 'verified';
    enrollment.status = 'ongoing';
    enrollment.receiptSent = true;
    enrollment.receiptSentAt = new Date();
    await enrollment.save();

    // Send receipt using same template as studentController
    try {
      const receiptHTML = generateReceiptHTML(enrollment);
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: enrollment.personalInfo.email,
        subject: `Payment Receipt — ${(enrollment.course as any)?.title ?? 'Your Course'} | SkillsandScale`,
        html: receiptHTML,
      });
    } catch (emailErr: any) {
      console.error('❌ Receipt email failed:', emailErr.message);
    }

    // Admin notification
    try {
      await notifyNewEnrollment(
        enrollment.personalInfo.fullName,
        (enrollment.course as any)?.title ?? 'a course'
      );
    } catch (_) { }

    res.redirect(`${clientUrl}/payment/success?trx=${tranId}`);

  } catch (error) {
    res.redirect(`${clientUrl}/payment/fail?reason=server_error`);
  }
};

// ── 3. Payment Fail ───────────────────────────────────────────────────────
export const paymentFail = async (req: Request, res: Response) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  try {
    await Enrollment.findOneAndUpdate(
      { 'paymentInfo.transactionId': req.params.tranId },
      { status: 'cancelled' }
    );
  } catch (_) { }
  res.redirect(`${clientUrl}/payment/fail`);
};

// ── 4. Payment Cancel ─────────────────────────────────────────────────────
export const paymentCancel = async (req: Request, res: Response) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  try {
    await Enrollment.findOneAndUpdate(
      { 'paymentInfo.transactionId': req.params.tranId },
      { status: 'cancelled' }
    );
  } catch (_) { }
  res.redirect(`${clientUrl}/payment/fail?reason=cancelled`);
};