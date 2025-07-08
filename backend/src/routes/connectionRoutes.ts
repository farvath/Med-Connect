import { Router } from 'express';
import { 
  getUserConnections, 
  sendConnectionRequest, 
  acceptConnectionRequest, 
  rejectConnectionRequest, 
  getPendingRequests, 
  getMyConnections 
} from '../controllers/connectionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Get all users for connection (with pagination and search)
router.get('/users', authMiddleware, getUserConnections);

// Send connection request
router.post('/send', authMiddleware, sendConnectionRequest);

// Accept connection request
router.put('/accept/:connectionId', authMiddleware, acceptConnectionRequest);

// Reject connection request
router.delete('/reject/:connectionId', authMiddleware, rejectConnectionRequest);

// Get pending connection requests
router.get('/pending', authMiddleware, getPendingRequests);

// Get my connections
router.get('/my-connections', authMiddleware, getMyConnections);

export default router;
