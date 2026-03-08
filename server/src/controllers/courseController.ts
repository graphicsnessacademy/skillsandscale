import { Request, Response } from 'express';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import { triggerNotification } from '../utils/notificationHelper';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Course image is required' });

    const {
      title, description, duration, category,
      nextBatch, batchName, outline,
      originalPrice, discount, price,
      students, reviews
    } = req.body;

    const parsedOutline = typeof outline === 'string' ? JSON.parse(outline) : outline;

    const course = new Course({
      title, description, duration, category, batchName, nextBatch,
      originalPrice, discount, price,
      students, reviews,
      image: req.file.path,
      outline: parsedOutline
    });

    const createdCourse = await course.save();

    // 🔔 NOTIFICATION
    await triggerNotification(
      'business',
      'New Course Published',
      `"${title}" has been added to the course catalog.`,
      '/admin/courses'
    );

    res.status(201).json(createdCourse);
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create course', error: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      const title = course.title;
      await course.deleteOne();

      // 🔔 NOTIFICATION
      await triggerNotification(
        'business',
        'Course Deleted',
        `"${title}" has been removed from the catalog.`,
        '/admin/courses'
      );

      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const {
      title, description, duration, category,
      nextBatch, batchName, outline,
      originalPrice, discount, price,
      students, reviews
    } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (duration) course.duration = duration;
    if (category) course.category = category;
    if (nextBatch) course.nextBatch = nextBatch;
    if (batchName) course.batchName = batchName;
    if (students) course.students = students;
    if (reviews) course.reviews = reviews;
    if (originalPrice) course.originalPrice = originalPrice;
    if (discount !== undefined) course.discount = discount;
    if (price) course.price = price;
    if (req.file) course.image = req.file.path;
    if (outline) course.outline = typeof outline === 'string' ? JSON.parse(outline) : outline;

    const updatedCourse = await course.save();

    // 🔔 NOTIFICATION
    await triggerNotification(
      'business',
      'Course Updated',
      `"${updatedCourse.title}" course details have been modified.`,
      '/admin/courses'
    );

    res.json(updatedCourse);
  } catch (error: any) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const bookCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Receipt screenshot is required' });
      return;
    }

    const {
      courseId, studentId, fullName, email,
      phone, address, batchNumber,
      transactionId, paymentMethod
    } = req.body;

    const enrollment = new Enrollment({
      student: studentId || null,
      course: courseId,
      personalInfo: { fullName, email, phone, address },
      courseInfo: { batchNumber },
      paymentInfo: {
        method: paymentMethod || 'Bank Transfer',
        transactionId,
        screenshotUrl: req.file.path,
        verificationStatus: 'pending'
      },
      status: 'pending'
    });

    await enrollment.save();
    res.status(201).json({ message: 'Booking submitted successfully!', enrollmentId: enrollment._id });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};