import type { Comment } from '../types/comment';
import { Heart, Flag, Trash2 } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  onLike: (commentId: number) => void;
  onReport: (commentId: number) => void;
  onDelete: (commentId: number) => void;
}

export default function CommentItem({
  comment,
  currentUserId = 1,
  onLike,
  onReport,
  onDelete,
}: CommentItemProps) {
  const isAuthor = comment.authorId === currentUserId;

  return (
    <article className="comment-item" id={`comment-${comment.id}`}>
      <div className="comment-avatar" aria-hidden="true">
        {comment.authorAvatar}
      </div>
      <div className="comment-content-wrapper">
        <div className="comment-header">
          <span className="comment-author-name">{comment.authorName}</span>
          <time className="comment-time">{comment.createdAt}</time>
        </div>
        <p className="comment-text">{comment.content}</p>
        <div className="comment-actions">
          <button
            type="button"
            className={`comment-action-btn ${comment.liked ? 'liked' : ''}`}
            onClick={() => onLike(comment.id)}
            aria-label={`${comment.liked ? 'Descurtir' : 'Curtir'} comentário (${comment.likes} curtidas)`}
          >
            <Heart size={14} />
            <span>{comment.likes}</span>
          </button>
          <button
            type="button"
            className="comment-action-btn report-btn"
            onClick={() => onReport(comment.id)}
            aria-label="Denunciar comentário"
          >
            <Flag size={14} />
          </button>
          {isAuthor && (
            <button
              type="button"
              className="comment-action-btn delete-btn"
              onClick={() => onDelete(comment.id)}
              aria-label="Excluir comentário"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
