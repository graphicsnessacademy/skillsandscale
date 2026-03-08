import { Request, Response } from 'express';
import SSLCommerzPayment from 'sslcommerz-lts';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import { triggerNotification } from '../utils/notificationHelper';
import dotenv from 'dotenv';

dotenv.config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = false; // Change to true for production

/**
 * @desc    Initialize SSLCommerz Payment
 * @route   POST /api/payment/init
 */
export const initPayment = async (req: Request, res: Response) => {
  try {
    const { courseId, personalInfo, courseInfo } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const tran_id = `TRX${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // 1. Create a "Pending" record in Registry
    await Enrollment.create({
      course: courseId,
      personalInfo,
      courseInfo,
      paymentInfo: {
        method: 'SSLCommerz',
        transactionId: tran_id,
        screenshotUrl: 'https://via.placeholder.com/150?text=Online+Payment',
        verificationStatus: 'pending'
      },
      status: 'pending'
    });

    // 2. Prepare SSLCommerz Data
    const data = {
      total_amount: parseInt(course.price.replace(/[^0-9.]/g, '')),
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `${process.env.SERVER_URL}/api/payment/success/${tran_id}`,
      fail_url: `${process.env.SERVER_URL}/api/payment/fail/${tran_id}`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${tran_id}`,
      ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
      shipping_method: 'No',
      product_name: course.title,
      product_category: 'Education',
      product_profile: 'general',
      cus_name: personalInfo.fullName,
      cus_email: personalInfo.email,
      cus_add1: personalInfo.address,
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: personalInfo.phone,
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse: any) => {
      if (apiResponse.GatewayPageURL) {
        res.send({ url: apiResponse.GatewayPageURL });
      } else {
        res.status(400).json({ message: "SSLCommerz Initialization Failed" });
      }
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Handle Successful Payment
 * @route   POST /api/payment/success/:tranId
 */
export const paymentSuccess = async (req: Request, res: Response) => {
  try {
    const { tranId } = req.params;

    const enrollment = await Enrollment.findOne({ 'paymentInfo.transactionId': tranId });
    if (!enrollment) return res.redirect(`${process.env.CLIENT_URL}/payment/fail`);

    // --- AUTOMATION: APPLY BUSINESS OS RULES ---

    // 1. Payment is automatically VERIFIED
    enrollment.paymentInfo.verificationStatus = 'verified';

    // 2. Receipt is marked as SENT (since gateway handles invoice)
    enrollment.receiptSent = true;
    enrollment.receiptSentAt = new Date();

    // 3. Status is automatically set to ONGOING
    enrollment.status = 'ongoing';

    await enrollment.save();

    // 🔔 TRIGGER NOTIFICATION
    await triggerNotification(
      'business',
      'Online Sale Confirmed',
      `৳${req.body.amount || 'Payment'} received from ${enrollment.personalInfo.fullName} via SSLCommerz.`,
      '/admin/students'
    );

    res.redirect(`${process.env.CLIENT_URL}/payment/success?trx=${tranId}`);

  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
  }
};

/**
 * @desc    Handle Failed Payment
 * @route   POST /api/payment/fail/:tranId
 */
export const paymentFail = async (req: Request, res: Response) => {
  try {
    const { tranId } = req.params;
    const enrollment = await Enrollment.findOne({ 'paymentInfo.transactionId': tranId });

    if (enrollment) {
      // 🔔 TRIGGER NOTIFICATION (Loss Prevention)
      await triggerNotification(
        'business',
        'Payment Failed',
        `Abandoned checkout by ${enrollment.personalInfo.fullName} (TrxID: ${tranId}).`,
        '/admin/students'
      );

      // Optional: Keep record but mark as cancelled
      enrollment.status = 'cancelled';
      await enrollment.save();
    }

    res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
  }
};

/**
 * @desc    Handle Cancelled Payment
 */
export const paymentCancel = async (req: Request, res: Response) => {
  res.redirect(`${process.env.CLIENT_URL}/payment/fail?reason=cancelled`);
};