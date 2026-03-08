import { Request, Response } from 'express';
import Message from '../models/Message';
import { triggerNotification } from '../utils/notificationHelper';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const newMessage = await Message.create(req.body);

    // 🔔 NOTIFICATION
    await triggerNotification(
      'business',
      'New Message Received',
      `${req.body.name} sent a message: "${req.body.subject || req.body.message?.substring(0, 50)}..."`,
      '/admin/messages'
    );

    res.status(201).json({ success: true, data: newMessage });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    const unreadCount = await Message.countDocuments({ status: 'new' });
    res.json({ data: messages, unread: unreadCount });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message Purged' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};