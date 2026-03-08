import express from 'express';
import { getTeam, createMember, updateMember, deleteMember } from '../controllers/teamController';
import { protect, admin } from '../middleware/authMiddleware';
import { upload } from '../config/cloudinary';

const router = express.Router();

router.get('/', getTeam);

router.post('/', protect, admin, createMember);
router.put('/:id', protect, admin, updateMember);
router.delete('/:id', protect, admin, deleteMember);

router.post('/upload', protect, admin, upload.single('image'), (req: any, res: any) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: req.file.path });
});

export default router;