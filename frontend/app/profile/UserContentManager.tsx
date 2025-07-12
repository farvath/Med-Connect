'use client';

import React, { useState, useEffect } from 'react';
import { IPost, IComment } from '@/types/posts';
import { getUserPosts, getUserComments, deletePost, deleteComment, updatePost, updateComment } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Heart, MessageCircle, Calendar, FileText, Camera } from 'lucide-react';

interface UserContentManagerProps {
  userId: string;
}

export const UserContentManager: React.FC<UserContentManagerProps> = ({ userId }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [posts, setPosts] = useState<IPost[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Edit states
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Delete confirmation states
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserContent();
  }, [activeTab]);

  const fetchUserContent = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      if (activeTab === 'posts') {
        const response = await getUserPosts(1, 20);
        setPosts(response.data || []);
      } else {
        const response = await getUserComments(1, 20);
        setComments(response.data || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch content');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
      setDeletingPostId(null);
      setSuccessMessage('Post deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
      setDeletingCommentId(null);
      setSuccessMessage('Comment deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleEditPost = async (postId: string) => {
    try {
      setIsEditing(true);
      const formData = new FormData();
      formData.append('description', editContent);
      
      // Add new files if any
      editFiles.forEach(file => {
        formData.append('media', file);
      });

      await updatePost(postId, formData);
      
      // Refresh posts
      await fetchUserContent();
      
      setEditingPostId(null);
      setEditContent('');
      setEditFiles([]);
      setSuccessMessage('Post updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsEditing(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    try {
      setIsEditing(true);
      await updateComment(commentId, editContent);
      
      // Refresh comments
      await fetchUserContent();
      
      setEditingCommentId(null);
      setEditContent('');
      setSuccessMessage('Comment updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update comment');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsEditing(false);
    }
  };

  const startEditPost = (post: IPost) => {
    setEditingPostId(post._id);
    setEditContent(post.description);
    setEditFiles([]);
    setError(null);
    setSuccessMessage(null);
  };

  const startEditComment = (comment: IComment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    setError(null);
    setSuccessMessage(null);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditingCommentId(null);
    setEditContent('');
    setEditFiles([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    // For mobile, show more compact format
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // Less than a week
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      // For older content, show date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 md:p-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm md:text-base text-gray-600">Loading your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">My Content</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'posts'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">My Posts</span>
            <span className="sm:hidden">Posts</span>
            <Badge variant="secondary" className="ml-1">
              {posts.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === 'comments'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">My Comments</span>
            <span className="sm:hidden">Comments</span>
            <Badge variant="secondary" className="ml-1">
              {comments.length}
            </Badge>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm md:text-base">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 md:p-4 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm md:text-base">
          {successMessage}
        </div>
      )}

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4 md:space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <FileText className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm md:text-base font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-xs md:text-sm text-gray-500 px-4">Start sharing your thoughts with the community!</p>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post._id} className="shadow-sm">
                <CardHeader className="pb-3 px-4 md:px-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                      <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                        <AvatarImage src={post.user.profilePic?.url} />
                        <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm md:text-base truncate">{post.user.name}</p>
                        <p className="text-xs md:text-sm text-gray-500 truncate">{post.user.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditPost(post)}
                        className="h-7 px-2 md:h-8 md:px-3"
                      >
                        <Edit className="h-3 w-3 md:h-4 md:w-4 sm:mr-1" />
                        <span className="hidden sm:inline text-xs md:text-sm">Edit</span>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 md:h-8 md:px-3 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4 sm:mr-1" />
                            <span className="hidden sm:inline text-xs md:text-sm">Delete</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Post</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this post? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeletePost(post._id)}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3 px-4 md:px-6">
                  {editingPostId === post._id ? (
                    <div className="space-y-3 md:space-y-4">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="min-h-[80px] md:min-h-[100px] text-sm md:text-base"
                      />
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                          Add new media (optional)
                        </label>
                        <Input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) => setEditFiles(Array.from(e.target.files || []))}
                          className="text-xs md:text-sm file:mr-2 md:file:mr-4 file:py-1 md:file:py-2 file:px-2 md:file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={cancelEdit} size="sm">
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleEditPost(post._id)}
                          disabled={isEditing}
                          size="sm"
                        >
                          {isEditing ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800 mb-3 md:mb-4 text-sm md:text-base leading-relaxed">{post.description}</p>
                      
                      {/* Media Display */}
                      {post.media && post.media.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                          {post.media.map((media, index) => (
                            <div key={index} className="rounded-lg overflow-hidden">
                              {media.type === 'image' ? (
                                <img
                                  src={media.url}
                                  alt={media.fileName}
                                  className="w-full h-32 sm:h-40 md:h-48 object-cover"
                                />
                              ) : (
                                <video
                                  src={media.url}
                                  controls
                                  className="w-full h-32 sm:h-40 md:h-48 object-cover"
                                >
                                  Your browser does not support the video tag.
                                </video>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
                
                <CardFooter className="pt-3 border-t px-4 md:px-6">
                  <div className="flex items-center justify-between w-full text-xs md:text-sm text-gray-500">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{post.likesCount} <span className="hidden sm:inline">likes</span></span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{post.commentsCount} <span className="hidden sm:inline">comments</span></span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="truncate">{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div className="space-y-3 md:space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <MessageCircle className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm md:text-base font-medium text-gray-900">No comments yet</h3>
              <p className="mt-1 text-xs md:text-sm text-gray-500 px-4">Start engaging with posts in the community!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Card key={comment._id} className="shadow-sm">
                <CardHeader className="pb-3 px-4 md:px-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                      <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                        <AvatarImage src={comment.user.profilePic?.url} />
                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-xs md:text-sm truncate">{comment.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          Commented on: {(comment as any).post?.description?.substring(0, 30)}...
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditComment(comment)}
                        className="h-6 px-2 md:h-7 md:px-2"
                      >
                        <Edit className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline text-xs">Edit</span>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 md:h-7 md:px-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 sm:mr-1" />
                            <span className="hidden sm:inline text-xs">Delete</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Comment</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this comment? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3 px-4 md:px-6">
                  {editingCommentId === comment._id ? (
                    <div className="space-y-3 md:space-y-4">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Edit your comment..."
                        className="min-h-[60px] md:min-h-[80px] text-sm md:text-base"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={cancelEdit} size="sm">
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleEditComment(comment._id)}
                          disabled={isEditing}
                          size="sm"
                        >
                          {isEditing ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-800 text-sm md:text-base leading-relaxed">{comment.content}</p>
                  )}
                </CardContent>
                
                <CardFooter className="pt-3 border-t px-4 md:px-6">
                  <div className="flex items-center justify-between w-full text-xs md:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 md:h-4 md:w-4" />
                      <span>{comment.likesCount} <span className="hidden sm:inline">likes</span></span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="truncate">{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserContentManager;
