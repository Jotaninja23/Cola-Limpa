import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Flag, Trash2, Edit3 } from 'lucide-react';
import type { Comment } from '../types/comment';
import type { Post } from '../types/post';
import { useComments } from '../hooks/useComments';
import CommentSection from './CommentSection';

export type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
  index: number;
  initialComments?: Comment[];
  currentUserId?: number;
  isAdmin?: boolean;
  onToggleLike: (id: number) => void;
  onEditPost?: (post: Post) => void;
  onDeletePost?: (id: number) => void;
  onReportPost?: (id: number) => void;
}

export default function PostCard({
  post,
  index,
  initialComments = [],
  currentUserId,
  isAdmin = false,
  onToggleLike,
  onEditPost,
  onDeletePost,
  onReportPost,
}: PostCardProps) {
  const [commentCount, setCommentCount] = useState(
    initialComments.length > 0 ? initialComments.length : post.comments
  );
  const [hasReported, setHasReported] = useState(false);

  const isOwner = Boolean(currentUserId && post.authorId && currentUserId === post.authorId);
  const canManage = isOwner || isAdmin;

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

  const handleReport = () => {
    if (hasReported) return;
    setHasReported(true);
    onReportPost?.(post.id);
  };

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
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {post.materia && <span className="post-tag post-materia-tag">{post.materia}</span>}
          <span className="post-tag">{post.tag}</span>

          {canManage && onEditPost && (
            <button
              type="button"
              className="post-action-icon-btn"
              onClick={() => onEditPost(post)}
              title="Editar publicação"
              aria-label="Editar publicação"
            >
              <Edit3 size={15} />
            </button>
          )}

          {canManage && onDeletePost && (
            <button
              type="button"
              className="post-action-icon-btn delete-btn"
              onClick={() => onDeletePost(post.id)}
              title="Excluir publicação"
              aria-label="Excluir publicação"
            >
              <Trash2 size={15} />
            </button>
          )}

          {!isOwner && onReportPost && (
            <button
              type="button"
              className={`post-action-icon-btn ${hasReported ? 'reported' : ''}`}
              onClick={handleReport}
              disabled={hasReported}
              title={hasReported ? 'Publicação denunciada' : 'Denunciar publicação'}
              aria-label="Denunciar publicação"
            >
              <Flag size={15} />
            </button>
          )}
        </div>
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
