"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EnrollmentSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    personalInfo: {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            // Matches standard email formats name@domain.com
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true
        }
    },
    courseInfo: {
        batchNumber: { type: String, required: true }
    },
    paymentInfo: {
        method: { type: String, default: 'Bkash' },
        transactionId: {
            type: String,
            required: [true, 'Transaction ID is required'],
            unique: true // Prevents duplicate use of the same TrxID
        },
        screenshotUrl: { type: String, required: true },
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'not_verified'],
            default: 'pending'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    receiptSent: { type: Boolean, default: false },
    receiptSentAt: { type: Date, default: null },
    certification: {
        isCertified: { type: Boolean, default: false },
        isVerifiable: { type: Boolean, default: false },
        issueDate: { type: Date, default: null },
        serialNumber: { type: String, default: '' },
        qrCodeString: { type: String, default: '' }
    }
}, { timestamps: true });
EnrollmentSchema.index({ 'personalInfo.email': 1, 'paymentInfo.transactionId': 1 });
exports.default = mongoose_1.default.model('Enrollment', EnrollmentSchema);
