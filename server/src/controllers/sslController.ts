import { Request, Response } from 'express';
import SSLCommerzPayment from 'sslcommerz-lts';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import { triggerNotification } from '../utils/notificationHelper';
import dotenv from 'dotenv';

dotenv.config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = process.env.NODE_ENV === 'production';

export const initPayment = async (req: Request, res: Response) => {
  try {
    const { courseId, personalInfo, courseInfo } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const tran_id = `SS${Date.now()}${Math.floor(Math.random() * 1000)}`;

    await Enrollment.create({
      course: courseId,
      personalInfo,
      courseInfo,
      paymentInfo: {
        method: 'SSLCommerz',
        transactionId: tran_id,
        screenshotUrl: 'online-payment',
        verificationStatus: 'pending'
      },
      status: 'pending'
    });

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
      cus_add1: personalInfo.address || 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: personalInfo.phone,
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then((apiResponse: any) => {
      if (apiResponse.GatewayPageURL) {
        res.send({ url: apiResponse.GatewayPageURL });
      } else {
        res.status(400).json({ message: "Gateway connection failed" });
      }
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const paymentSuccess = async (req: Request, res: Response) => {
  try {
    const { tranId } = req.params;
    const enrollment = await Enrollment.findOne({ 'paymentInfo.transactionId': tranId })
      .populate('course', 'title');

    if (!enrollment) return res.redirect(`${process.env.CLIENT_URL}/payment/fail`);

    // 1. Update Enrollment State
    enrollment.paymentInfo.verificationStatus = 'verified';
    enrollment.receiptSent = true;
    enrollment.receiptSentAt = new Date();
    enrollment.status = 'ongoing';

    // 2. Generate Serial Number
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    enrollment.certification.serialNumber = `SS${year}${rand}`;

    await enrollment.save();

    // 3. Trigger Notification
    await triggerNotification(
      'business',
      'Online Enrollment Confirmed',
      `${enrollment.personalInfo.fullName} paid via SSLCommerz for ${(enrollment.course as any)?.title}`,
      '/admin/students'
    );

    res.redirect(`${process.env.CLIENT_URL}/payment/success?trx=${tranId}`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
  }
};

export const paymentFail = async (req: Request, res: Response) => {
  try {
    const { tranId } = req.params;
    const enrollment = await Enrollment.findOne({ 'paymentInfo.transactionId': tranId });
    if (enrollment) {
      enrollment.status = 'cancelled';
      await enrollment.save();

      await triggerNotification(
        'business',
        'Payment Failed',
        `Abandoned checkout by ${enrollment.personalInfo.fullName}`,
        '/admin/students'
      );
    }
    res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
  }
};

export const paymentCancel = async (req: Request, res: Response) => {
  res.redirect(`${process.env.CLIENT_URL}/payment/fail?reason=cancelled`);
};