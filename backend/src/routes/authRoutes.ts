import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';
import multer from "multer";
const upload = multer(); 

const router = Router();

// Signup
router.post("/signup", upload.single("profilePic"), signup);

// Login
router.post('/login', login);

// Logout
router.post('/logout', logout);

export default router;
