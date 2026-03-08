import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId | null;
  course: mongoose.Types.ObjectId;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  courseInfo: { batchNumber: string; };
  paymentInfo: {
    method: string;
    transactionId: string;
    screenshotUrl: string;
    verificationStatus: 'pending' | 'verified' | 'not_verified';
  };
  status: 'pending' | 'ongoing' | 'completed' | 'cancelled';
  receiptSent: boolean;
  receiptSentAt?: Date;
  certification: {
    isCertified: boolean;
    isVerifiable: boolean;
    issueDate: Date | null;
    serialNumber: string;
    qrCodeString: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema: Schema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },

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

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);