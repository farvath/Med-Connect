import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../services/userService';
import { connectDB } from '../services/db';

const jwtSecret = process.env.JWT_SECRET as string;

export const signup = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const {
      name,
      email,
      password,
      specialty,
      institution,
      location,
      accountType,
      profilePic,
    } = req.body;

    if (!name || !email || !password || !specialty || !institution || !location || !accountType) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await (await import('../models/User')).default.create({
      name,
      email,
      password: hashedPassword,
      specialty,
      institution,
      location,
      accountType,
      profilePic: profilePic || null, // Accepts empty string or null
    });

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Signup successful" });

  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Signup failed",
      error: error?.toString?.() || error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
        data: null,
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        data: null,
      });
    }

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "3h" });
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        name: user.name,
        icon: user.profilePic,
        specialty: user.specialty,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Login failed",
      data: null,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
};