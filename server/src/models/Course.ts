import mongoose, { Schema, Document } from 'mongoose';

interface IOutline {
  moduleTitle: string;
  moduleSubtitle: string;
}

export interface ICourse extends mongoose.Document {
  title: string;
  description: string;
  originalPrice: number; // NEW: The price before discount
  discount: number;      // NEW: Percentage (e.g., 30)
  price: string;         // The final string e.g., "$199"
  duration: string;
  category: string;
  image: string;
  batchName: string;
  nextBatch: string;
  students: number;
  reviews: number;
  outline: IOutline[];
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true, default: 0 },
  discount: { type: Number, required: true, default: 0 },
  price: { type: String, required: true }, // Auto-calculated
  duration: { type: String, required: true },
  category: { type: String, default: 'Development' },
  image: { type: String, required: true },
  batchName: { type: String, default: "" },
  nextBatch: { type: String, default: 'Open' },
  students: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  outline: [
    {
      moduleTitle: { type: String, required: true },
      moduleSubtitle: { type: String, default: 'Detailed practical session included.' }
    }
  ],
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema);