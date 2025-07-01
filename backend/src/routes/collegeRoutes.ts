import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware';
import { getCollegeList, addCollege } from '../controllers/collegeController';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get('/getCollegeList', getCollegeList);
router.post('/addCollege', authMiddleware, upload.single('image'), addCollege);

export default router;
