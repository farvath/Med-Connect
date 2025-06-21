import { Request, Response } from 'express';
import { getUserById } from '../services/userService';

export const getProfile = async (req: Request, res: Response) => {
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
};
