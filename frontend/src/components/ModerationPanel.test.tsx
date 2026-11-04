import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModerationPanel from './ModerationPanel';
import { moderacaoService } from '../services/moderacaoService';

describe('ModerationPanel', () => {
  it('should render moderation header and empty state when no reported posts exist', async () => {
    vi.spyOn(moderacaoService, 'listarPostsOcultados').mockResolvedValue([]);
    render(<ModerationPanel />);

    expect(screen.getByRole('heading', { name: /painel de moderação comunitária/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/nenhuma publicação aguardando despacho da moderação/i)).toBeInTheDocument();
    });
  });

  it('should list reported posts and allow approving', async () => {
    vi.spyOn(moderacaoService, 'listarPostsOcultados').mockResolvedValue([
      {
        id: 99,
        author: 'Spammer',
        authorId: 88,
        avatar: 'SP',
        time: 'Há 5 min',
        tag: 'Dúvida',
        title: 'Post Suspeito Reportado',
        content: 'Conteúdo que acumulou denúncias',
        likes: 0,
        comments: 0,
        liked: false,
        reports: 6,
      },
    ]);
    const aprovarSpy = vi.spyOn(moderacaoService, 'aprovarPost').mockResolvedValue({
      id: 99,
      author: 'Spammer',
      avatar: 'SP',
      time: 'Há 5 min',
      tag: 'Dúvida',
      title: 'Post Suspeito Reportado',
      content: 'Conteúdo que acumulou denúncias',
      likes: 0,
      comments: 0,
      liked: false,
    });

    render(<ModerationPanel />);

    await waitFor(() => {
      expect(screen.getByText('Post Suspeito Reportado')).toBeInTheDocument();
      expect(screen.getByText('6 denúncias')).toBeInTheDocument();
    });

    const aprovarBtn = screen.getByRole('button', { name: /aprovar & restaurar/i });
    fireEvent.click(aprovarBtn);

    await waitFor(() => {
      expect(aprovarSpy).toHaveBeenCalledWith(99);
      expect(screen.queryByText('Post Suspeito Reportado')).not.toBeInTheDocument();
    });
  });
});

