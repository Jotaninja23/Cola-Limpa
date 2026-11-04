import React, { useState } from 'react';
import { X, Send, BookOpen, Tag } from 'lucide-react';
import type { Post } from '../types/post';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { titulo: string; texto: string; categoria: string; materia: string }) => Promise<void>;
  editingPost?: Post | null;
}

const MATERIAS = ['Matemática', 'Português', 'Química', 'História', 'Física', 'Biologia'];
const CATEGORIAS = ['Resumo', 'Dica de Estudo', 'Dúvida', 'Exercício'];

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  editingPost = null,
}: CreatePostModalProps) {
  const [titulo, setTitulo] = useState(editingPost?.title || '');
  const [materia, setMateria] = useState(editingPost?.materia || 'Matemática');
  const [categoria, setCategoria] = useState(editingPost?.tag || 'Resumo');
  const [texto, setTexto] = useState(editingPost?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Informe um título para a publicação.');
      return;
    }
    if (!texto.trim()) {
      setError('Escreva o conteúdo da sua publicação.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        titulo: titulo.trim(),
        texto: texto.trim(),
        categoria,
        materia,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar a publicação.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="post-modal-title">
      <div className="auth-modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
        <div className="auth-modal-header">
          <h2 id="post-modal-title" className="auth-modal-title">
            {editingPost ? 'Editar Publicação' : 'Criar Nova Publicação'}
          </h2>
          <button type="button" className="auth-modal-close" onClick={onClose} aria-label="Fechar janela">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {error && (
            <div className="auth-error-alert" role="alert">
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label htmlFor="post-titulo" className="auth-label">Título da Publicação</label>
            <input
              id="post-titulo"
              type="text"
              className="auth-input"
              placeholder="Ex: Resumo prático de Estequiometria"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="form-group">
              <label htmlFor="post-materia" className="auth-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <BookOpen size={14} /> Matéria
                </span>
              </label>
              <select
                id="post-materia"
                className="auth-input"
                value={materia}
                onChange={e => setMateria(e.target.value)}
              >
                {MATERIAS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="post-categoria" className="auth-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Tag size={14} /> Categoria
                </span>
              </label>
              <select
                id="post-categoria"
                className="auth-input"
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label htmlFor="post-texto" className="auth-label">Conteúdo e Explicação</label>
            <textarea
              id="post-texto"
              className="auth-input"
              rows={6}
              placeholder="Compartilhe seu resumo, fórmula, dúvida ou macete de vestibular..."
              value={texto}
              onChange={e => setTexto(e.target.value)}
              required
              style={{ resize: 'vertical', minHeight: 120 }}
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
              <Send size={16} />
              <span>{isSubmitting ? 'Publicando...' : editingPost ? 'Salvar Alterações' : 'Publicar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

