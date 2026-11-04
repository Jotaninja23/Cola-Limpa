import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CommentForm from './CommentForm';

describe('CommentForm', () => {
  it('should render textarea and disabled submit button initially', () => {
    render(<CommentForm postId={1} onSubmit={vi.fn()} />);

    expect(
      screen.getByPlaceholderText(/adicione um comentário construtivo/i)
    ).toBeInTheDocument();
    expect(screen.getByText('0/1000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publicar comentário/i })).toBeDisabled();
  });

  it('should enable submit button and update char count when typing', () => {
    render(<CommentForm postId={1} onSubmit={vi.fn()} />);

    const textarea = screen.getByPlaceholderText(/adicione um comentário construtivo/i);
    fireEvent.change(textarea, { target: { value: 'Comentário legal' } });

    expect(screen.getByText('16/1000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publicar comentário/i })).toBeEnabled();
  });

  it('should submit form and reset textarea when valid', async () => {
    const handleSubmit = vi.fn();
    render(<CommentForm postId={1} onSubmit={handleSubmit} />);

    const textarea = screen.getByPlaceholderText(/adicione um comentário construtivo/i);
    fireEvent.change(textarea, { target: { value: 'Dica excelente' } });

    const submitBtn = screen.getByRole('button', { name: /publicar comentário/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith('Dica excelente');
    expect(textarea).toHaveValue('');
    expect(screen.getByText('0/1000')).toBeInTheDocument();
  });

  it('should submit on Ctrl+Enter keyboard shortcut', () => {
    const handleSubmit = vi.fn();
    render(<CommentForm postId={1} onSubmit={handleSubmit} />);

    const textarea = screen.getByPlaceholderText(/adicione um comentário construtivo/i);
    fireEvent.change(textarea, { target: { value: 'Dica rápida' } });

    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

    expect(handleSubmit).toHaveBeenCalledWith('Dica rápida');
  });

  it('should disable textarea and button when isSubmitting is true', () => {
    render(<CommentForm postId={1} onSubmit={vi.fn()} isSubmitting={true} />);

    const textarea = screen.getByPlaceholderText(/adicione um comentário construtivo/i);
    expect(textarea).toBeDisabled();
    expect(screen.getByRole('button', { name: /publicar comentário/i })).toBeDisabled();
  });
});

