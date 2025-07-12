import { Router } from 'express';
import { postController } from '../controllers/postController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Create a new post (requires authentication)
router.post('/create', authMiddleware, postController.createPost);

// Get feed posts (optional authentication)
router.get('/feed', optionalAuthMiddleware, postController.getFeedPosts);

// Get a single post (no authentication required)
router.get('/:postId', postController.getPost);

// Toggle like on post/comment (requires authentication)
router.post('/like', authMiddleware, postController.toggleLike);

// Add comment to post (requires authentication)
router.post('/comment', authMiddleware, postController.addComment);

// Get comments for a post (no authentication required)
router.get('/:postId/comments', postController.getPostComments);

export default router;
