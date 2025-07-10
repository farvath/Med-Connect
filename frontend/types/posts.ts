export interface IMedia {
  type: 'image' | 'video';
  url: string;
  fileId: string;
  fileName: string;
  size: number;
}

export interface IPostUser {
  _id: string;
  name: string;
  specialty: string;
  institution: string;
  profilePic?: {
    url: string;
    fileId: string;
  };
}

export interface IPost {
  _id: string;
  userId: string;
  description: string;
  media: IMedia[];
  createdAt: string;
  updatedAt: string;
  user: IPostUser;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface IComment {
  _id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    specialty: string;
    profilePic?: {
      url: string;
      fileId: string;
    };
  };
  likesCount: number;
}

export interface CreatePostData {
  description: string;
  media: File[];
}
