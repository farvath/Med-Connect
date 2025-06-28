import { Request, Response } from 'express';
import User from '../models/User';

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await User.findById(userId).select("name profilePic specialty");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        name: user.name,
        icon: user.profilePic,
        specialty: user.specialty,
      },
    });
  } catch (err) {
    console.error("getUser error", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
