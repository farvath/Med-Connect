import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getUserById } from '../services/userService';

const router = Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      name: user.name,
      email: user.email,
      specialty: user.specialty,
      institution: user.institution,
      location: user.location,
      accountType: user.accountType,
      profilePic: user.profilePic
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Failed to fetch profile' });
  }
});

export default router;
