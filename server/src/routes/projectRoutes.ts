import express from 'express';
import { getProjects, updateProjectSlot } from '../controllers/projectController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.get('/', getProjects);

router.post('/', protect, admin, upload.single('image'), updateProjectSlot);

export default router;