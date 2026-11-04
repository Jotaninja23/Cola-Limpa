import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthProvider } from './AuthContext';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    solicitarCodigo: vi.fn(),
    validarCodigo: vi.fn(),
    loginComGoogle: vi.fn(),
    obterPerfil: vi.fn(),
  },
}));

describe('AuthContext and useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with guest (unauthenticated) state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should open and close login modal with reasons', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    act(() => {
      result.current.openLoginModal('Faça login para curtir');
    });

    expect(result.current.isLoginModalOpen).toBe(true);
    expect(result.current.loginPromptReason).toBe('Faça login para curtir');

    act(() => {
      result.current.closeLoginModal();
    });

    expect(result.current.isLoginModalOpen).toBe(false);
    expect(result.current.loginPromptReason).toBeNull();
  });

  it('should successfully validate code and persist user and token', async () => {
    const mockUser = {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@etec.sp.gov.br',
      xp: 200,
      isAdmin: false,
      dataCriacao: '2026-10-29T10:00:00Z',
    };
    vi.mocked(authService.validarCodigo).mockResolvedValue({
      token: 'jwt-valid-token-123',
      usuario: mockUser,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.validarCodigo('maria@etec.sp.gov.br', '123456');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('jwt-valid-token-123');
    expect(localStorage.getItem('cola_limpa_token')).toBe('jwt-valid-token-123');
    expect(localStorage.getItem('cola_limpa_user')).toBe(JSON.stringify(mockUser));
  });

  it('should logout and clear localStorage', async () => {
    localStorage.setItem('cola_limpa_token', 'jwt-token');
    localStorage.setItem(
      'cola_limpa_user',
      JSON.stringify({ id: 1, nome: 'User', email: 'user@test.com', xp: 50, isAdmin: false, dataCriacao: '' })
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('cola_limpa_token')).toBeNull();
    expect(localStorage.getItem('cola_limpa_user')).toBeNull();
  });

  it('should handle cola_limpa_unauthorized event by logging out and prompting modal', () => {
    localStorage.setItem('cola_limpa_token', 'expired-token');
    localStorage.setItem(
      'cola_limpa_user',
      JSON.stringify({ id: 1, nome: 'User', email: 'user@test.com', xp: 50, isAdmin: false, dataCriacao: '' })
    );

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      window.dispatchEvent(new CustomEvent('cola_limpa_unauthorized'));
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoginModalOpen).toBe(true);
    expect(result.current.loginPromptReason).toContain('expirou');
  });
});
