import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getJobs,
  getJobById,
  createJob,
  applyForJob,
  getJobApplications,
  getUserApplications,
  getUserJobs
} from '../controllers/jobController';

const router = Router();

// Public routes
router.get('/', getJobs);

// Protected user-specific routes (must come before /:id route)
router.get('/user/applications', authMiddleware, getUserApplications);
router.get('/user/posted', authMiddleware, getUserJobs);

// Public route with parameter (must come after specific routes)
router.get('/:id', getJobById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createJob);
router.post('/:jobId/apply', authMiddleware, applyForJob);
router.get('/:jobId/applications', authMiddleware, getJobApplications);

export default router;
