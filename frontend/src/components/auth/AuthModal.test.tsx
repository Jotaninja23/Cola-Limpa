import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AuthModal } from './AuthModal';
import * as UseAuthModule from '../../hooks/useAuth';
import { DEFAULT_AUTH_CONTEXT } from '../../context/authContextDef';
import type { AuthContextType } from '../../types/auth';

describe('AuthModal Component', () => {
  let mockAuth: AuthContextType;

  beforeEach(() => {
    mockAuth = {
      ...DEFAULT_AUTH_CONTEXT,
      isLoginModalOpen: true,
      loginPromptReason: 'Faça login para continuar',
      solicitarCodigo: vi.fn().mockResolvedValue(undefined),
      validarCodigo: vi.fn().mockResolvedValue(undefined),
      loginComGoogle: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn(),
      openLoginModal: vi.fn(),
      closeLoginModal: vi.fn(),
    };
    vi.spyOn(UseAuthModule, 'useAuth').mockReturnValue(mockAuth);
  });

  it('should not render anything when isLoginModalOpen is false', () => {
    vi.spyOn(UseAuthModule, 'useAuth').mockReturnValue({
      ...mockAuth,
      isLoginModalOpen: false,
    });

    const { container } = render(<AuthModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render modal with prompt reason and email input step', () => {
    render(<AuthModal />);

    expect(screen.getByText('Entre no Cola Limpa')).toBeInTheDocument();
    expect(screen.getByText('Faça login para continuar')).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail de estudante/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /receber código de acesso/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar com google/i })).toBeInTheDocument();
  });

  it('should close modal when clicking close button or pressing Escape', () => {
    render(<AuthModal />);

    const closeBtn = screen.getByRole('button', { name: /fechar janela de login/i });
    fireEvent.click(closeBtn);
    expect(mockAuth.closeLoginModal).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockAuth.closeLoginModal).toHaveBeenCalledTimes(2);
  });

  it('should advance to OTP step after submitting valid email', async () => {
    render(<AuthModal />);

    const emailInput = screen.getByLabelText(/e-mail de estudante/i);
    fireEvent.change(emailInput, { target: { value: 'estudante@etec.sp.gov.br' } });

    const submitBtn = screen.getByRole('button', { name: /receber código de acesso/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockAuth.solicitarCodigo).toHaveBeenCalledWith('estudante@etec.sp.gov.br');
    });

    expect(screen.getByText('Código de Confirmação')).toBeInTheDocument();
    expect(screen.getByText('estudante@etec.sp.gov.br')).toBeInTheDocument();
  });

  it('should allow returning to email step by clicking trocar e-mail', async () => {
    render(<AuthModal />);

    const emailInput = screen.getByLabelText(/e-mail de estudante/i);
    fireEvent.change(emailInput, { target: { value: 'aluno@etec.sp.gov.br' } });
    fireEvent.click(screen.getByRole('button', { name: /receber código de acesso/i }));

    await waitFor(() => {
      expect(screen.getByText('Código de Confirmação')).toBeInTheDocument();
    });

    const backBtn = screen.getByRole('button', { name: /voltar para alteração de e-mail/i });
    fireEvent.click(backBtn);

    expect(screen.getByText('Entre no Cola Limpa')).toBeInTheDocument();
  });

  it('should trigger Google login when clicking Google button', () => {
    render(<AuthModal />);

    const googleBtn = screen.getByRole('button', { name: /continuar com google/i });
    fireEvent.click(googleBtn);

    expect(mockAuth.loginComGoogle).toHaveBeenCalled();
  });
});
