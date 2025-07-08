'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Users, UserPlus, MessageCircle, UserCheck, UserX, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { 
  UserWithConnectionInfo, 
  Connection 
} from "@/types/connections";

const ITEMS_PER_LOAD = 6;

export default function ConnectionsPage() {
  const [users, setUsers] = useState<UserWithConnectionInfo[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [myConnections, setMyConnections] = useState<UserWithConnectionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState('network');
  
  const { isLoggedIn, user } = useAuth();
  const observerTarget = useRef(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (loading || !isLoggedIn) return;
    
    setLoading(true);
    
    try {
      const response = await apiFetch<{users: UserWithConnectionInfo[], pagination: any}>("/connections/users", {
        params: {
          page: pageNum,
          limit: ITEMS_PER_LOAD,
          search: searchTerm || undefined
        }
      });
      
      if (!response.users || response.users.length === 0) {
        if (reset) {
          setUsers([]);
        }
        setHasMore(false);
        setTotalCount(response.pagination?.totalCount || 0);
        return;
      }
      
      if (reset) {
        setUsers(response.users);
      } else {
        setUsers(prev => [...prev, ...response.users]);
      }
      
      setTotalCount(response.pagination.totalCount);
      setHasMore(response.pagination.hasNextPage);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setHasMore(false);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, isLoggedIn, toast]); // Removed 'loading' from dependencies

  const fetchPendingRequests = useCallback(async () => {
    if (!isLoggedIn) return;
    
    try {
      const response = await apiFetch<Connection[]>("/connections/pending");
      setPendingRequests(response || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending requests.",
        variant: "destructive",
      });
    }
  }, [isLoggedIn, toast]);

  const fetchMyConnections = useCallback(async () => {
    if (!isLoggedIn) return;
    
    try {
      const response = await apiFetch<UserWithConnectionInfo[]>("/connections/my-connections");
      setMyConnections(response || []);
    } catch (error) {
      console.error('Error fetching my connections:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your connections.",
        variant: "destructive",
      });
    }
  }, [isLoggedIn, toast]);

  // Reset and fetch when search changes
  useEffect(() => {
    if (activeTab === 'discover') {
      setUsers([]);
      setPage(1);
      setHasMore(true);
      fetchUsers(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, activeTab]); // fetchUsers is stable due to useCallback

  // Fetch pending requests when on requests tab
  useEffect(() => {
    if (activeTab === 'requests') {
      fetchPendingRequests();
    } else if (activeTab === 'network') {
      fetchMyConnections();
    }
  }, [activeTab, fetchPendingRequests, fetchMyConnections]);

  // Infinite scroll observer
  useEffect(() => {
    if (activeTab !== 'discover' || !hasMore || (users.length === 0 && !loading)) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && users.length > 0) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchUsers(nextPage, false);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, page, users.length, activeTab]); // fetchUsers is stable due to useCallback

  // Send connection request
  const sendConnectionRequest = async (userId: string) => {
    try {
      const response = await apiFetch<Connection>("/connections/send", {
        method: 'POST',
        data: { followingId: userId }
      });

      if (response) {
        // Update user status in the list
        setUsers(prev => prev.map(user => 
          user._id === userId 
            ? { ...user, connectionStatus: 'pending' }
            : user
        ));
        
        toast({
          title: "Success",
          description: "Connection request sent successfully!",
        });
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request.",
        variant: "destructive",
      });
    }
  };

  // Accept connection request
  const acceptConnectionRequest = async (connectionId: string) => {
    try {
      const response = await apiFetch<Connection>(`/connections/accept/${connectionId}`, {
        method: 'PUT'
      });

      if (response) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(req => req._id !== connectionId));
        
        toast({
          title: "Success",
          description: "Connection request accepted!",
        });
      }
    } catch (error) {
      console.error('Error accepting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection request.",
        variant: "destructive",
      });
    }
  };

  // Reject connection request
  const rejectConnectionRequest = async (connectionId: string) => {
    try {
      await apiFetch(`/connections/reject/${connectionId}`, {
        method: 'DELETE'
      });

      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req._id !== connectionId));
      
      toast({
        title: "Success",
        description: "Connection request rejected.",
      });
    } catch (error) {
      console.error('Error rejecting connection request:', error);
      toast({
        title: "Error",
        description: "Failed to reject connection request.",
        variant: "destructive",
      });
    }
  };

  // Search with debounce
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const handleSearchChange = (value: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      setSearchTerm(value);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get profile picture URL with fallback
  const getProfilePicture = (profilePic: any) => {
    if (profilePic && profilePic.url && profilePic.url.trim() !== '') {
      return profilePic.url;
    }
    return "/placeholder-user.jpg";
  };

  // Format connection count
  const formatConnectionCount = (count: number) => {
    if (count === 0) return 'No connections';
    if (count === 1) return '1 connection';
    if (count < 1000) return `${count} connections`;
    return `${(count / 1000).toFixed(1)}k connections`;
  };

  // Get connection button content
  const getConnectionButton = (user: UserWithConnectionInfo) => {
    switch (user.connectionStatus) {
      case 'connected':
        return (
          <Button disabled className="flex-1 bg-green-600 text-xs sm:text-sm">
            <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Connected
          </Button>
        );
      case 'pending':
        return (
          <Button disabled className="flex-1 bg-yellow-600 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Pending
          </Button>
        );
      case 'received':
        return (
          <Button disabled className="flex-1 bg-blue-600 text-xs sm:text-sm">
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Received
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => sendConnectionRequest(user._id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
          >
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Connect
          </Button>
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Please log in to access connections</h1>
          <Link href="/login">
            <Button className="w-full sm:w-auto">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Professional Network</h1>
          <p className="text-gray-600 text-sm sm:text-base">Connect with medical professionals worldwide</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="network" className="px-2 sm:px-3">
              <span className="hidden sm:inline">My </span>Network
              {myConnections.length > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                  {myConnections.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="discover" className="px-2 sm:px-3">Discover</TabsTrigger>
            <TabsTrigger value="requests" className="px-2 sm:px-3">
              <span className="hidden sm:inline">Pending </span>Requests
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1 sm:ml-2 text-xs">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="network">
            <div className="space-y-6">
              {myConnections.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                  <p className="text-gray-600">Start connecting with medical professionals to build your network</p>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Network</h3>
                    <p className="text-sm text-gray-600">
                      You have {myConnections.length} professional connection{myConnections.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {myConnections.map((connection) => (
                      <Card key={connection._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                              <AvatarImage 
                                src={getProfilePicture(connection.profilePic)} 
                                alt={connection.name}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm sm:text-lg">
                                {getInitials(connection.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base sm:text-lg text-blue-900 truncate">
                                {connection.name}
                              </CardTitle>
                              <CardDescription className="truncate text-sm">
                                {connection.specialty}
                              </CardDescription>
                              {connection.headline && (
                                <p className="text-xs sm:text-sm text-gray-600 truncate">
                                  {connection.headline}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{connection.institution}, {connection.location}</span>
                            </div>
                            <div className="flex items-center text-green-600 text-xs sm:text-sm">
                              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                              <span>Connected</span>
                            </div>
                          </div>
                          
                          {connection.bio && (
                            <div className="text-gray-600 text-xs sm:text-sm mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {connection.bio}
                            </div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" className="flex-1 text-xs sm:text-sm">
                              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Message
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="discover">
            {/* Search */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, specialty, hospital, or location"
                  className="pl-10"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              {totalCount > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Found {totalCount} professionals
                </p>
              )}
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {users.map((user) => (
                <Card key={user._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        <AvatarImage 
                          src={getProfilePicture(user.profilePic)} 
                          alt={user.name}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm sm:text-lg">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg text-blue-900 truncate">
                          {user.name}
                        </CardTitle>
                        <CardDescription className="truncate text-sm">
                          {user.specialty}
                        </CardDescription>
                        {user.headline && (
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {user.headline}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{user.institution}, {user.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span>{formatConnectionCount(user.connectionCount)}</span>
                      </div>
                    </div>
                    
                    {user.bio && (
                      <div className="text-gray-600 text-xs sm:text-sm mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {user.bio}
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      {getConnectionButton(user)}
                      <Button variant="outline" className="flex-1 text-xs sm:text-sm">
                        <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading and Load More */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading users...</p>
              </div>
            )}

            {/* Infinite scroll trigger */}
            {hasMore && !loading && users.length > 0 && (
              <div ref={observerTarget} className="h-10" />
            )}

            {/* No more results */}
            {!hasMore && users.length > 0 && (
              <div className="text-center py-8 text-gray-600">
                <p>You've seen all {totalCount} professionals</p>
              </div>
            )}

            {/* No results */}
            {!loading && users.length === 0 && totalCount === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No professionals found</h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No professionals are available at the moment"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests">
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-600">You have no pending connection requests</p>
                </div>
              ) : (
                pendingRequests.map((request) => {
                  const follower = request.followerId as any;
                  return (
                    <Card key={request._id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <Avatar className="w-12 h-12 flex-shrink-0">
                            <AvatarImage 
                              src={getProfilePicture(follower.profilePic)} 
                              alt={follower.name}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(follower.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{follower.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{follower.specialty}</p>
                            <p className="text-sm text-gray-500 truncate">{follower.institution}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                          <Button
                            onClick={() => acceptConnectionRequest(request._id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                          >
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => rejectConnectionRequest(request._id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                          >
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
