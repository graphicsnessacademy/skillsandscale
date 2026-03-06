import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  category: 'Design' | 'Marketing';
  icon: string;
  description: string;
}

const ServiceSchema: Schema = new Schema({
  title: { type: String, required: true },
  // Ensure the enum includes both categories you use
  category: { 
    type: String, 
    required: true, 
    enum: ['Design', 'Marketing'] 
  },
  icon: { type: String, default: 'Layout' }, 
  description: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);