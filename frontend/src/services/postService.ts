import { apiClient } from './apiClient';
import type { Post, PostApiPayload, PostApiResponse } from '../types/post';

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

export function mapApiResponseToPost(res: PostApiResponse): Post {
  const initials = (res.usuarioNome || 'CL')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return {
    id: res.id,
    author: res.usuarioNome,
    authorId: res.usuarioId,
    avatar: initials || 'CL',
    time: formatRelativeTime(res.dataCriacao),
    tag: res.categoria,
    materia: res.materia,
    title: res.titulo,
    content: res.texto,
    likes: res.qtCurtidas || 0,
    comments: 0,
    liked: false,
    reports: res.qtDenuncias || 0,
  };
}

export const postService = {
  async listar(params?: { materia?: string; categoria?: string; usuarioId?: number }): Promise<Post[]> {
    const searchParams = new URLSearchParams();
    if (params?.materia) searchParams.set('materia', params.materia);
    if (params?.categoria && params.categoria !== 'Todos') searchParams.set('categoria', params.categoria);
    if (params?.usuarioId) searchParams.set('usuarioId', String(params.usuarioId));

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const responses = await apiClient<PostApiResponse[]>(`/api/posts${query}`);
    return responses.map(mapApiResponseToPost);
  },

  async buscarPorId(id: number): Promise<Post> {
    const res = await apiClient<PostApiResponse>(`/api/posts/${id}`);
    return mapApiResponseToPost(res);
  },

  async criar(payload: PostApiPayload): Promise<Post> {
    const res = await apiClient<PostApiResponse>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapApiResponseToPost(res);
  },

  async editar(id: number, payload: PostApiPayload): Promise<Post> {
    const res = await apiClient<PostApiResponse>(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapApiResponseToPost(res);
  },

  async remover(id: number): Promise<void> {
    await apiClient<void>(`/api/posts/${id}`, {
      method: 'DELETE',
    });
  },

  async denunciar(id: number): Promise<void> {
    await apiClient<void>(`/api/posts/${id}/denunciar`, {
      method: 'POST',
    });
  },
};

