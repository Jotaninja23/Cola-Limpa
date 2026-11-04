import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface CommentFormProps {
  postId: number;
  onSubmit: (content: string) => Promise<void> | void;
  isSubmitting?: boolean;
}

const MAX_CHAR_LIMIT = 1000;

export default function CommentForm({
  postId,
  onSubmit,
  isSubmitting = false,
}: CommentFormProps) {
  const [content, setContent] = useState('');

  const trimmed = content.trim();
  const isValid = trimmed.length > 0 && content.length <= MAX_CHAR_LIMIT;

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!isValid || isSubmitting) return;

    const submittedText = content;
    setContent('');
    await onSubmit(submittedText);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      className="comment-form"
      onSubmit={handleSubmit}
      aria-label="Adicionar comentário"
    >
      <div className="comment-input-container">
        <textarea
          id={`comment-input-${postId}`}
          className="comment-textarea"
          placeholder="Adicione um comentário construtivo..."
          aria-label="Escreva seu comentário"
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_CHAR_LIMIT}
          rows={2}
          disabled={isSubmitting}
        />
        <div className="comment-form-footer">
          <span
            className={`comment-char-counter ${content.length > MAX_CHAR_LIMIT * 0.9 ? 'limit-near' : ''}`}
            aria-live="polite"
          >
            {content.length}/{MAX_CHAR_LIMIT}
          </span>
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={!isValid || isSubmitting}
            aria-label="Publicar comentário"
          >
            <Send size={15} />
            <span>Enviar</span>
          </button>
        </div>
      </div>
    </form>
  );
}
