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
exports.generateAndSendReceipt = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const cloudinary_1 = require("cloudinary");
// 1. Email Transporter Configuration
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // Or your SMTP provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// 2. Automated Receipt Logic
const generateAndSendReceipt = (enrollment) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default({ margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            const pdfBuffer = Buffer.concat(buffers);
            try {
                // A. Upload PDF to Cloudinary
                const uploadResult = yield new Promise((res, rej) => {
                    const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'receipts', resource_type: 'raw', public_id: `receipt_${enrollment.paymentInfo.transactionId}` }, (error, result) => { if (error)
                        rej(error);
                    else
                        res(result); });
                    stream.end(pdfBuffer);
                });
                // B. Send Email
                yield transporter.sendMail({
                    from: '"SkillsandScale Academy" <noreply@skillsandscale.com>',
                    to: enrollment.personalInfo.email,
                    subject: `Enrollment Confirmed: ${enrollment.course.title}`,
                    html: `
            <h1>Welcome to the Academy!</h1>
            <p>Hi ${enrollment.personalInfo.fullName}, your payment has been verified.</p>
            <p><b>Course:</b> ${enrollment.course.title}</p>
            <p>Please find your official receipt attached.</p>
          `,
                    attachments: [{ filename: 'SkillsandScale_Receipt.pdf', content: pdfBuffer }]
                });
                resolve(uploadResult.secure_url);
            }
            catch (err) {
                reject(err);
            }
        }));
        // --- PDF DESIGN ---
        doc.fillColor('#4B0081').fontSize(25).text('SKILLSANDSCALE ACADEMY', { align: 'center' });
        doc.fontSize(10).fillColor('#000').text('Official Enrollment Receipt', { align: 'center' }).moveDown(2);
        doc.fontSize(12).text(`Receipt No: ${enrollment._id.toString().toUpperCase().slice(-6)}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`).moveDown();
        doc.rect(50, 150, 500, 1).fill('#E5E7EB'); // Line
        doc.moveDown().text(`Student: ${enrollment.personalInfo.fullName}`);
        doc.text(`Email: ${enrollment.personalInfo.email}`);
        doc.text(`Phone: ${enrollment.personalInfo.phone}`).moveDown();
        doc.fillColor('#4F46E5').text(`COURSE: ${enrollment.course.title}`, { underline: true });
        doc.fillColor('#000').text(`Amount Paid: ${enrollment.paymentInfo.amount}`);
        doc.text(`Transaction ID: ${enrollment.paymentInfo.transactionId}`).moveDown(2);
        doc.fontSize(10).font('Helvetica-Oblique').text('Thank you for choosing SkillsandScale. Your creative journey starts here.', { align: 'center' });
        doc.end();
    });
});
exports.generateAndSendReceipt = generateAndSendReceipt;
