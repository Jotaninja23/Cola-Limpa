import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CreatePostModal from './CreatePostModal';

describe('CreatePostModal', () => {
  it('should not render anything when isOpen is false', () => {
    const { container } = render(
      <CreatePostModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render form fields when isOpen is true', () => {
    render(<CreatePostModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /criar nova publicação/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/título da publicação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/matéria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/conteúdo e explicação/i)).toBeInTheDocument();
  });

  it('should call onSubmit with entered data on valid submit', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <CreatePostModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/título da publicação/i), {
      target: { value: 'Resumo de Cinemática' },
    });
    fireEvent.change(screen.getByLabelText(/conteúdo e explicação/i), {
      target: { value: 'S = S0 + V*t é a fórmula do movimento uniforme.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        titulo: 'Resumo de Cinemática',
        texto: 'S = S0 + V*t é a fórmula do movimento uniforme.',
        categoria: 'Resumo',
        materia: 'Matemática',
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});

