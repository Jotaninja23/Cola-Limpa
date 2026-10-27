import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useComments } from './useComments';
import type { Comment } from '../types/comment';

describe('useComments', () => {
  const initialComments: Comment[] = [
    {
      id: 101,
      postId: 1,
      authorId: 2,
      authorName: 'Pedro',
      authorAvatar: 'PH',
      content: 'Muito boa essa dica!',
      likes: 3,
      liked: false,
      reports: 0,
      createdAt: 'Há 10 min',
    },
  ];

  it('should initialize with default values and provided comments', () => {
    const { result } = renderHook(() =>
      useComments({ postId: 1, initialComments })
    );

    expect(result.current.isOpen).toBe(false);
    expect(result.current.comments).toHaveLength(1);
    expect(result.current.commentCount).toBe(1);
  });

  it('should toggle open state', () => {
    const { result } = renderHook(() =>
      useComments({ postId: 1, initialComments })
    );

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleOpen();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should add a valid comment and trigger count callback', async () => {
    const handleCountChange = vi.fn();
    const { result } = renderHook(() =>
      useComments({
        postId: 1,
        initialComments,
        onCommentCountChange: handleCountChange,
      })
    );

    await act(async () => {
      await result.current.addComment('   Excelente contribuição!   ');
    });

    expect(result.current.comments).toHaveLength(2);
    expect(result.current.commentCount).toBe(2);
    expect(result.current.comments[1].content).toBe('Excelente contribuição!');
    expect(handleCountChange).toHaveBeenCalledWith(2);
  });

  it('should not add comment when content is empty or blank', async () => {
    const handleCountChange = vi.fn();
    const { result } = renderHook(() =>
      useComments({
        postId: 1,
        initialComments,
        onCommentCountChange: handleCountChange,
      })
    );

    await act(async () => {
      await result.current.addComment('    ');
    });

    expect(result.current.comments).toHaveLength(1);
    expect(handleCountChange).not.toHaveBeenCalled();
  });

  it('should not add comment when content exceeds 1000 characters', async () => {
    const handleCountChange = vi.fn();
    const { result } = renderHook(() =>
      useComments({
        postId: 1,
        initialComments,
        onCommentCountChange: handleCountChange,
      })
    );

    const longText = 'a'.repeat(1001);

    await act(async () => {
      await result.current.addComment(longText);
    });

    expect(result.current.comments).toHaveLength(1);
    expect(handleCountChange).not.toHaveBeenCalled();
  });

  it('should toggle like status for a specific comment', () => {
    const { result } = renderHook(() =>
      useComments({ postId: 1, initialComments })
    );

    act(() => {
      result.current.toggleLikeComment(101);
    });

    expect(result.current.comments[0].liked).toBe(true);
    expect(result.current.comments[0].likes).toBe(4);

    act(() => {
      result.current.toggleLikeComment(101);
    });

    expect(result.current.comments[0].liked).toBe(false);
    expect(result.current.comments[0].likes).toBe(3);
  });

  it('should increment reports and filter out comment when reaching 5 reports', () => {
    const { result } = renderHook(() =>
      useComments({ postId: 1, initialComments })
    );

    for (let i = 0; i < 4; i++) {
      act(() => {
        result.current.reportComment(101);
      });
      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].reports).toBe(i + 1);
    }

    act(() => {
      result.current.reportComment(101);
    });

    expect(result.current.comments).toHaveLength(0);
  });

  it('should delete comment and trigger count callback', () => {
    const handleCountChange = vi.fn();
    const { result } = renderHook(() =>
      useComments({
        postId: 1,
        initialComments,
        onCommentCountChange: handleCountChange,
      })
    );

    act(() => {
      result.current.deleteComment(101);
    });

    expect(result.current.comments).toHaveLength(0);
    expect(result.current.commentCount).toBe(0);
    expect(handleCountChange).toHaveBeenCalledWith(0);
  });
});
