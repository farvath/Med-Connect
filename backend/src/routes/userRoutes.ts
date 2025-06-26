import { Router } from 'express';
import { getUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
const router = Router();

// Signup
router.get('/getUser', authMiddleware, getUser);


export default router;
