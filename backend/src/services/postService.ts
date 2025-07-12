import Post, { IPost } from '../models/Post';
import Comment, { IComment } from '../models/Comment';
import Like, { ILike } from '../models/Like';
import Connection from '../models/Connection';
import { Schema, Types } from 'mongoose';

export const postService = {
  // Create a new post
  async createPost(userId: string, description: string, media: any[]) {
    try {
      const post = new Post({
        userId: new Types.ObjectId(userId),
        description,
        media
      });
      
      await post.save();
      return await this.getPostById(post._id as string);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Get posts for feed with pagination - EXCLUDES USER'S OWN POSTS
  async getFeedPosts(userId: string | null, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      if (userId) {
        // For logged-in users, exclude their own posts
        const posts = await Post.aggregate([
          { $match: { userId: { $ne: new Types.ObjectId(userId) } } }, // Exclude own posts
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $lookup: {
              from: 'likes',
              let: { postId: '$_id' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$entityId', '$$postId'] }, { $eq: ['$entityType', 'post'] }] } } },
                { $count: 'count' }
              ],
              as: 'likesCount'
            }
          },
          {
            $lookup: {
              from: 'comments',
              let: { postId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$postId', '$$postId'] } } },
                { $count: 'count' }
              ],
              as: 'commentsCount'
            }
          },
          {
            $lookup: {
              from: 'likes',
              let: { postId: '$_id' },
              pipeline: [
                { 
                  $match: { 
                    $expr: { 
                      $and: [
                        { $eq: ['$entityId', '$$postId'] }, 
                        { $eq: ['$entityType', 'post'] },
                        { $eq: ['$userId', new Types.ObjectId(userId)] }
                      ] 
                    } 
                  } 
                }
              ],
              as: 'isLiked'
            }
          },
          {
            $addFields: {
              likesCount: { $arrayElemAt: ['$likesCount.count', 0] },
              commentsCount: { $arrayElemAt: ['$commentsCount.count', 0] },
              isLiked: { $gt: [{ $size: '$isLiked' }, 0] }
            }
          },
          {
            $project: {
              _id: 1,
              userId: 1,
              description: 1,
              media: 1,
              createdAt: 1,
              updatedAt: 1,
              'user.name': 1,
              'user.specialty': 1,
              'user.institution': 1,
              'user.profilePic': 1,
              likesCount: { $ifNull: ['$likesCount', 0] },
              commentsCount: { $ifNull: ['$commentsCount', 0] },
              isLiked: 1
            }
          }
        ]);

        return {
          posts,
          pagination: {
            page,
            limit,
            hasMore: posts.length === limit
          }
        };

      } else {
        // For non-logged-in users, show all posts
        const posts = await Post.aggregate([
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          },
          { $unwind: '$user' },
          {
            $lookup: {
              from: 'likes',
              let: { postId: '$_id' },
              pipeline: [
                { $match: { $expr: { $and: [{ $eq: ['$entityId', '$$postId'] }, { $eq: ['$entityType', 'post'] }] } } },
                { $count: 'count' }
              ],
              as: 'likesCount'
            }
          },
          {
            $lookup: {
              from: 'comments',
              let: { postId: '$_id' },
              pipeline: [
                { $match: { $expr: { $eq: ['$postId', '$$postId'] } } },
                { $count: 'count' }
              ],
              as: 'commentsCount'
            }
          },
          {
            $addFields: {
              likesCount: { $arrayElemAt: ['$likesCount.count', 0] },
              commentsCount: { $arrayElemAt: ['$commentsCount.count', 0] },
              isLiked: false
            }
          },
          {
            $project: {
              _id: 1,
              userId: 1,
              description: 1,
              media: 1,
              createdAt: 1,
              updatedAt: 1,
              'user.name': 1,
              'user.specialty': 1,
              'user.institution': 1,
              'user.profilePic': 1,
              likesCount: { $ifNull: ['$likesCount', 0] },
              commentsCount: { $ifNull: ['$commentsCount', 0] },
              isLiked: 1
            }
          }
        ]);

        return {
          posts,
          pagination: {
            page,
            limit,
            hasMore: posts.length === limit
          }
        };
      }
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw error;
    }
  },

  // Get a single post by ID
  async getPostById(postId: string) {
    try {
      const post = await Post.findById(postId).populate('userId', 'name specialty institution profilePic');
      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  },

  // Toggle like on a post
  async toggleLike(userId: string, entityId: string, entityType: 'post' | 'comment') {
    try {
      const existingLike = await Like.findOne({
        userId: new Types.ObjectId(userId),
        entityId: new Types.ObjectId(entityId),
        entityType
      });

      if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return { liked: false, message: 'Like removed' };
      } else {
        const like = new Like({
          userId: new Types.ObjectId(userId),
          entityId: new Types.ObjectId(entityId),
          entityType
        });
        await like.save();
        return { liked: true, message: 'Like added' };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Add a comment to a post
  async addComment(userId: string, postId: string, content: string) {
    try {
      const comment = new Comment({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
        content
      });
      
      await comment.save();
      const populatedComment = await Comment.findById(comment._id).populate('userId', 'name specialty institution profilePic');
      
      // Transform the result to match our expected structure
      if (populatedComment) {
        return {
          _id: populatedComment._id,
          userId: populatedComment.userId,
          postId: populatedComment.postId,
          content: populatedComment.content,
          createdAt: populatedComment.createdAt,
          user: {
            name: (populatedComment.userId as any).name || 'Unknown User',
            specialty: (populatedComment.userId as any).specialty || 'Unknown',
            institution: (populatedComment.userId as any).institution || 'Unknown',
            profilePic: (populatedComment.userId as any).profilePic || null
          }
        };
      }
      
      return populatedComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Get comments for a post with pagination
  async getPostComments(postId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const comments = await Comment.aggregate([
        { $match: { postId: new Types.ObjectId(postId) } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'likes',
            let: { commentId: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$entityId', '$$commentId'] }, { $eq: ['$entityType', 'comment'] }] } } },
              { $count: 'count' }
            ],
            as: 'likesCount'
          }
        },
        {
          $addFields: {
            likesCount: { $arrayElemAt: ['$likesCount.count', 0] }
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            postId: 1,
            content: 1,
            createdAt: 1,
            'user.name': 1,
            'user.specialty': 1,
            'user.profilePic': 1,
            likesCount: { $ifNull: ['$likesCount', 0] }
          }
        }
      ]);

      return {
        comments,
        pagination: {
          page,
          limit,
          hasMore: comments.length === limit
        }
      };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Get user's own posts with pagination
  async getUserPosts(userId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const posts = await Post.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'likes',
            let: { postId: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$entityId', '$$postId'] }, { $eq: ['$entityType', 'post'] }] } } },
              { $count: 'count' }
            ],
            as: 'likesCount'
          }
        },
        {
          $lookup: {
            from: 'comments',
            let: { postId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$postId', '$$postId'] } } },
              { $count: 'count' }
            ],
            as: 'commentsCount'
          }
        },
        {
          $addFields: {
            likesCount: { $arrayElemAt: ['$likesCount.count', 0] },
            commentsCount: { $arrayElemAt: ['$commentsCount.count', 0] },
            isLiked: false // Since it's their own post, they wouldn't like it
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            description: 1,
            media: 1,
            createdAt: 1,
            updatedAt: 1,
            'user.name': 1,
            'user.specialty': 1,
            'user.institution': 1,
            'user.profilePic': 1,
            likesCount: { $ifNull: ['$likesCount', 0] },
            commentsCount: { $ifNull: ['$commentsCount', 0] },
            isLiked: 1
          }
        }
      ]);

      return {
        posts,
        pagination: {
          page,
          limit,
          hasMore: posts.length === limit
        }
      };
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  },

  // Get user's own comments with pagination
  async getUserComments(userId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const comments = await Comment.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'posts',
            localField: 'postId',
            foreignField: '_id',
            as: 'post'
          }
        },
        { $unwind: '$post' },
        {
          $lookup: {
            from: 'likes',
            let: { commentId: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$entityId', '$$commentId'] }, { $eq: ['$entityType', 'comment'] }] } } },
              { $count: 'count' }
            ],
            as: 'likesCount'
          }
        },
        {
          $addFields: {
            likesCount: { $arrayElemAt: ['$likesCount.count', 0] }
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            postId: 1,
            content: 1,
            createdAt: 1,
            'user.name': 1,
            'user.specialty': 1,
            'user.profilePic': 1,
            'post.description': 1,
            likesCount: { $ifNull: ['$likesCount', 0] }
          }
        }
      ]);

      return {
        comments,
        pagination: {
          page,
          limit,
          hasMore: comments.length === limit
        }
      };
    } catch (error) {
      console.error('Error fetching user comments:', error);
      throw error;
    }
  },

  // Update user's own post
  async updatePost(postId: string, userId: string, description: string, media?: any[]) {
    try {
      const post = await Post.findOne({ _id: postId, userId: new Types.ObjectId(userId) });
      
      if (!post) {
        return null; // Post not found or user not authorized
      }

      const updateData: any = { description };
      
      // If new media is provided, replace the existing media
      if (media && media.length > 0) {
        updateData.media = media;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId, 
        updateData, 
        { new: true }
      ).populate('userId', 'name specialty institution profilePic');

      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete user's own post
  async deletePost(postId: string, userId: string) {
    try {
      const post = await Post.findOne({ _id: postId, userId: new Types.ObjectId(userId) });
      
      if (!post) {
        return false; // Post not found or user not authorized
      }

      // Delete associated comments and likes
      await Comment.deleteMany({ postId: new Types.ObjectId(postId) });
      await Like.deleteMany({ entityId: new Types.ObjectId(postId), entityType: 'post' });
      
      // Delete the post
      await Post.findByIdAndDelete(postId);
      
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Update user's own comment
  async updateComment(commentId: string, userId: string, content: string) {
    try {
      const comment = await Comment.findOne({ _id: commentId, userId: new Types.ObjectId(userId) });
      
      if (!comment) {
        return null; // Comment not found or user not authorized
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId, 
        { content }, 
        { new: true }
      ).populate('userId', 'name specialty institution profilePic');

      return updatedComment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  // Delete user's own comment
  async deleteComment(commentId: string, userId: string) {
    try {
      const comment = await Comment.findOne({ _id: commentId, userId: new Types.ObjectId(userId) });
      
      if (!comment) {
        return false; // Comment not found or user not authorized
      }

      // Delete associated likes
      await Like.deleteMany({ entityId: new Types.ObjectId(commentId), entityType: 'comment' });
      
      // Delete the comment
      await Comment.findByIdAndDelete(commentId);
      
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};