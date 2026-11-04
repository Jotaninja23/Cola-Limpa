import React, { useState } from 'react';
import { X, User, Phone, Target, Image as ImageIcon, Save } from 'lucide-react';
import type { AuthUser } from '../types/auth';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onSave: (data: { nome: string; telefone?: string; fotoUrl?: string; metaDiariaMinutos?: number }) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditProfileModalProps) {
  const [nome, setNome] = useState(user.nome || '');
  const [telefone, setTelefone] = useState(user.telefone || '');
  const [fotoUrl, setFotoUrl] = useState(user.fotoUrl || '');
  const [metaDiariaMinutos, setMetaDiariaMinutos] = useState(user.metaDiariaMinutos || 90);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError('O nome não pode ficar em branco.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSave({
        nome: nome.trim(),
        telefone: telefone.trim() || undefined,
        fotoUrl: fotoUrl.trim() || undefined,
        metaDiariaMinutos: Number(metaDiariaMinutos) || 90,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao atualizar o perfil.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
      <div className="auth-modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="auth-modal-header">
          <h2 id="profile-modal-title" className="auth-modal-title">Editar Perfil</h2>
          <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Fechar janela">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {error && (
            <div className="auth-error-alert" role="alert">
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label htmlFor="profile-nome" className="auth-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <User size={15} /> Nome Completo
              </span>
            </label>
            <input
              id="profile-nome"
              type="text"
              className="auth-input"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label htmlFor="profile-telefone" className="auth-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Phone size={15} /> Telefone / WhatsApp (Opcional)
              </span>
            </label>
            <input
              id="profile-telefone"
              type="tel"
              className="auth-input"
              placeholder="(11) 98765-4321"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label htmlFor="profile-meta" className="auth-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Target size={15} /> Meta Diária de Estudo (Minutos)
              </span>
            </label>
            <input
              id="profile-meta"
              type="number"
              min={15}
              max={960}
              step={15}
              className="auth-input"
              value={metaDiariaMinutos}
              onChange={e => setMetaDiariaMinutos(Number(e.target.value))}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label htmlFor="profile-foto" className="auth-label">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ImageIcon size={15} /> URL da Imagem de Perfil (Opcional)
              </span>
            </label>
            <input
              id="profile-foto"
              type="url"
              className="auth-input"
              placeholder="https://exemplo.com/minha-foto.png"
              value={fotoUrl}
              onChange={e => setFotoUrl(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

