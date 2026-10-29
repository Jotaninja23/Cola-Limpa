import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CommunityFeed from './CommunityFeed';
import * as UseAuthModule from '../hooks/useAuth';
import type { AuthContextType } from '../types/auth';

describe('CommunityFeed', () => {
  it('should render all initial categories and default posts', () => {
    render(<CommunityFeed />);

    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Matemática' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Português' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Química' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'História' })).toBeInTheDocument();

    expect(screen.getByText('Dica para resolver equações do 2º grau mais rápido!')).toBeInTheDocument();
    expect(screen.getByText('Resumo: Figuras de linguagem para a prova')).toBeInTheDocument();
  });

  it('should filter posts by selected category', () => {
    render(<CommunityFeed />);

    const mathCategoryBtn = screen.getByRole('button', { name: 'Matemática' });
    fireEvent.click(mathCategoryBtn);

    expect(screen.getByText('Dica para resolver equações do 2º grau mais rápido!')).toBeInTheDocument();
    expect(screen.queryByText('Resumo: Figuras de linguagem para a prova')).not.toBeInTheDocument();

    const allCategoryBtn = screen.getByRole('button', { name: 'Todos' });
    fireEvent.click(allCategoryBtn);

    expect(screen.getByText('Resumo: Figuras de linguagem para a prova')).toBeInTheDocument();
  });

  it('should toggle like status and update counter on post click', () => {
    render(<CommunityFeed />);

    const likeBtn = screen.getByRole('button', { name: /curtir publicação \(24 curtidas\)/i });
    expect(likeBtn).not.toHaveClass('liked');

    fireEvent.click(likeBtn);

    expect(screen.getByRole('button', { name: /descurtir publicação \(25 curtidas\)/i })).toHaveClass('liked');

    fireEvent.click(screen.getByRole('button', { name: /descurtir publicação \(25 curtidas\)/i }));

    expect(screen.getByRole('button', { name: /curtir publicação \(24 curtidas\)/i })).not.toHaveClass('liked');
  });

  it('should toggle comments section when clicking comment button', () => {
    render(<CommunityFeed />);

    const commentBtn = screen.getByRole('button', { name: /comentários \(2\)/i });
    expect(commentBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Comentários (2)')).not.toBeInTheDocument();

    fireEvent.click(commentBtn);

    expect(commentBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Comentários (2)')).toBeInTheDocument();
    expect(screen.getByText(/essa abordagem do discriminante como detector/i)).toBeInTheDocument();

    fireEvent.click(commentBtn);
    expect(screen.queryByText('Comentários (2)')).not.toBeInTheDocument();
  });

  it('should allow submitting a new comment and dynamically update comment count', () => {
    render(<CommunityFeed />);

    const commentBtn = screen.getByRole('button', { name: /comentários \(2\)/i });
    fireEvent.click(commentBtn);

    const textarea = screen.getByPlaceholderText(/adicione um comentário construtivo/i);
    fireEvent.change(textarea, { target: { value: 'Comentário interativo novinho' } });

    const submitBtn = screen.getByRole('button', { name: /publicar comentário/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Comentário interativo novinho')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /comentários \(3\)/i })).toBeInTheDocument();
  });

  it('should trigger login modal when unauthenticated visitor attempts to like or create post with requireAuthForActions enabled', () => {
    const mockOpenLogin = vi.fn();
    const mockAuth: AuthContextType = {
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
      openLoginModal: mockOpenLogin,
      closeLoginModal: vi.fn(),
    };
    vi.spyOn(UseAuthModule, 'useAuth').mockReturnValue(mockAuth);

    render(<CommunityFeed requireAuthForActions={true} />);

    // Attempt to click create post
    const createBtn = screen.getByRole('button', { name: /criar nova publicação/i });
    fireEvent.click(createBtn);
    expect(mockOpenLogin).toHaveBeenCalledWith('Entre para compartilhar seus resumos e dúvidas com a turma!');

    // Attempt to like post
    const likeBtn = screen.getByRole('button', { name: /curtir publicação \(24 curtidas\)/i });
    fireEvent.click(likeBtn);
    expect(mockOpenLogin).toHaveBeenCalledWith('Faça login para demonstrar seu apoio aos colegas!');
    // Counter should not have incremented
    expect(screen.getByRole('button', { name: /curtir publicação \(24 curtidas\)/i })).not.toHaveClass('liked');
  });

  it('should allow liking post directly when authenticated and requireAuthForActions is true', () => {
    const mockAuth: AuthContextType = {
      user: {
        id: 1,
        nome: 'Aluno Ativo',
        email: 'aluno@etec.sp.gov.br',
        xp: 100,
        isAdmin: false,
        dataCriacao: '2026-10-29T10:00:00Z',
      },
      token: 'jwt-dummy',
      isAuthenticated: true,
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
    vi.spyOn(UseAuthModule, 'useAuth').mockReturnValue(mockAuth);

    render(<CommunityFeed requireAuthForActions={true} />);

    const likeBtn = screen.getByRole('button', { name: /curtir publicação \(24 curtidas\)/i });
    fireEvent.click(likeBtn);

    expect(screen.getByRole('button', { name: /descurtir publicação \(25 curtidas\)/i })).toHaveClass('liked');
  });
});
