import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CommentItem from './CommentItem';
import type { Comment } from '../types/comment';

describe('CommentItem', () => {
  const defaultComment: Comment = {
    id: 1,
    postId: 10,
    authorId: 1,
    authorName: 'Ana Clara',
    authorAvatar: 'AC',
    content: 'Comentário instrutivo de teste',
    likes: 4,
    liked: false,
    reports: 0,
    createdAt: 'Há 5 min',
  };

  it('should render author name, creation time, text, and like counter', () => {
    render(
      <CommentItem
        comment={defaultComment}
        currentUserId={1}
        onLike={vi.fn()}
        onReport={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Ana Clara')).toBeInTheDocument();
    expect(screen.getByText('Há 5 min')).toBeInTheDocument();
    expect(screen.getByText('Comentário instrutivo de teste')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should trigger onLike when clicking like button', () => {
    const handleLike = vi.fn();
    render(
      <CommentItem
        comment={defaultComment}
        currentUserId={1}
        onLike={handleLike}
        onReport={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const likeBtn = screen.getByRole('button', { name: /curtir comentário/i });
    fireEvent.click(likeBtn);

    expect(handleLike).toHaveBeenCalledWith(1);
  });

  it('should trigger onReport when clicking report button', () => {
    const handleReport = vi.fn();
    render(
      <CommentItem
        comment={defaultComment}
        currentUserId={1}
        onLike={vi.fn()}
        onReport={handleReport}
        onDelete={vi.fn()}
      />
    );

    const reportBtn = screen.getByRole('button', { name: /denunciar comentário/i });
    fireEvent.click(reportBtn);

    expect(handleReport).toHaveBeenCalledWith(1);
  });

  it('should show delete button when user is author and trigger onDelete', () => {
    const handleDelete = vi.fn();
    render(
      <CommentItem
        comment={defaultComment}
        currentUserId={1}
        onLike={vi.fn()}
        onReport={vi.fn()}
        onDelete={handleDelete}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /excluir comentário/i });
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it('should not show delete button when user is not author', () => {
    render(
      <CommentItem
        comment={defaultComment}
        currentUserId={999}
        onLike={vi.fn()}
        onReport={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: /excluir comentário/i })).not.toBeInTheDocument();
  });
});
