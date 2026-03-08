import { Request, Response } from 'express';
import Project from '../models/Project';
import { triggerNotification } from '../utils/notificationHelper';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ position: 1 });
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProjectSlot = async (req: Request, res: Response) => {
  try {
    const { position, title, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    let project = await Project.findOne({ position: Number(position) });
    let isNew = false;

    if (project) {
      project.image = req.file.path;
      if (title) project.title = title;
      if (category) project.category = category;
      await project.save();
    } else {
      isNew = true;
      project = await Project.create({
        position: Number(position),
        image: req.file.path,
        title: title || `Project ${position}`,
        category: category || 'Branding'
      });
    }

    // 🔔 NOTIFICATION
    await triggerNotification(
      'business',
      isNew ? 'New Project Added' : 'Project Slot Updated',
      isNew
        ? `"${project.title}" has been added to Bento Slot #${position}.`
        : `Bento Slot #${position} — "${project.title}" has been updated.`,
      '/admin/projects'
    );

    res.status(200).json(project);
  } catch (error: any) {
    console.error('Project Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
};