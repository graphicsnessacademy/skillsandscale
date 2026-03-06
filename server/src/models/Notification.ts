// server/src/models/Notification.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    category: 'business' | 'academic' | 'security';
    title: string;
    message: string;
    link: string;
    isRead: boolean;
    forRole: 'all' | 'master-admin'; // security alerts = master-admin only
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        category: {
            type: String,
            enum: ['business', 'academic', 'security'],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String, default: '/admin' },
        isRead: { type: Boolean, default: false },
        forRole: {
            type: String,
            enum: ['all', 'master-admin'],
            default: 'all',
        },
    },
    { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);