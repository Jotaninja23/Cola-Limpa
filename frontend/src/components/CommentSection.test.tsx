import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CommentSection from './CommentSection';
import type { Comment } from '../types/comment';

describe('CommentSection', () => {
  const sampleComments: Comment[] = [
    {
      id: 1,
      postId: 10,
      authorId: 2,
      authorName: 'Pedro Henrique',
      authorAvatar: 'PH',
      content: 'Comentário 1',
      likes: 2,
      liked: false,
      reports: 0,
      createdAt: 'Há 5 min',
    },
    {
      id: 2,
      postId: 10,
      authorId: 1,
      authorName: 'Você',
      authorAvatar: 'VC',
      content: 'Comentário 2',
      likes: 0,
      liked: false,
      reports: 0,
      createdAt: 'Agora mesmo',
    },
  ];

  it('should not render anything when isOpen is false', () => {
    const { container } = render(
      <CommentSection
        postId={10}
        comments={sampleComments}
        isOpen={false}
        onAddComment={vi.fn()}
        onLikeComment={vi.fn()}
        onReportComment={vi.fn()}
        onDeleteComment={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should render section header and comment items when isOpen is true', () => {
    render(
      <CommentSection
        postId={10}
        comments={sampleComments}
        isOpen={true}
        onAddComment={vi.fn()}
        onLikeComment={vi.fn()}
        onReportComment={vi.fn()}
        onDeleteComment={vi.fn()}
      />
    );

    expect(screen.getByText('Comentários (2)')).toBeInTheDocument();
    expect(screen.getByText('Comentário 1')).toBeInTheDocument();
    expect(screen.getByText('Comentário 2')).toBeInTheDocument();
  });

  it('should render empty state message when comments array is empty', () => {
    render(
      <CommentSection
        postId={10}
        comments={[]}
        isOpen={true}
        onAddComment={vi.fn()}
        onLikeComment={vi.fn()}
        onReportComment={vi.fn()}
        onDeleteComment={vi.fn()}
      />
    );

    expect(screen.getByText('Comentários (0)')).toBeInTheDocument();
    expect(
      screen.getByText(/nenhum comentário ainda\. seja o primeiro a compartilhar uma dica!/i)
    ).toBeInTheDocument();
  });

  it('should trigger onLikeComment when like is clicked on comment', () => {
    const handleLike = vi.fn();
    render(
      <CommentSection
        postId={10}
        comments={sampleComments}
        isOpen={true}
        onAddComment={vi.fn()}
        onLikeComment={handleLike}
        onReportComment={vi.fn()}
        onDeleteComment={vi.fn()}
      />
    );

    const likeButtons = screen.getAllByRole('button', { name: /curtir comentário/i });
    fireEvent.click(likeButtons[0]);

    expect(handleLike).toHaveBeenCalledWith(1);
  });
});
