import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EditProfileModal from './EditProfileModal';
import type { AuthUser } from '../types/auth';

describe('EditProfileModal', () => {
  const mockUser: AuthUser = {
    id: 1,
    nome: 'Carlos Drummond',
    email: 'carlos@etec.sp.gov.br',
    telefone: '(11) 99999-8888',
    metaDiariaMinutos: 90,
    xp: 200,
    isAdmin: false,
    dataCriacao: '2026-10-29T10:00:00Z',
  };

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <EditProfileModal isOpen={false} onClose={vi.fn()} user={mockUser} onSave={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should populate fields with user data', () => {
    render(<EditProfileModal isOpen={true} onClose={vi.fn()} user={mockUser} onSave={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /editar perfil/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue('Carlos Drummond');
    expect(screen.getByLabelText(/telefone \/ whatsapp/i)).toHaveValue('(11) 99999-8888');
    expect(screen.getByLabelText(/meta diária de estudo/i)).toHaveValue(90);
  });

  it('should trigger onSave with updated values', async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <EditProfileModal
        isOpen={true}
        onClose={handleClose}
        user={mockUser}
        onSave={handleSave}
      />
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), {
      target: { value: 'Carlos Drummond de Andrade' },
    });
    fireEvent.change(screen.getByLabelText(/meta diária de estudo/i), {
      target: { value: 120 },
    });

    fireEvent.click(screen.getByRole('button', { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith({
        nome: 'Carlos Drummond de Andrade',
        telefone: '(11) 99999-8888',
        fotoUrl: undefined,
        metaDiariaMinutos: 120,
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});

