import express from 'express';
import { getServices, createService, deleteService } from '../controllers/serviceController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getServices);
router.post('/', protect, admin, createService);
router.delete('/:id', protect, admin, deleteService);

export default router;