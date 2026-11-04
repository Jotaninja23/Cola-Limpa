import { apiClient } from './apiClient';

export interface LikeResponse {
  id: number;
  usuarioId: number;
  postId?: number | null;
  comentarioId?: number | null;
  dataCriacao: string;
}

export const likeService = {
  async curtirPost(postId: number): Promise<LikeResponse> {
    return apiClient<LikeResponse>('/api/likes', {
      method: 'POST',
      body: JSON.stringify({ postId }),
    });
  },

  async descurtirPost(postId: number): Promise<void> {
    await apiClient<void>(`/api/likes/post/${postId}`, {
      method: 'DELETE',
    });
  },

  async curtirComentario(comentarioId: number): Promise<LikeResponse> {
    return apiClient<LikeResponse>('/api/likes', {
      method: 'POST',
      body: JSON.stringify({ comentarioId }),
    });
  },

  async descurtirComentario(comentarioId: number): Promise<void> {
    await apiClient<void>(`/api/likes/comentario/${comentarioId}`, {
      method: 'DELETE',
    });
  },
};

