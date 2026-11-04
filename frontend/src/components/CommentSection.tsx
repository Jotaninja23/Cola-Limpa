import type { Comment } from '../types/comment';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  isOpen: boolean;
  isSubmitting?: boolean;
  currentUserId?: number;
  onAddComment: (content: string) => Promise<void> | void;
  onLikeComment: (commentId: number) => void;
  onReportComment: (commentId: number) => void;
  onDeleteComment: (commentId: number) => void;
}

export default function CommentSection({
  postId,
  comments,
  isOpen,
  isSubmitting = false,
  currentUserId = 1,
  onAddComment,
  onLikeComment,
  onReportComment,
  onDeleteComment,
}: CommentSectionProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <section
      id={`comments-section-${postId}`}
      className="comments-section"
      aria-label="Comentários da publicação"
    >
      <div className="comments-section-header">
        <h4>Comentários ({comments.length})</h4>
      </div>

      <CommentForm
        postId={postId}
        onSubmit={onAddComment}
        isSubmitting={isSubmitting}
      />

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="comments-empty-message">
            Nenhum comentário ainda. Seja o primeiro a compartilhar uma dica!
          </p>
        ) : (
          comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onLike={onLikeComment}
              onReport={onReportComment}
              onDelete={onDeleteComment}
            />
          ))
        )}
      </div>
    </section>
  );
}

