import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const defaultProps = {
    step: 'email' as const,
    emailSentTo: '',
    isLoading: false,
    error: null,
    onRequestOtp: vi.fn(),
    onVerifyOtp: vi.fn(),
    onLoginAsDemo: vi.fn(),
    onNavigateToRegister: vi.fn(),
    onNavigateHome: vi.fn(),
    onResetFlow: vi.fn(),
  };

  it('should render email form initially', () => {
    render(<LoginForm {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Acesso à Plataforma' })).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço de e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /solicitar código de acesso/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar com usuário de demonstração/i })).toBeInTheDocument();
  });

  it('should submit email when valid and requested', () => {
    const handleRequestOtp = vi.fn();
    render(<LoginForm {...defaultProps} onRequestOtp={handleRequestOtp} />);

    const emailInput = screen.getByLabelText(/endereço de e-mail/i);
    fireEvent.change(emailInput, { target: { value: 'estudante@etec.sp.gov.br' } });

    const submitBtn = screen.getByRole('button', { name: /solicitar código de acesso/i });
    fireEvent.click(submitBtn);

    expect(handleRequestOtp).toHaveBeenCalledWith('estudante@etec.sp.gov.br');
  });

  it('should render otp input when step is otp', () => {
    const handleVerifyOtp = vi.fn();
    render(
      <LoginForm
        {...defaultProps}
        step="otp"
        emailSentTo="teste@etec.sp.gov.br"
        onVerifyOtp={handleVerifyOtp}
      />
    );

    expect(screen.getByText(/teste@etec.sp.gov.br/i)).toBeInTheDocument();
    const codeInput = screen.getByLabelText(/código de 6 dígitos/i);
    fireEvent.change(codeInput, { target: { value: '654321' } });

    const confirmBtn = screen.getByRole('button', { name: /confirmar e entrar/i });
    fireEvent.click(confirmBtn);

    expect(handleVerifyOtp).toHaveBeenCalledWith('654321');
  });

  it('should trigger login as demo user', () => {
    const handleDemo = vi.fn();
    render(<LoginForm {...defaultProps} onLoginAsDemo={handleDemo} />);

    const demoBtn = screen.getByRole('button', { name: /entrar com usuário de demonstração/i });
    fireEvent.click(demoBtn);

    expect(handleDemo).toHaveBeenCalledTimes(1);
  });

  it('should display error message when present', () => {
    render(<LoginForm {...defaultProps} error="Código de verificação incorreto." />);

    expect(screen.getByRole('alert')).toHaveTextContent('Código de verificação incorreto.');
  });
});
