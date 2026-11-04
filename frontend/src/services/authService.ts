import { apiClient } from './apiClient';
import type { AuthUser, TokenResponse } from '../types/auth';

export const authService = {
  async solicitarCodigo(email: string): Promise<void> {
    await apiClient<void>('/api/auth/solicitar-codigo', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async validarCodigo(email: string, codigo: string): Promise<TokenResponse> {
    return apiClient<TokenResponse>('/api/auth/validar-codigo', {
      method: 'POST',
      body: JSON.stringify({ email, codigo }),
    });
  },

  async loginComGoogle(idToken: string): Promise<TokenResponse> {
    return apiClient<TokenResponse>('/api/auth/sso/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },

  async obterPerfilAtual(): Promise<AuthUser> {
    return apiClient<AuthUser>('/api/usuarios/perfil');
  },

  async atualizarPerfil(id: number, data: { nome?: string; email?: string; telefone?: string; fotoUrl?: string; metaDiariaMinutos?: number }): Promise<AuthUser> {
    return apiClient<AuthUser>(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

