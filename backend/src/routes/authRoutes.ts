import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById } from '../services/userService';
import { connectDB } from '../services/db';

const router = Router();
const jwtSecret = process.env.JWT_SECRET as string;

// Signup
router.post('/signup', async (req, res) => {
  try {
    await connectDB();
    const { name, email, password, specialty, institution, location, accountType, profilePic } = req.body;
    if (!name || !email || !password || !specialty || !institution || !location || !accountType) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await (await import('../models/User')).default.create({
      name, email, password: hashedPassword, specialty, institution, location, accountType, profilePic
    });
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ message: 'Signup successful' });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Signup failed', error: error?.toString?.() || error });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '3h' });
    const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({
      name: user.name,
      profilePic: user.profilePic,
      specialty: user.specialty
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || 'Login failed', error: error?.toString?.() || error });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

export default router;
