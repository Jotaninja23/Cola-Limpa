import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UserMenu } from './UserMenu';
import * as UseAuthModule from '../../hooks/useAuth';
import type { AuthContextType } from '../../types/auth';

describe('UserMenu Component', () => {
  const baseMockAuth: AuthContextType = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isLoginModalOpen: false,
    loginPromptReason: null,
    solicitarCodigo: vi.fn(),
    validarCodigo: vi.fn(),
    loginComGoogle: vi.fn(),
    logout: vi.fn(),
    openLoginModal: vi.fn(),
    closeLoginModal: vi.fn(),
  };

  it('should render guest login button when unauthenticated', () => {
    vi.spyOn(UseAuthModule, 'useAuth').mockReturnValue(baseMockAuth);

    render(<UserMenu />);

    const loginBtn = screen.getByRole('button', { name: /entrar na conta/i });
    expect(loginBtn).toBeInTheDocument();
    expect(screen.getByText('Fazer Login')).toBeInTheDocument();

    fireEvent.click(loginBtn);
    expect(baseMockAuth.openLoginModal).toHaveBeenCalled();
  });

  it('should render user information, initials and logout button when authenticated', () => {
    const mockAuth: AuthContextType = {
      ...baseMockAuth,
      isAuthenticated: true,
      user: {
        id: 1,
        nome: 'Carlos Eduardo',
        email: 'carlos@etec.sp.gov.br',
        xp: 450,
        isAdmin: false,
        dataCriacao: '2026-10-29T10:00:00Z',
      },
    };
    vi.spyOn(UseAuthModule, 'useAuth').mockReturnValue(mockAuth);

    render(<UserMenu />);

    expect(screen.getByText('Carlos Eduardo')).toBeInTheDocument();
    expect(screen.getByText('carlos@etec.sp.gov.br')).toBeInTheDocument();
    expect(screen.getByText('CE')).toBeInTheDocument(); // Initials

    const logoutBtn = screen.getByRole('button', { name: /encerrar sessão/i });
    expect(logoutBtn).toBeInTheDocument();

    fireEvent.click(logoutBtn);
    expect(mockAuth.logout).toHaveBeenCalled();
  });

  it('should render admin badge when user is administrator', () => {
    const mockAuth: AuthContextType = {
      ...baseMockAuth,
      isAuthenticated: true,
      user: {
        id: 2,
        nome: 'Admin User',
        email: 'admin@colalimpa.com',
        xp: 999,
        isAdmin: true,
        dataCriacao: '2026-10-29T10:00:00Z',
      },
    };
    vi.spyOn(UseAuthModule, 'useAuth').mockReturnValue(mockAuth);

    render(<UserMenu />);

    expect(screen.getByTitle('Administrador')).toBeInTheDocument();
  });
});
