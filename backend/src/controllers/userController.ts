import { Request, Response } from 'express';
import User from '../models/User';


const jwtSecret = process.env.JWT_SECRET as string;

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; 


    const user = await User.findById(userId).select("name profilePic specialty");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      name: user.name,
      icon: user.profilePic,
      specialty: user.specialty,
    });
  } catch (err) {
    console.error("getUser error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


