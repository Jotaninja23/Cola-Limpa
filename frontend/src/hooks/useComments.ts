import { useState, useCallback, useEffect } from 'react';
import type { Comment } from '../types/comment';
import { comentarioService } from '../services/comentarioService';
import { likeService } from '../services/likeService';

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialComments.length > 0 && comments.length === 0) {
      setComments(initialComments);
    }
  }, [initialComments, comments.length]);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      if (next && comments.length === 0 && postId > 0) {
        setIsLoading(true);
        comentarioService
          .listarPorPost(postId)
          .then(data => {
            if (data && data.length > 0) {
              setComments(data);
              onCommentCountChange?.(data.length);
            }
          })
          .catch(() => {
            // Mantém comentários locais ou vazios caso endpoint não responda
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
      return next;
    });
  }, [comments.length, onCommentCountChange, postId]);

  const addComment = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || trimmed.length > 1000) {
        return;
      }

      const optimisticComment: Comment = {
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
        const next = [...prev, optimisticComment];
        if (onCommentCountChange) {
          onCommentCountChange(next.length);
        }
        return next;
      });

      try {
        const saved = await comentarioService.criar(postId, trimmed);
        setComments(prev =>
          prev.map(c => (c.id === optimisticComment.id ? { ...saved, liked: false } : c))
        );
      } catch {
        // Mantém comentário otimista em caso de uso demo/offline
      }
    },
    [postId, currentUserId, currentUserName, currentUserAvatar, onCommentCountChange]
  );

  const toggleLikeComment = useCallback(
    (commentId: number) => {
      const target = comments.find(c => c.id === commentId);
      const isCurrentlyLiked = target?.liked ?? false;

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

      if (isCurrentlyLiked) {
        likeService.descurtirComentario(commentId).catch(() => {});
      } else {
        likeService.curtirComentario(commentId).catch(() => {});
      }
    },
    [comments]
  );

  const reportComment = useCallback((commentId: number) => {
    setComments(prev =>
      prev
        .map(c => (c.id === commentId ? { ...c, reports: c.reports + 1 } : c))
        .filter(c => c.reports < 5)
    );
    comentarioService.denunciar(commentId).catch(() => {});
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
      comentarioService.remover(commentId).catch(() => {});
    },
    [onCommentCountChange]
  );

  return {
    comments,
    commentCount: comments.length,
    isOpen,
    isLoading,
    toggleOpen,
    addComment,
    toggleLikeComment,
    reportComment,
    deleteComment,
  };
}
