import { Request, Response } from 'express';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 }); // Newest first
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

    // Destructure new fields
    const {
      title, description, duration, category,
      nextBatch, batchName, outline,
      originalPrice, discount, price, // Pricing fields
      students, reviews
    } = req.body;

    const parsedOutline = typeof outline === 'string' ? JSON.parse(outline) : outline;

    const course = new Course({
      title, description, duration, category, batchName, nextBatch,
      originalPrice, discount, price, // Save pricing logic
      students, reviews,
      image: req.file.path,
      outline: parsedOutline
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error: any) {
    res.status(400).json({ message: 'Failed to create course', error: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      await course.deleteOne();
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

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (duration) course.duration = duration;
    if (category) course.category = category;
    if (nextBatch) course.nextBatch = nextBatch;
    if (batchName) course.batchName = batchName;
    if (students) course.students = students;
    if (reviews) course.reviews = reviews;

    // Update Pricing
    if (originalPrice) course.originalPrice = originalPrice;
    if (discount !== undefined) course.discount = discount;
    if (price) course.price = price;

    if (req.file) course.image = req.file.path;
    if (outline) course.outline = typeof outline === 'string' ? JSON.parse(outline) : outline;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error: any) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const bookCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Check if file exists
    if (!req.file) {
      res.status(400).json({ message: 'Receipt screenshot is required' });
      return;
    }

    // 2. Extract Text Data (FormData sends everything as strings)
    const {
      courseId,
      studentId, // Optional: if user is logged in
      fullName,
      email,
      phone,
      address,
      batchNumber,
      transactionId,
      paymentMethod
    } = req.body;

    // 3. Create Enrollment Object
    const enrollment = new Enrollment({
      student: studentId || null, // Link to user if available
      course: courseId,
      personalInfo: {
        fullName,
        email,
        phone,
        address
      },
      courseInfo: {
        batchNumber
      },
      paymentInfo: {
        method: paymentMethod || 'Bank Transfer',
        transactionId,
        screenshotUrl: req.file.path, // Cloudinary URL
        verificationStatus: 'pending'
      },
      status: 'pending'
    });

    // 4. Save to DB
    await enrollment.save();

    res.status(201).json({ message: 'Booking submitted successfully!', enrollmentId: enrollment._id });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};