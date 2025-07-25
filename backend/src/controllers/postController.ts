import { Request, Response } from 'express';
import { postService } from '../services/postService';
import { imagekitService } from '../services/imagekitService';
import multer from 'multer';

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed') as any, false);
    }
  }
}).array('media', 10);

export const postController = {
  // Create a new post
  async createPost(req: Request, res: Response) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ 
            success: false, 
            message: err.message 
          });
        }

        const { description } = req.body;
        const userId = (req as any).userId;
        const files = req.files as Express.Multer.File[];

        if (!userId) {
          return res.status(401).json({ 
            success: false, 
            message: 'User not authenticated' 
          });
        }

        if (!description) {
          return res.status(400).json({ 
            success: false, 
            message: 'Description is required' 
          });
        }

        const media = [];

        // Upload files to ImageKit
        if (files && files.length > 0) {
          for (const file of files) {
            try {
              const uploadResult = await imagekitService.upload(
                file.buffer,
                file.originalname,
                '/posts'
              );

              media.push({
                type: file.mimetype.startsWith('image/') ? 'image' : 'video',
                url: uploadResult.url,
                fileId: uploadResult.fileId,
                fileName: uploadResult.name,
                size: file.size
              });
            } catch (uploadError) {
              console.error('Error uploading file:', uploadError);
              // Continue with other files if one fails
            }
          }
        }

        const post = await postService.createPost(userId, description, media);
        
        res.status(201).json({
          success: true,
          message: 'Post created successfully',
          data: post
        });
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get feed posts
  async getFeedPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = (req as any).userId || null;

      const result = await postService.getFeedPosts(userId, page, limit);
      
      res.json({
        success: true,
        data: result.posts,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get a single post
  async getPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const post = await postService.getPostById(postId);

      if (!post) {
        return res.status(404).json({ 
          success: false, 
          message: 'Post not found' 
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Toggle like on a post
  async toggleLike(req: Request, res: Response) {
    try {
      const { entityId, entityType } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
      }

      if (!entityId || !entityType || !['post', 'comment'].includes(entityType)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid request parameters' 
        });
      }

      const result = await postService.toggleLike(userId, entityId, entityType);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Add a comment to a post
  async addComment(req: Request, res: Response) {
    try {
      const { postId, content } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
      }

      if (!postId || !content) {
        return res.status(400).json({ 
          success: false, 
          message: 'Post ID and content are required' 
        });
      }

      const comment = await postService.addComment(userId, postId, content);
      
      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get comments for a post
  async getPostComments(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await postService.getPostComments(postId, page, limit);
      
      res.json({
        success: true,
        data: result.comments,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get user's own posts
  async getUserPosts(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
      }

      const result = await postService.getUserPosts(userId, page, limit);
      
      res.json({
        success: true,
        data: result.posts,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Get user's own comments
  async getUserComments(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
      }

      const result = await postService.getUserComments(userId, page, limit);
      
      res.json({
        success: true,
        data: result.comments,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching user comments:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Update user's own post
  async updatePost(req: Request, res: Response) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ 
            success: false, 
            message: err.message 
          });
        }

        const { postId } = req.params;
        const { description } = req.body;
        const userId = (req as any).userId;
        const files = req.files as Express.Multer.File[];

        if (!userId) {
          return res.status(401).json({ 
            success: false, 
            message: 'User not authenticated' 
          });
        }

        if (!description) {
          return res.status(400).json({ 
            success: false, 
            message: 'Description is required' 
          });
        }

        const media = [];

        // Upload new files to ImageKit if provided
        if (files && files.length > 0) {
          for (const file of files) {
            try {
              const uploadResult = await imagekitService.upload(
                file.buffer,
                file.originalname,
                '/posts'
              );

              media.push({
                type: file.mimetype.startsWith('image/') ? 'image' : 'video',
                url: uploadResult.url,
                fileId: uploadResult.fileId,
                fileName: uploadResult.name,
                size: file.size
              });
            } catch (uploadError) {
              console.error('Error uploading file:', uploadError);
            }
          }
        }

        const updatedPost = await postService.updatePost(postId, userId, description, media);
        
        if (!updatedPost) {
          return res.status(404).json({ 
            success: false, 
            message: 'Post not found or you are not authorized to update it' 
          });
        }

        res.json({
          success: true,
          message: 'Post updated successfully',
          data: updatedPost
        });
      });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Delete user's own post
  async deletePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
      }

      const deleted = await postService.deletePost(postId, userId);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: 'Post not found or you are not authorized to delete it' 
        });
      }

      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Update user's own comment
  async updateComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
      }

      if (!content) {
        return res.status(400).json({ 
          success: false, 
          message: 'Content is required' 
        });
      }

      const updatedComment = await postService.updateComment(commentId, userId, content);
      
      if (!updatedComment) {
        return res.status(404).json({ 
          success: false, 
          message: 'Comment not found or you are not authorized to update it' 
        });
      }

      res.json({
        success: true,
        message: 'Comment updated successfully',
        data: updatedComment
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  },

  // Delete user's own comment
  async deleteComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
      }

      const deleted = await postService.deleteComment(commentId, userId);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: 'Comment not found or you are not authorized to delete it' 
        });
      }

      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
};
