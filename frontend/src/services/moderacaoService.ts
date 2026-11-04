import { apiClient } from './apiClient';
import type { Post, PostApiResponse } from '../types/post';
import type { Comment } from '../types/comment';
import { mapApiResponseToPost } from './postService';
import { mapApiResponseToComment, type ComentarioApiResponse } from './comentarioService';

export const moderacaoService = {
  async listarPostsOcultados(): Promise<Post[]> {
    const responses = await apiClient<PostApiResponse[]>('/api/moderacao/posts');
    return responses.map(mapApiResponseToPost);
  },

  async aprovarPost(id: number): Promise<Post> {
    const res = await apiClient<PostApiResponse>(`/api/moderacao/posts/${id}/aprovar`, {
      method: 'POST',
    });
    return mapApiResponseToPost(res);
  },

  async removerPostDefinitivo(id: number): Promise<void> {
    await apiClient<void>(`/api/moderacao/posts/${id}`, {
      method: 'DELETE',
    });
  },

  async listarComentariosOcultados(): Promise<Comment[]> {
    const responses = await apiClient<ComentarioApiResponse[]>('/api/moderacao/comentarios');
    return responses.map(mapApiResponseToComment);
  },

  async aprovarComentario(id: number): Promise<Comment> {
    const res = await apiClient<ComentarioApiResponse>(`/api/moderacao/comentarios/${id}/aprovar`, {
      method: 'POST',
    });
    return mapApiResponseToComment(res);
  },

  async removerComentarioDefinitivo(id: number): Promise<void> {
    await apiClient<void>(`/api/moderacao/comentarios/${id}`, {
      method: 'DELETE',
    });
  },
};

