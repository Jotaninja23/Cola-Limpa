import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('should render application logo, navigation, and default Pomodoro page', () => {
    render(<App />);

    expect(screen.getByText('Cola Limpa')).toBeInTheDocument();
    expect(screen.getByText('Estudos Gamificados')).toBeInTheDocument();

    expect(screen.getByText('🍅 Pomodoro')).toBeInTheDocument();
    expect(screen.getByText('Mantenha o foco, ganhe XP!')).toBeInTheDocument();

    expect(screen.getByText('⭐ Nível 1')).toBeInTheDocument();
    expect(screen.getByText('350/500')).toBeInTheDocument();
    expect(screen.getByText('350 XP total')).toBeInTheDocument();
  });

  it('should navigate to Comunidade page when clicked', () => {
    render(<App />);

    const communityNavBtn = screen.getByRole('button', { name: /comunidade/i });
    fireEvent.click(communityNavBtn);

    expect(screen.getByText('💬 Comunidade')).toBeInTheDocument();
    expect(screen.getByText('Compartilhe dicas e aprenda junto')).toBeInTheDocument();
    expect(screen.getByText('Dica para resolver equações do 2º grau mais rápido!')).toBeInTheDocument();
  });

  it('should navigate to Dashboard page when clicked', () => {
    render(<App />);

    const dashboardNavBtn = screen.getByRole('button', { name: /dashboard/i });
    fireEvent.click(dashboardNavBtn);

    expect(screen.getByText('📊 Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Acompanhe seu progresso')).toBeInTheDocument();
    expect(screen.getByText('📈 Tempo de Estudo Semanal')).toBeInTheDocument();
  });
});

