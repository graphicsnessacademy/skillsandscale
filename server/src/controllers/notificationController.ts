import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const role = (req as any).user?.role || 'sub-admin';
    // Master Admin sees all. Sub-admin only sees 'all' category.
    const filter = role === 'master-admin' ? {} : { forRole: 'all' };
    
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ ...filter, isRead: false });
    
    res.status(200).json({ notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// --- TEST FUNCTION: Call this to prove the panel works ---
export const createTestNotification = async (req: Request, res: Response) => {
  try {
    const testNotif = await Notification.create({
      category: 'business',
      title: 'System Test Success',
      message: 'The notification signal is reaching the dashboard perfectly! 🚀',
      link: '/admin',
      forRole: 'all'
    });
    res.status(201).json(testNotif);
  } catch (error: any) {
    res.status(500).json({ message: 'Test failed' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const role = (req as any).user?.role || 'sub-admin';
    const filter = role === 'master-admin' ? {} : { forRole: 'all' };
    await Notification.updateMany({ ...filter, isRead: false }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to mark all as read' });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
};

// --- HELPER FUNCTIONS (Call these from other controllers) ---
export const notifyNewEnrollment = async (studentName: string, courseName: string) => {
  try {
    await Notification.create({
      category: 'business', title: 'New Enrollment',
      message: `${studentName} just enrolled in ${courseName}.`,
      link: '/admin/students', forRole: 'all',
    });
  } catch (err) { console.error('Notification Error:', err); }
};

export const notifyNewInquiry = async (senderName: string, subject: string) => {
  try {
    await Notification.create({
      category: 'business', title: 'New Inquiry',
      message: `Message from ${senderName}: ${subject}`,
      link: '/admin/messages', forRole: 'all',
    });
  } catch (err) { console.error('Notification Error:', err); }
};