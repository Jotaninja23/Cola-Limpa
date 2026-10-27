import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import type { Comment } from '../types/comment';
import { useComments } from '../hooks/useComments';
import CommentSection from './CommentSection';

export interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  tag: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
}

interface PostCardProps {
  post: Post;
  index: number;
  initialComments?: Comment[];
  onToggleLike: (id: number) => void;
}

export default function PostCard({
  post,
  index,
  initialComments = [],
  onToggleLike,
}: PostCardProps) {
  const [commentCount, setCommentCount] = useState(
    initialComments.length > 0 ? initialComments.length : post.comments
  );

  const {
    comments,
    isOpen,
    toggleOpen,
    addComment,
    toggleLikeComment,
    reportComment,
    deleteComment,
  } = useComments({
    postId: post.id,
    initialComments,
    onCommentCountChange: setCommentCount,
  });

  return (
    <article
      className="post-card"
      id={`post-${post.id}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="post-card-header">
        <div className="post-avatar" aria-hidden="true">
          {post.avatar}
        </div>
        <div className="post-author-info">
          <div className="post-author-name">{post.author}</div>
          <time className="post-time">{post.time}</time>
        </div>
        <span className="post-tag">{post.tag}</span>
      </div>

      <div className="post-card-body">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>

      <div className="post-card-footer">
        <button
          type="button"
          id={`like-btn-${post.id}`}
          className={`post-action-btn ${post.liked ? 'liked' : ''}`}
          onClick={() => onToggleLike(post.id)}
          aria-label={`${post.liked ? 'Descurtir' : 'Curtir'} publicação (${post.likes} curtidas)`}
        >
          <Heart size={18} />
          <span>{post.likes}</span>
        </button>

        <button
          type="button"
          id={`comment-toggle-btn-${post.id}`}
          className={`post-action-btn ${isOpen ? 'active' : ''}`}
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={`comments-section-${post.id}`}
          aria-label={`Comentários (${commentCount})`}
        >
          <MessageCircle size={18} />
          <span>{commentCount}</span>
        </button>

        <button
          type="button"
          className="post-action-btn"
          aria-label="Compartilhar publicação"
        >
          <Share2 size={18} />
        </button>

        <button
          type="button"
          className="post-action-btn"
          style={{ marginLeft: 'auto' }}
          aria-label="Salvar publicação"
        >
          <Bookmark size={18} />
        </button>
      </div>

      <CommentSection
        postId={post.id}
        comments={comments}
        isOpen={isOpen}
        onAddComment={addComment}
        onLikeComment={toggleLikeComment}
        onReportComment={reportComment}
        onDeleteComment={deleteComment}
      />
    </article>
  );
}
