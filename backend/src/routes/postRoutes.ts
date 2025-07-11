import { Router } from 'express';
import { postController } from '../controllers/postController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Create a new post (requires authentication)
router.post('/create', authMiddleware, postController.createPost);

// Get feed posts (optional authentication)
router.get('/feed', optionalAuthMiddleware, postController.getFeedPosts);

// Get user's own posts (requires authentication) - Must come before /:postId
router.get('/user/posts', authMiddleware, postController.getUserPosts);

// Get user's own comments (requires authentication)
router.get('/user/comments', authMiddleware, postController.getUserComments);

// Toggle like on post/comment (requires authentication)
router.post('/like', authMiddleware, postController.toggleLike);

// Add comment to post (requires authentication)
router.post('/comment', authMiddleware, postController.addComment);

// Update user's own comment (requires authentication)
router.put('/comment/:commentId', authMiddleware, postController.updateComment);

// Delete user's own comment (requires authentication)
router.delete('/comment/:commentId', authMiddleware, postController.deleteComment);

// Get a single post (no authentication required)
router.get('/:postId', postController.getPost);

// Get comments for a post (no authentication required)
router.get('/:postId/comments', postController.getPostComments);

// Update user's own post (requires authentication)
router.put('/:postId', authMiddleware, postController.updatePost);

// Delete user's own post (requires authentication)
router.delete('/:postId', authMiddleware, postController.deletePost);

export default router;
