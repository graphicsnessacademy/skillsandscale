import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  updateCourse,
  bookCourse
} from '../controllers/courseController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/book', upload.single('receipt'), bookCourse);

router.post('/', protect, admin, upload.single('image'), createCourse);
router.put('/:id', protect, admin, upload.single('image'), updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

export default router;