import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getProfile } from '../controllers/institutionsController';

const router = Router();

router.get('/profile', authMiddleware, getProfile);

export default router;
