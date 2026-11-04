import { apiClient } from './apiClient';
import type { Comment } from '../types/comment';

export interface ComentarioApiResponse {
  id: number;
  postId: number;
  usuarioId: number;
  usuarioNome: string;
  usuarioFotoUrl?: string | null;
  texto: string;
  qtCurtidas: number;
  qtDenuncias: number;
  dataCriacao: string;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Agora mesmo';
    if (diffMinutes < 60) return `Há ${diffMinutes} min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays === 1) return 'Ontem';
    return `Há ${diffDays} dias`;
  } catch {
    return 'Recente';
  }
}

export function mapApiResponseToComment(res: ComentarioApiResponse): Comment {
  const initials = (res.usuarioNome || 'CL')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return {
    id: res.id,
    postId: res.postId,
    authorId: res.usuarioId,
    authorName: res.usuarioNome,
    authorAvatar: initials || 'CL',
    content: res.texto,
    likes: res.qtCurtidas || 0,
    liked: false,
    reports: res.qtDenuncias || 0,
    createdAt: formatRelativeTime(res.dataCriacao),
  };
}

export const comentarioService = {
  async listarPorPost(postId: number): Promise<Comment[]> {
    const responses = await apiClient<ComentarioApiResponse[]>(`/api/comentarios/post/${postId}`);
    return responses.map(mapApiResponseToComment);
  },

  async criar(postId: number, texto: string): Promise<Comment> {
    const res = await apiClient<ComentarioApiResponse>('/api/comentarios', {
      method: 'POST',
      body: JSON.stringify({ postId, texto }),
    });
    return mapApiResponseToComment(res);
  },

  async remover(id: number): Promise<void> {
    await apiClient<void>(`/api/comentarios/${id}`, {
      method: 'DELETE',
    });
  },

  async denunciar(id: number): Promise<void> {
    await apiClient<void>(`/api/comentarios/${id}/denunciar`, {
      method: 'POST',
    });
  },
};

