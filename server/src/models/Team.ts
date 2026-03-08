import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ITeam>('Team', TeamSchema);