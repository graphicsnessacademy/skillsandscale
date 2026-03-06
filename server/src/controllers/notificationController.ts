import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const role = (req as any).user?.role ?? 'sub-admin';
    const filter = role === 'master-admin' ? {} : { forRole: 'all' };
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ ...filter, isRead: false });
    res.status(200).json({ notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark as read', error: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const role = (req as any).user?.role ?? 'sub-admin';
    const filter = role === 'master-admin' ? {} : { forRole: 'all' };
    await Notification.updateMany({ ...filter, isRead: false }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark all as read', error: error.message });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};

export const notifyNewEnrollment = async (studentName: string, courseName: string) => {
  await Notification.create({
    category: 'business', title: 'New Enrollment',
    message: `New Student: ${studentName} enrolled in ${courseName}.`,
    link: '/admin/students', forRole: 'all',
  });
};

export const notifyNewInquiry = async (senderName: string, subject: string) => {
  await Notification.create({
    category: 'business', title: 'New Inquiry',
    message: `New message from ${senderName} regarding ${subject}.`,
    link: '/admin/messages', forRole: 'all',
  });
};

export const notifyCertificateGenerated = async (studentName: string, batchName: string) => {
  await Notification.create({
    category: 'academic', title: 'Certificate Generated',
    message: `Certificate generated for ${studentName} (${batchName}).`,
    link: '/admin/students', forRole: 'all',
  });
};

export const notifyLowSeats = async (courseName: string, remainingSeats: number) => {
  await Notification.create({
    category: 'academic', title: 'Low Seat Alert',
    message: `Only ${remainingSeats} seat(s) left in ${courseName}.`,
    link: '/admin/courses', forRole: 'all',
  });
};

export const notifyNewAdminAdded = async (adminName: string) => {
  await Notification.create({
    category: 'security', title: 'New Admin Added',
    message: `Sub-admin account created for ${adminName}.`,
    link: '/admin/settings', forRole: 'master-admin',
  });
};

export const notifyFailedLogins = async (email: string, attempts: number) => {
  await Notification.create({
    category: 'security', title: 'Failed Login Attempts',
    message: `${attempts} failed login attempts detected for ${email}.`,
    link: '/admin/settings', forRole: 'master-admin',
  });
};