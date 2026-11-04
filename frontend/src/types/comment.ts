export interface Comment {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  liked: boolean;
  reports: number;
  createdAt: string;
}

export interface NewCommentPayload {
  postId: number;
  authorId: number;
  content: string;
}

