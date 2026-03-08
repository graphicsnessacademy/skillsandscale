import { Request, Response } from 'express';
import Service from '../models/Service';
import { triggerNotification } from '../utils/notificationHelper';

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({}).sort({ category: 1 });
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);

    // 🔔 NOTIFICATION
    await triggerNotification(
      'business',
      'New Service Added',
      `"${service.title}" has been added to the services list.`,
      '/admin/services'
    );

    res.status(201).json(service);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // 🔔 NOTIFICATION
    await triggerNotification(
      'business',
      'Service Updated',
      `"${service.title}" service details have been modified.`,
      '/admin/services'
    );

    res.json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const title = service.title;
    await Service.findByIdAndDelete(req.params.id);

    // 🔔 NOTIFICATION
    await triggerNotification(
      'business',
      'Service Deleted',
      `"${title}" has been removed from the services list.`,
      '/admin/services'
    );

    res.json({ message: 'Service removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};