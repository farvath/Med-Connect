import { Request, Response } from 'express';
import Connection from '../models/Connection';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getUserConnections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const search = req.query.search as string;
    
    const skip = (page - 1) * limit;
    
    // Build search query
    let searchQuery: any = { _id: { $ne: userId } }; // Exclude current user
    
    // Get all connected user IDs to exclude them from discovery
    const userConnections = await Connection.find({
      $or: [
        { followerId: userId, isAccepted: true },
        { followingId: userId, isAccepted: true }
      ]
    });
    
    // Extract connected user IDs (excluding current user)
    const connectedUserIds = new Set();
    userConnections.forEach(conn => {
      if (conn.followerId.toString() !== userId) {
        connectedUserIds.add(conn.followerId);
      }
      if (conn.followingId.toString() !== userId) {
        connectedUserIds.add(conn.followingId);
      }
    });
    
    // Add connected users to exclusion list
    const excludeUserIds = Array.from(connectedUserIds);
    if (excludeUserIds.length > 0) {
      searchQuery._id = { $ne: userId, $nin: excludeUserIds };
    }
    
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
        { institution: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get all users (excluding current user)
    const users = await User.find(searchQuery, '-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get connection status for each user
    const userIds = users.map(user => user._id);
    const connections = await Connection.find({
      $or: [
        { followerId: userId, followingId: { $in: userIds } },
        { followerId: { $in: userIds }, followingId: userId }
      ]
    });
    
    // Create a map for quick lookup
    const connectionMap = new Map();
    connections.forEach(conn => {
      const key = `${conn.followerId}-${conn.followingId}`;
      connectionMap.set(key, conn);
    });
    
    // Count connections for each user
    const connectionCounts = await Connection.aggregate([
      { $match: { isAccepted: true } },
      {
        $group: {
          _id: '$followerId',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const connectionCountMap = new Map();
    connectionCounts.forEach(item => {
      connectionCountMap.set(item._id.toString(), item.count);
    });
    
    // Add connection info to users
    const usersWithConnectionInfo = users.map(user => {
      const userObj = user.toObject();
      
      // Check connection status
      const sentKey = `${userId}-${user._id}`;
      const receivedKey = `${user._id}-${userId}`;
      
      const sentConnection = connectionMap.get(sentKey);
      const receivedConnection = connectionMap.get(receivedKey);
      
      let connectionStatus = 'none';
      if (sentConnection) {
        connectionStatus = sentConnection.isAccepted ? 'connected' : 'pending';
      } else if (receivedConnection) {
        connectionStatus = receivedConnection.isAccepted ? 'connected' : 'received';
      }
      
      // Get connection count
      const connectionCount = connectionCountMap.get((user._id as any).toString()) || 0;
      
      return {
        ...userObj,
        connectionStatus,
        connectionCount
      };
    });
    
    // Get total count for pagination
    const totalCount = await User.countDocuments(searchQuery);
    
    res.json({
      success: true,
      data: {
        users: usersWithConnectionInfo,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPreviousPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user connections:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const sendConnectionRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { followingId } = req.body;
    const followerId = req.userId;
    
    if (!followingId) {
      return res.status(400).json({ success: false, message: 'Following ID is required' });
    }
    
    if (followerId === followingId) {
      return res.status(400).json({ success: false, message: 'Cannot send connection request to yourself' });
    }
    
    // Check if user exists
    const targetUser = await User.findById(followingId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      followerId,
      followingId
    });
    
    if (existingConnection) {
      return res.status(400).json({ 
        success: false, 
        message: existingConnection.isAccepted ? 'Already connected' : 'Connection request already sent' 
      });
    }
    
    // Create new connection request
    const connection = new Connection({
      followerId,
      followingId,
      isAccepted: false
    });
    
    await connection.save();
    
    res.json({
      success: true,
      message: 'Connection request sent successfully',
      data: connection
    });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const acceptConnectionRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;
    
    // Find the connection request
    const connection = await Connection.findOne({
      _id: connectionId,
      followingId: userId,
      isAccepted: false
    });
    
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }
    
    // Update connection status
    connection.isAccepted = true;
    await connection.save();
    
    res.json({
      success: true,
      message: 'Connection request accepted',
      data: connection
    });
  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const rejectConnectionRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;
    
    // Find and delete the connection request
    const connection = await Connection.findOneAndDelete({
      _id: connectionId,
      followingId: userId,
      isAccepted: false
    });
    
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }
    
    res.json({
      success: true,
      message: 'Connection request rejected'
    });
  } catch (error) {
    console.error('Error rejecting connection request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPendingRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    // Get pending connection requests where current user is the recipient
    const pendingRequests = await Connection.find({
      followingId: userId,
      isAccepted: false
    }).populate('followerId', '-password');
    
    res.json({
      success: true,
      data: pendingRequests
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getMyConnections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    // Get accepted connections where current user is either follower or following
    const connections = await Connection.find({
      $or: [
        { followerId: userId },
        { followingId: userId }
      ],
      isAccepted: true
    }).populate('followerId followingId', '-password');
    
    // Extract the connected users (excluding current user)
    const connectedUsers = connections.map(conn => {
      const follower = conn.followerId as any;
      const following = conn.followingId as any;
      
      if (follower._id.toString() === userId) {
        return following;
      } else {
        return follower;
      }
    });
    
    res.json({
      success: true,
      data: connectedUsers
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
