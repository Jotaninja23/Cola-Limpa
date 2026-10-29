import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RegisterForm from './RegisterForm';

describe('RegisterForm', () => {
  const defaultProps = {
    isLoading: false,
    error: null,
    onRegister: vi.fn(),
    onNavigateToLogin: vi.fn(),
    onNavigateHome: vi.fn(),
  };

  it('should render registration fields properly', () => {
    render(<RegisterForm {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Cadastro de Estudante' })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço de e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nível escolar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/meta diária de foco/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finalizar cadastro e entrar/i })).toBeInTheDocument();
  });

  it('should submit registration with filled data', () => {
    const handleRegister = vi.fn();
    render(<RegisterForm {...defaultProps} onRegister={handleRegister} />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: 'Carlos Silva' },
    });
    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), {
      target: { value: 'carlos@escola.sp.gov.br' },
    });
    fireEvent.change(screen.getByLabelText(/meta diária de foco/i), {
      target: { value: '120' },
    });

    fireEvent.click(screen.getByRole('button', { name: /finalizar cadastro e entrar/i }));

    expect(handleRegister).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Carlos Silva',
        email: 'carlos@escola.sp.gov.br',
        metaDiariaMinutos: 120,
      })
    );
  });

  it('should navigate to login when login link is clicked', () => {
    const handleNavigateToLogin = vi.fn();
    render(<RegisterForm {...defaultProps} onNavigateToLogin={handleNavigateToLogin} />);

    const loginLink = screen.getByRole('button', { name: /fazer login/i });
    fireEvent.click(loginLink);

    expect(handleNavigateToLogin).toHaveBeenCalledTimes(1);
  });
});
