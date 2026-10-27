import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CommunityFeed from './CommunityFeed';

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
});
