"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, Plus, X, Send, Loader2 } from "lucide-react";
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
  const [photos, setPhotos] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("article");
  const [creating, setCreating] = useState(false);
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: IComment[] }>({});
  const [commentsLoading, setCommentsLoading] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [isEndOfFeed, setIsEndOfFeed] = useState(false);
  
  const modalRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);
  const fetchingCommentsRef = useRef<Set<string>>(new Set());

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
        
        setHasMore(response.pagination?.hasMore || false);
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
        alert(`File ${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });
    
    setter(prev => {
      const combined = [...prev, ...validFiles];
      if (combined.length > MAX_FILES) {
        alert(`Maximum ${MAX_FILES} files allowed.`);
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
      alert("Please log in to create posts");
      return;
    }
    
    if (!description.trim()) {
      alert("Please enter a description");
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
        // Refresh feed
        fetchPosts(1, true);
        setPage(1);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert("Error creating post. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) {
      alert("Please log in to like posts");
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
      alert("Please log in to add comments");
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Community Feed</h1>
          <p className="text-gray-600">Stay updated with the latest from the medical community</p>
        </div>

        {/* Feed Posts */}
        <div className="space-y-6">

          
          {posts.map((post, index) => (
            <Card 
              key={post._id} 
              className="hover:shadow-lg transition-shadow"
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.user?.profilePic?.url || "/placeholder-user.jpg"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {post.user?.name?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-blue-900">{post.user?.name || "Unknown User"}</h4>
                    <p className="text-sm text-gray-600">
                      {post.user?.specialty || "Unknown"} at {post.user?.institution || "Unknown"} • {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.description}</p>
                
                {/* Media Display */}
                {post.media && post.media.length > 0 && (
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {post.media.map((media, mediaIndex) => (
                      <div key={mediaIndex} className="rounded-lg overflow-hidden">
                        {media.type === 'image' ? (
                          <img 
                            src={media.url} 
                            alt="" 
                            className="w-full h-auto max-h-96 object-cover"
                          />
                        ) : (
                          <video 
                            src={media.url} 
                            controls 
                            className="w-full h-auto max-h-96"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center space-x-6 text-gray-500">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center space-x-2 hover:text-blue-600 transition-colors ${
                      post.isLiked ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likesCount} likes</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>{post.commentsCount} comments</span>
                  </button>
                  <button className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                
                {/* Comments Section */}
                {expandedComments[post._id] && (
                  <div className="mt-4 pt-4 border-t">
                    {/* Add Comment */}
                    {isLoggedIn && (
                      <div className="flex space-x-3 mb-4">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user?.profilePic?.url || "/placeholder-user.jpg"} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user?.name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex space-x-2">
                          <Input
                            placeholder="Write a comment..."
                            value={newComment[post._id] || ""}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post._id)}
                          />
                          <Button 
                            size="sm" 
                            onClick={() => handleAddComment(post._id)}
                            disabled={!newComment[post._id]?.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Comments List */}
                    {commentsLoading[post._id] ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {comments[post._id]?.map((comment) => (
                          <div key={comment._id} className="flex space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={comment.user?.profilePic?.url || "/placeholder-user.jpg"} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {comment.user?.name?.substring(0, 2).toUpperCase() || "??"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-lg px-3 py-2">
                                <p className="font-semibold text-sm text-blue-900">{comment.user?.name || "Unknown User"}</p>
                                <p className="text-gray-700">{comment.content}</p>
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
              <p className="text-gray-500 mb-4">You've reached the end of the feed!</p>
              <Button 
                onClick={() => {
                  setIsEndOfFeed(false);
                  setPage(1);
                  fetchPosts(1, true);
                }}
                variant="outline"
              >
                Refresh for latest posts
              </Button>
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
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 p-0 shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}

        {/* Create Post Modal */}
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-blue-800">Create a New Post</DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="article">Article</TabsTrigger>
                <TabsTrigger value="photo">Photo</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>

              <TabsContent value="article" className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts with the medical community..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="border-gray-300"
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCreatePost}
                    disabled={creating || !description.trim()}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Post
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="photo" className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={URL.createObjectURL(photo)} className="w-full h-full object-cover" alt="" />
                      <button
                        onClick={() => handleFileRemove(index, setPhotos)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileAdd(e.target.files, setPhotos)}
                    />
                    <Plus className="text-gray-500" />
                  </label>
                </div>
                <Textarea 
                  placeholder="Write something about your photos..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCreatePost}
                    disabled={creating || !description.trim()}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Post
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  {videos.map((video, index) => (
                    <div key={index} className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <video className="w-full h-full object-cover" src={URL.createObjectURL(video)} />
                      <button
                        onClick={() => handleFileRemove(index, setVideos)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileAdd(e.target.files, setVideos)}
                    />
                    <Plus className="text-gray-500" />
                  </label>
                </div>
                <Textarea 
                  placeholder="Write something about your videos..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCreatePost}
                    disabled={creating || !description.trim()}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Post
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
