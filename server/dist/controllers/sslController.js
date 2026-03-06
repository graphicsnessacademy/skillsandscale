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
exports.paymentCancel = exports.paymentFail = exports.paymentSuccess = exports.initPayment = void 0;
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const Course_1 = __importDefault(require("../models/Course"));
const studentController_1 = require("./studentController");
const notificationController_1 = require("./notificationController");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = process.env.NODE_ENV === 'production';
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
// ── 1. Initialize Payment ─────────────────────────────────────────────────
const initPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, personalInfo, courseInfo } = req.body;
        const course = yield Course_1.default.findById(courseId);
        if (!course)
            return res.status(404).json({ message: 'Course not found' });
        const tran_id = `TRX-${Date.now()}`;
        const amount = course.originalPrice && course.originalPrice > 0
            ? course.originalPrice
            : parseInt(course.price.replace(/[^0-9]/g, ''), 10);
        if (!amount || amount <= 0)
            return res.status(400).json({ message: 'Invalid course price' });
        yield Enrollment_1.default.create({
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
        const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
        sslcz.init(data).then((apiResponse) => {
            const GatewayPageURL = apiResponse.GatewayPageURL;
            if (!GatewayPageURL)
                return res.status(500).json({ message: 'Failed to get payment URL from SSLCommerz' });
            res.json({ url: GatewayPageURL });
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.initPayment = initPayment;
// ── 2. Payment Success ────────────────────────────────────────────────────
const paymentSuccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    try {
        const { tranId } = req.params;
        const enrollment = yield Enrollment_1.default.findOne({ 'paymentInfo.transactionId': tranId })
            .populate('course', 'title');
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
        yield enrollment.save();
        // Send receipt using same template as studentController
        try {
            const receiptHTML = (0, studentController_1.generateReceiptHTML)(enrollment);
            yield transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: enrollment.personalInfo.email,
                subject: `Payment Receipt — ${(_b = (_a = enrollment.course) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : 'Your Course'} | SkillsandScale`,
                html: receiptHTML,
            });
        }
        catch (emailErr) {
            console.error('❌ Receipt email failed:', emailErr.message);
        }
        // Admin notification
        try {
            yield (0, notificationController_1.notifyNewEnrollment)(enrollment.personalInfo.fullName, (_d = (_c = enrollment.course) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : 'a course');
        }
        catch (_) { }
        res.redirect(`${clientUrl}/payment/success?trx=${tranId}`);
    }
    catch (error) {
        res.redirect(`${clientUrl}/payment/fail?reason=server_error`);
    }
});
exports.paymentSuccess = paymentSuccess;
// ── 3. Payment Fail ───────────────────────────────────────────────────────
const paymentFail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    try {
        yield Enrollment_1.default.findOneAndUpdate({ 'paymentInfo.transactionId': req.params.tranId }, { status: 'cancelled' });
    }
    catch (_) { }
    res.redirect(`${clientUrl}/payment/fail`);
});
exports.paymentFail = paymentFail;
// ── 4. Payment Cancel ─────────────────────────────────────────────────────
const paymentCancel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    try {
        yield Enrollment_1.default.findOneAndUpdate({ 'paymentInfo.transactionId': req.params.tranId }, { status: 'cancelled' });
    }
    catch (_) { }
    res.redirect(`${clientUrl}/payment/fail?reason=cancelled`);
});
exports.paymentCancel = paymentCancel;
