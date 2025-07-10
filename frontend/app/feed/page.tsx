"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, Plus, X, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { getFeedPosts, createPost, toggleLike, addComment, getPostComments } from "@/lib/api";
import { IPost, IComment } from "@/types/posts";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 10;

export default function FeedPage() {
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [videos, setVideos] = useState<File[]>([]);
  
  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("article");
  const [creating, setCreating] = useState(false);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: IComment[] }>({});
  const [commentsLoading, setCommentsLoading] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [isEndOfFeed, setIsEndOfFeed] = useState(false);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [currentMediaPost, setCurrentMediaPost] = useState<IPost | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  
  const modalRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);
  const fetchingCommentsRef = useRef<Set<string>>(new Set());

  // Show notification with auto-hide
  const showNotification = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000); // Auto-hide after 4 seconds
  };

  const fetchPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      console.log('🔄 Fetching posts, page:', pageNum, 'reset:', reset);
      setLoading(pageNum === 1);
      const response = await getFeedPosts(pageNum, 10);
      
      console.log('📥 API Response:', response);
      
      if (response.success) {
        const newPosts = response.data;
        console.log('📝 New posts received:', newPosts.length, newPosts);
        
        if (newPosts.length === 0) {
          setIsEndOfFeed(true);
          setHasMore(false);
          return;
        }
        
        setPosts(prevPosts => {
          const updatedPosts = reset ? newPosts : [...prevPosts, ...newPosts];
          console.log('🎯 Setting posts:', updatedPosts.length, 'posts');
          return updatedPosts;
        });
        
        const hasMorePosts = response.pagination?.hasMore || false;
        setHasMore(hasMorePosts);
        
        // Set end of feed if no more posts available
        if (!hasMorePosts && newPosts.length < 10) {
          setIsEndOfFeed(true);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isEndOfFeed) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, isEndOfFeed]);

  useEffect(() => {
    console.log('🎨 Posts state updated:', posts.length, 'posts', posts);
  }, [posts]);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  const handleFileAdd = (files: FileList | null, setter: React.Dispatch<React.SetStateAction<File[]>>) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        showNotification(`File ${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });
    
    setter(prev => {
      const combined = [...prev, ...validFiles];
      if (combined.length > MAX_FILES) {
        showNotification(`Maximum ${MAX_FILES} files allowed.`);
        return prev;
      }
      return combined;
    });
  };

  const handleFileRemove = (index: number, setter: React.Dispatch<React.SetStateAction<File[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!isLoggedIn) {
      showNotification("Please log in to create posts");
      return;
    }
    
    if (!description.trim()) {
      showNotification("Please enter a description");
      return;
    }

    setCreating(true);
    
    try {
      const formData = new FormData();
      formData.append('description', description);
      
      const allFiles = [...photos, ...videos];
      allFiles.forEach(file => {
        formData.append('media', file);
      });
      
      const response = await createPost(formData);
      
      if (response.success) {
        setModalOpen(false);
        setDescription("");
        setPhotos([]);
        setVideos([]);
        showNotification("Post created successfully!", "success");
        // Refresh feed
        fetchPosts(1, true);
        setPage(1);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showNotification("Error creating post. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) {
      showNotification("Please log in to like posts");
      return;
    }
    
    try {
      const response = await toggleLike(postId, 'post');
      if (response.success) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { 
                  ...post, 
                  isLiked: response.data.liked,
                  likesCount: response.data.liked ? post.likesCount + 1 : post.likesCount - 1
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const fetchComments = async (postId: string) => {
    // Prevent multiple calls if already loading (using both state and ref)
    if (commentsLoading[postId] || fetchingCommentsRef.current.has(postId)) {
      console.log('🔄 Comments already loading for post:', postId);
      return;
    }
    
    console.log('💬 Fetching comments for post:', postId);
    fetchingCommentsRef.current.add(postId);
    setCommentsLoading(prev => ({ ...prev, [postId]: true }));
    
    try {
      const response = await getPostComments(postId, 1, 10);
      console.log('📥 Comments API Response:', response);
      
      if (response.success) {
        console.log('📝 Comments received:', response.data.length, response.data);
        setComments(prev => ({ ...prev, [postId]: response.data }));
      }
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
    } finally {
      fetchingCommentsRef.current.delete(postId);
      setCommentsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleCommentsRef = useRef<Set<string>>(new Set());

  const toggleComments = (postId: string) => {
    // Prevent rapid successive clicks
    if (toggleCommentsRef.current.has(postId)) {
      console.log('🚫 Ignoring rapid click for post:', postId);
      return;
    }
    
    toggleCommentsRef.current.add(postId);
    setTimeout(() => toggleCommentsRef.current.delete(postId), 500); // 500ms debounce
    
    console.log('🔀 Toggling comments for post:', postId);
    
    setExpandedComments(prev => {
      const newState = { ...prev, [postId]: !prev[postId] };
      console.log('📊 Comments expanded state:', newState[postId], 'Comments exist:', !!comments[postId]);
      
      if (newState[postId] && !comments[postId]) {
        console.log('🎯 Need to fetch comments for:', postId);
        // Add a small delay to ensure state is updated
        setTimeout(() => fetchComments(postId), 100);
      }
      
      return newState;
    });
  };

  const handleAddComment = async (postId: string) => {
    if (!isLoggedIn) {
      showNotification("Please log in to add comments");
      return;
    }
    
    const content = newComment[postId];
    if (!content?.trim()) return;
    
    try {
      const response = await addComment(postId, content);
      if (response.success) {
        setComments(prev => ({
          ...prev,
          [postId]: [response.data, ...(prev[postId] || [])]
        }));
        setNewComment(prev => ({ ...prev, [postId]: "" }));
        showNotification("Comment added successfully!", "success");
        
        // Update comment count
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, commentsCount: post.commentsCount + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const openMediaViewer = (post: IPost, index: number = 0) => {
    setCurrentMediaPost(post);
    setCurrentMediaIndex(index);
    setMediaViewerOpen(true);
  };

  const closeMediaViewer = () => {
    setMediaViewerOpen(false);
    setCurrentMediaPost(null);
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    if (currentMediaPost && currentMediaIndex < currentMediaPost.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Keyboard navigation for media viewer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mediaViewerOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          prevMedia();
          break;
        case 'ArrowRight':
          nextMedia();
          break;
        case 'Escape':
          closeMediaViewer();
          break;
      }
    };

    if (mediaViewerOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mediaViewerOpen, currentMediaIndex]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Notification Dropdown */}
      {notification && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-sm sm:w-full animate-in slide-in-from-right-full duration-300">
          <div className={`p-4 rounded-lg shadow-lg border flex items-start space-x-3 ${
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex-shrink-0 mt-0.5">
              {notification.type === 'error' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'success' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-5">{notification.message}</p>
            </div>
            <div className="flex-shrink-0">
              <button 
                onClick={() => setNotification(null)}
                className="inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-500 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Community Feed</h1>
          <p className="text-sm sm:text-base text-gray-600">Stay updated with the latest from the medical community</p>
        </div>

        {/* Create Post Button (only for logged-in users) */}
        {isLoggedIn && (
          <div className="mb-4 sm:mb-6">
            <Card className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage src={user?.profilePic?.url || "/placeholder-user.jpg"} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs sm:text-sm">
                    {user?.name?.substring(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  onClick={() => setModalOpen(true)}
                  variant="outline"
                  className="flex-1 justify-start text-gray-500 hover:text-gray-700 text-sm sm:text-base h-8 sm:h-10"
                >
                  What's on your mind, {user?.name?.split(' ')[0] || 'there'}?
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Feed Posts */}
        <div className="space-y-4 sm:space-y-6">

          
          {posts.map((post, index) => (
            <Card 
              key={post._id} 
              className="hover:shadow-lg transition-shadow"
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarImage src={post.user?.profilePic?.url || "/placeholder-user.jpg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs sm:text-sm">
                      {post.user?.name?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-blue-900 text-sm sm:text-base truncate">{post.user?.name || "Unknown User"}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {post.user?.specialty || "Unknown"} at {post.user?.institution || "Unknown"} • {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">{post.description}</p>
                
                {/* Media Display - LinkedIn Style */}
                {post.media && post.media.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    {post.media.length === 1 ? (
                      // Single media - full width
                      <div className="rounded-lg overflow-hidden cursor-pointer" onClick={() => openMediaViewer(post, 0)}>
                        {post.media[0].type === 'image' ? (
                          <img 
                            src={post.media[0].url} 
                            alt="" 
                            className="w-full h-48 sm:h-64 md:h-96 object-cover"
                          />
                        ) : (
                          <video 
                            src={post.media[0].url} 
                            className="w-full h-48 sm:h-64 md:h-96 object-cover"
                          />
                        )}
                      </div>
                    ) : (
                      // Multiple media - LinkedIn style layout
                      <div className="flex gap-1 sm:gap-2 h-48 sm:h-64 md:h-96">
                        {/* Left side - Main image (50% width) */}
                        <div className="flex-1 rounded-lg overflow-hidden cursor-pointer" onClick={() => openMediaViewer(post, 0)}>
                          {post.media[0].type === 'image' ? (
                            <img 
                              src={post.media[0].url} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video 
                              src={post.media[0].url} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        {/* Right side - 2x1 grid (50% width) */}
                        <div className="flex-1 flex flex-col gap-1 sm:gap-2">
                          {/* Second media (top half) */}
                          {post.media[1] && (
                            <div className="flex-1 rounded-lg overflow-hidden cursor-pointer" onClick={() => openMediaViewer(post, 1)}>
                              {post.media[1].type === 'image' ? (
                                <img 
                                  src={post.media[1].url} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video 
                                  src={post.media[1].url} 
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                          )}
                          
                          {/* Third media or "+X more" overlay (bottom half) */}
                          {post.media.length > 2 && (
                            <div className="flex-1 relative rounded-lg overflow-hidden cursor-pointer" onClick={() => openMediaViewer(post, 2)}>
                              {post.media[2].type === 'image' ? (
                                <img 
                                  src={post.media[2].url} 
                                  alt="" 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video 
                                  src={post.media[2].url} 
                                  className="w-full h-full object-cover"
                                />
                              )}
                              
                              {/* "+X more" overlay */}
                              {post.media.length > 3 && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                                  <span className="text-white text-sm sm:text-lg md:text-xl font-bold">
                                    +{post.media.length - 3} more
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-4 sm:space-x-6 text-gray-500">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center space-x-1 sm:space-x-2 hover:text-blue-600 transition-colors ${
                      post.isLiked ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-xs sm:text-sm">{post.likesCount} likes</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">{post.commentsCount} comments</span>
                  </button>
                  <button className="flex items-center space-x-1 sm:space-x-2 hover:text-blue-600 transition-colors">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">Share</span>
                  </button>
                </div>
                
                {/* Comments Section */}
                {expandedComments[post._id] && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                    {/* Add Comment */}
                    {isLoggedIn && (
                      <div className="flex space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                          <AvatarImage src={user?.profilePic?.url || "/placeholder-user.jpg"} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {user?.name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex space-x-2">
                          <Input
                            placeholder="Write a comment..."
                            value={newComment[post._id] || ""}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                            className="text-sm"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleAddComment(post._id)}
                            disabled={!newComment[post._id]?.trim()}
                            className="px-2 sm:px-3"
                          >
                            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Comments List */}
                    {commentsLoading[post._id] ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {comments[post._id]?.map((comment) => (
                          <div key={comment._id} className="flex space-x-2 sm:space-x-3">
                            <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                              <AvatarImage src={comment.user?.profilePic?.url || "/placeholder-user.jpg"} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {comment.user?.name?.substring(0, 2).toUpperCase() || "??"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="bg-gray-100 rounded-lg px-2 sm:px-3 py-1 sm:py-2">
                                <p className="font-semibold text-xs sm:text-sm text-blue-900 truncate">{comment.user?.name || "Unknown User"}</p>
                                <p className="text-gray-700 text-xs sm:text-sm break-words">{comment.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {/* Loading indicator */}
          {loading && posts.length > 0 && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
          
          {/* End of feed message */}
          {isEndOfFeed && (
            <div className="text-center py-8">
              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-600 mb-2 text-sm sm:text-base font-medium">Posts are over!</p>
                <p className="text-gray-500 text-xs sm:text-sm">Please refresh for latest posts.</p>
              </div>
            </div>
          )}
          
          {/* No posts available */}
          {!loading && posts.length === 0 && !isEndOfFeed && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Be the first to share something with the community!</p>
                {isLoggedIn && (
                  <Button 
                    onClick={() => setModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create First Post
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Initial loading */}
          {loading && posts.length === 0 && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>

        {/* Floating Create Post Button */}
        {isLoggedIn && (
          <Button
            onClick={() => setModalOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 shadow-lg"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        )}

        {/* Create Post Modal */}
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-blue-800">Create a New Post</DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
                <TabsTrigger value="article" className="text-xs sm:text-sm">Article</TabsTrigger>
                <TabsTrigger value="photo" className="text-xs sm:text-sm">Photo</TabsTrigger>
                <TabsTrigger value="video" className="text-xs sm:text-sm">Video</TabsTrigger>
              </TabsList>

              <TabsContent value="article" className="space-y-3 sm:space-y-4">
                <Textarea
                  placeholder="Share your thoughts with the medical community..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="border-gray-300 text-sm sm:text-base"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCreatePost}
                    disabled={creating || !description.trim()}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
                  >
                    {creating ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-2" /> : null}
                    Post
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="photo" className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={URL.createObjectURL(photo)} className="w-full h-full object-cover" alt="" />
                      <button
                        onClick={() => handleFileRemove(index, setPhotos)}
                        className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
                      >
                        <X className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 sm:w-24 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileAdd(e.target.files, setPhotos)}
                    />
                    <Plus className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  </label>
                </div>
                <Textarea 
                  placeholder="Write something about your photos..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="text-sm sm:text-base"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCreatePost}
                    disabled={creating || !description.trim()}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
                  >
                    {creating ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-2" /> : null}
                    Post
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap gap-2 sm:gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <video className="w-full h-full object-cover" src={URL.createObjectURL(video)} />
                      <button
                        onClick={() => handleFileRemove(index, setVideos)}
                        className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"
                      >
                        <X className="w-2 h-2 sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-16 sm:w-24 sm:h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileAdd(e.target.files, setVideos)}
                    />
                    <Plus className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                  </label>
                </div>
                <Textarea 
                  placeholder="Write something about your videos..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="text-sm sm:text-base"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCreatePost}
                    disabled={creating || !description.trim()}
                    className="bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base"
                  >
                    {creating ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-2" /> : null}
                    Post
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Media Viewer Modal */}
        <Dialog open={mediaViewerOpen} onOpenChange={setMediaViewerOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full bg-black/95 border-0 p-0 m-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Media Viewer</DialogTitle>
            </DialogHeader>
            {currentMediaPost && (
              <div className="relative w-full h-full min-h-[80vh] flex items-center justify-center">
                {/* Close Button */}
                <button
                  onClick={closeMediaViewer}
                  className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 bg-black/70 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Media Counter */}
                <div className="absolute top-4 left-4 z-50 text-white bg-black/70 rounded-full px-4 py-2 text-sm font-medium">
                  {currentMediaIndex + 1} / {currentMediaPost.media.length}
                </div>

                {/* Previous Button */}
                {currentMediaIndex > 0 && (
                  <button
                    onClick={prevMedia}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:text-gray-300 bg-black/70 rounded-full p-3 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Next Button */}
                {currentMediaIndex < currentMediaPost.media.length - 1 && (
                  <button
                    onClick={nextMedia}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 text-white hover:text-gray-300 bg-black/70 rounded-full p-3 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Media Content Container */}
                <div className="w-full h-full flex items-center justify-center p-16">
                  <div className="max-w-full max-h-full flex items-center justify-center">
                    {currentMediaPost.media[currentMediaIndex].type === 'image' ? (
                      <img
                        src={currentMediaPost.media[currentMediaIndex].url}
                        alt=""
                        className="max-w-full max-h-full object-contain rounded-lg"
                        style={{ maxHeight: 'calc(100vh - 8rem)' }}
                      />
                    ) : (
                      <video
                        src={currentMediaPost.media[currentMediaIndex].url}
                        controls
                        className="max-w-full max-h-full object-contain rounded-lg"
                        style={{ maxHeight: 'calc(100vh - 8rem)' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
