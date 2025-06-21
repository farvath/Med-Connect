import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';

const router = Router();

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

export default router;
