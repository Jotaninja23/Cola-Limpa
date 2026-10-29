import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('should render main title, slogan and key sections', () => {
    const handleNavigate = vi.fn();
    render(<LandingPage onNavigate={handleNavigate} isAuthenticated={false} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Cola Limpa' })).toBeInTheDocument();
    expect(screen.getByText(/Produtividade Acadêmica, Foco Gamificado e Aprendizagem Ativa/i)).toBeInTheDocument();
    expect(screen.getByText(/O Desafio e a Nossa Solução/i)).toBeInTheDocument();
    expect(screen.getByText(/Estratégias Baseadas em Evidências/i)).toBeInTheDocument();
    expect(screen.getByText(/Albert Einstein/i)).toBeInTheDocument();
  });

  it('should navigate to Pomodoro when hero CTA is clicked', () => {
    const handleNavigate = vi.fn();
    render(<LandingPage onNavigate={handleNavigate} isAuthenticated={false} />);

    const pomodoroCta = screen.getByRole('button', { name: /iniciar pomodoro/i });
    fireEvent.click(pomodoroCta);

    expect(handleNavigate).toHaveBeenCalledWith('pomodoro');
  });

  it('should navigate to Register when guest clicks Criar Conta', () => {
    const handleNavigate = vi.fn();
    render(<LandingPage onNavigate={handleNavigate} isAuthenticated={false} />);

    const registerCta = screen.getByRole('button', { name: /criar conta gratuita/i });
    fireEvent.click(registerCta);

    expect(handleNavigate).toHaveBeenCalledWith('register');
  });

  it('should navigate to Dashboard when authenticated user clicks progress button', () => {
    const handleNavigate = vi.fn();
    render(
      <LandingPage
        onNavigate={handleNavigate}
        isAuthenticated={true}
        userName="João Aluno"
      />
    );

    const dashboardCta = screen.getByRole('button', { name: /ver meu progresso/i });
    fireEvent.click(dashboardCta);

    expect(handleNavigate).toHaveBeenCalledWith('dashboard');
    expect(screen.getByText(/João Aluno/i)).toBeInTheDocument();
  });

  it('should navigate when quick nav cards are clicked', () => {
    const handleNavigate = vi.fn();
    render(<LandingPage onNavigate={handleNavigate} isAuthenticated={false} />);

    const communityCard = screen.getByRole('button', { name: /fórum colaborativo/i });
    fireEvent.click(communityCard);

    expect(handleNavigate).toHaveBeenCalledWith('community');
  });
});
