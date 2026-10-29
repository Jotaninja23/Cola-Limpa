import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('should render application logo, navigation, and default landing page', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: 'Cola Limpa' })).toBeInTheDocument();
    expect(screen.getByText('Estudos Gamificados')).toBeInTheDocument();
    expect(screen.getByText(/Produtividade Acadêmica, Foco Gamificado e Aprendizagem Ativa/i)).toBeInTheDocument();

    expect(screen.getByText(/Nível 1/)).toBeInTheDocument();
    expect(screen.getByText('350/500')).toBeInTheDocument();
    expect(screen.getByText('350 XP total')).toBeInTheDocument();
  });

  it('should navigate to Pomodoro page when clicked', () => {
    render(<App />);

    const pomodoroNavBtn = screen.getByRole('button', { name: /^pomodoro$/i });
    fireEvent.click(pomodoroNavBtn);

    expect(screen.getByRole('heading', { level: 2, name: 'Pomodoro' })).toBeInTheDocument();
    expect(screen.getByText('Mantenha o foco e ganhe experiência em cada ciclo concluído')).toBeInTheDocument();
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('should navigate to Comunidade page when clicked', () => {
    render(<App />);

    const communityNavBtn = screen.getByRole('button', { name: /^comunidade$/i });
    fireEvent.click(communityNavBtn);

    expect(screen.getByRole('heading', { level: 2, name: 'Comunidade' })).toBeInTheDocument();
    expect(screen.getByText('Compartilhe dicas, sínteses e aprenda em conjunto')).toBeInTheDocument();
    expect(screen.getByText('Dica para resolver equações do 2º grau mais rápido!')).toBeInTheDocument();
  });

  it('should navigate to Dashboard page when clicked', () => {
    render(<App />);

    const dashboardNavBtn = screen.getByRole('button', { name: /^dashboard$/i });
    fireEvent.click(dashboardNavBtn);

    expect(screen.getByRole('heading', { level: 2, name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Acompanhe seu progresso, metas diárias e assiduidade')).toBeInTheDocument();
    expect(screen.getByText('Tempo de Estudo Semanal')).toBeInTheDocument();
  });

  it('should navigate to Login page and authenticate via demo button', () => {
    render(<App />);

    const loginBtn = screen.getByRole('button', { name: /^entrar$/i });
    fireEvent.click(loginBtn);

    expect(screen.getByRole('heading', { name: 'Acesso à Plataforma' })).toBeInTheDocument();

    const demoBtn = screen.getByRole('button', { name: /entrar com usuário de demonstração/i });
    fireEvent.click(demoBtn);

    expect(screen.getByRole('heading', { level: 2, name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Estudante ETEC')).toBeInTheDocument();
  });

  it('should navigate to Register page when clicking Cadastrar', () => {
    render(<App />);

    const registerBtn = screen.getByRole('button', { name: /^cadastrar$/i });
    fireEvent.click(registerBtn);

    expect(screen.getByRole('heading', { name: 'Cadastro de Estudante' })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
  });
});
