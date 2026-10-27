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

    const likeBtn = screen.getByRole('button', { name: /24/i });
    expect(likeBtn).not.toHaveClass('liked');

    fireEvent.click(likeBtn);

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /25/i })).toHaveClass('liked');

    fireEvent.click(screen.getByRole('button', { name: /25/i }));

    expect(screen.getByText('24')).toBeInTheDocument();
  });
});
