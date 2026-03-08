import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    name: string;
    email: string;
    company?: string;
    message: string;
    status: 'new' | 'read' | 'replied';
}

const MessageSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);