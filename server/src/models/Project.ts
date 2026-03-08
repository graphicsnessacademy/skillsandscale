import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  image: string; // Changed from imageUrl to image to match your error
  title: string;
  position: number;
  category: string;
}

const ProjectSchema: Schema = new Schema({
  // This must be named 'image' because your error says "Path 'image' is required"
  image: { type: String, required: true }, 
  title: { type: String, default: "Untitled Project" },
  position: { type: Number, required: true, unique: true },
  // We add a default value for category so it doesn't cause a Validation Error
  category: { type: String, default: "Branding" } 
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);