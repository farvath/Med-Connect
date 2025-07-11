import { Router } from 'express';
import { getUser, updateUser, getUserById } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from "multer";

const upload = multer();
const router = Router();


// getUser route to fetch user details
router.get('/getUser', authMiddleware, getUser);

// getUserById route to fetch any user's profile by ID (public profile view)
router.get('/:id', getUserById);

router.put('/updateUser', authMiddleware ,upload.single('profilePic'), updateUser);



export default router;

