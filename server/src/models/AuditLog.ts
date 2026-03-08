// server/src/models/AuditLog.ts
import mongoose, { Schema, Document } from 'mongoose';

const AuditLogSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  targetId: { type: String, required: true }, // Ensure this is String
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', AuditLogSchema);