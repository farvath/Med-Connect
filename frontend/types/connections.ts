import { IUserProfile } from "./user";

export interface Connection {
  _id: string;
  followerId: string | IUserProfile;
  followingId: string | IUserProfile;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithConnectionInfo extends IUserProfile {
  connectionStatus: 'none' | 'pending' | 'connected' | 'received';
  connectionCount: number;
}

export interface ConnectionListResponse {
  success: boolean;
  data: {
    users: UserWithConnectionInfo[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface ConnectionResponse {
  success: boolean;
  message: string;
  data?: Connection;
}

export interface PendingRequestsResponse {
  success: boolean;
  data: Connection[];
}

export interface MyConnectionsResponse {
  success: boolean;
  data: IUserProfile[];
}

export interface ConnectionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
