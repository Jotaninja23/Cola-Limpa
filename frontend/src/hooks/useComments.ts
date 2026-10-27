import { useState, useCallback } from 'react';
import type { Comment } from '../types/comment';

interface UseCommentsOptions {
  postId: number;
  initialComments?: Comment[];
  currentUserId?: number;
  currentUserName?: string;
  currentUserAvatar?: string;
  onCommentCountChange?: (count: number) => void;
}

export function useComments({
  postId,
  initialComments = [],
  currentUserId = 1,
  currentUserName = 'Você',
  currentUserAvatar = 'VC',
  onCommentCountChange,
}: UseCommentsOptions) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const addComment = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || trimmed.length > 1000) {
        return;
      }

      const newComment: Comment = {
        id: Date.now(),
        postId,
        authorId: currentUserId,
        authorName: currentUserName,
        authorAvatar: currentUserAvatar,
        content: trimmed,
        likes: 0,
        liked: false,
        reports: 0,
        createdAt: 'Agora mesmo',
      };

      setComments(prev => {
        const next = [...prev, newComment];
        if (onCommentCountChange) {
          onCommentCountChange(next.length);
        }
        return next;
      });
    },
    [postId, currentUserId, currentUserName, currentUserAvatar, onCommentCountChange]
  );

  const toggleLikeComment = useCallback((commentId: number) => {
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? Math.max(0, c.likes - 1) : c.likes + 1,
            }
          : c
      )
    );
  }, []);

  const reportComment = useCallback((commentId: number) => {
    setComments(prev =>
      prev
        .map(c => (c.id === commentId ? { ...c, reports: c.reports + 1 } : c))
        .filter(c => c.reports < 5)
    );
  }, []);

  const deleteComment = useCallback(
    (commentId: number) => {
      setComments(prev => {
        const next = prev.filter(c => c.id !== commentId);
        if (onCommentCountChange) {
          onCommentCountChange(next.length);
        }
        return next;
      });
    },
    [onCommentCountChange]
  );

  return {
    comments,
    commentCount: comments.length,
    isOpen,
    toggleOpen,
    addComment,
    toggleLikeComment,
    reportComment,
    deleteComment,
  };
}
