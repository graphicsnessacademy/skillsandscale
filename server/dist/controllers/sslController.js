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
const notificationHelper_1 = require("../utils/notificationHelper");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
const is_live = process.env.NODE_ENV === 'production';
const initPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId, personalInfo, courseInfo } = req.body;
        const course = yield Course_1.default.findById(courseId);
        if (!course)
            return res.status(404).json({ message: "Course not found" });
        const tran_id = `SS${Date.now()}${Math.floor(Math.random() * 1000)}`;
        yield Enrollment_1.default.create({
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
        const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
        sslcz.init(data).then((apiResponse) => {
            if (apiResponse.GatewayPageURL) {
                res.send({ url: apiResponse.GatewayPageURL });
            }
            else {
                res.status(400).json({ message: "Gateway connection failed" });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.initPayment = initPayment;
const paymentSuccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { tranId } = req.params;
        const enrollment = yield Enrollment_1.default.findOne({ 'paymentInfo.transactionId': tranId })
            .populate('course', 'title');
        if (!enrollment)
            return res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
        // 1. Update Enrollment State
        enrollment.paymentInfo.verificationStatus = 'verified';
        enrollment.receiptSent = true;
        enrollment.receiptSentAt = new Date();
        enrollment.status = 'ongoing';
        // 2. Generate Serial Number
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        enrollment.certification.serialNumber = `SS${year}${rand}`;
        yield enrollment.save();
        // 3. Trigger Notification
        yield (0, notificationHelper_1.triggerNotification)('business', 'Online Enrollment Confirmed', `${enrollment.personalInfo.fullName} paid via SSLCommerz for ${(_a = enrollment.course) === null || _a === void 0 ? void 0 : _a.title}`, '/admin/students');
        res.redirect(`${process.env.CLIENT_URL}/payment/success?trx=${tranId}`);
    }
    catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
    }
});
exports.paymentSuccess = paymentSuccess;
const paymentFail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tranId } = req.params;
        const enrollment = yield Enrollment_1.default.findOne({ 'paymentInfo.transactionId': tranId });
        if (enrollment) {
            enrollment.status = 'cancelled';
            yield enrollment.save();
            yield (0, notificationHelper_1.triggerNotification)('business', 'Payment Failed', `Abandoned checkout by ${enrollment.personalInfo.fullName}`, '/admin/students');
        }
        res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
    }
    catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
    }
});
exports.paymentFail = paymentFail;
const paymentCancel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect(`${process.env.CLIENT_URL}/payment/fail?reason=cancelled`);
});
exports.paymentCancel = paymentCancel;
