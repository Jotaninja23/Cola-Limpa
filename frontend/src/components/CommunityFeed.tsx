import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import type { Comment } from '../types/comment';
import PostCard, { type Post } from './PostCard';
import CreatePostModal from './CreatePostModal';
import { useAuth } from '../hooks/useAuth';
import { postService } from '../services/postService';
import { likeService } from '../services/likeService';

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: 'Ana Clara',
    authorId: 10,
    avatar: 'AC',
    time: 'Há 15 min',
    tag: 'Matemática',
    materia: 'Matemática',
    title: 'Dica para resolver equações do 2º grau mais rápido!',
    content: 'Pessoal, descobri uma forma muito mais rápida de usar a fórmula de Bhaskara. Ao invés de decorar, pensem no discriminante como o "detector" de raízes...',
    likes: 24,
    comments: 2,
    liked: false,
  },
  {
    id: 2,
    author: 'Pedro Henrique',
    authorId: 11,
    avatar: 'PH',
    time: 'Há 1h',
    tag: 'Português',
    materia: 'Português',
    title: 'Resumo: Figuras de linguagem para a prova',
    content: 'Fiz um mapa mental de todas as figuras de linguagem que caem com frequência. Metáfora, metonímia, catacrese, prosopopeia... Compartilhando com vocês!',
    likes: 42,
    comments: 1,
    liked: true,
  },
  {
    id: 3,
    author: 'Juliana Santos',
    authorId: 12,
    avatar: 'JS',
    time: 'Há 2h',
    tag: 'Química',
    materia: 'Química',
    title: 'Tabela periódica: como decorar os elementos?',
    content: 'Alguém tem dicas pra decorar a tabela periódica? Estou tentando usar músicas mas não acho nenhuma boa. Aceito sugestões!',
    likes: 18,
    comments: 0,
    liked: false,
  },
  {
    id: 4,
    author: 'Lucas Martins',
    authorId: 13,
    avatar: 'LM',
    time: 'Há 3h',
    tag: 'História',
    materia: 'História',
    title: 'Linha do tempo: Era Vargas simplificada',
    content: 'Montei uma linha do tempo super enxuta da Era Vargas, desde o governo provisório até o Estado Novo. Facilita muito na hora de organizar os eventos...',
    likes: 31,
    comments: 0,
    liked: false,
  },
];

const SAMPLE_COMMENTS: Record<number, Comment[]> = {
  1: [
    {
      id: 101,
      postId: 1,
      authorId: 2,
      authorName: 'Pedro Henrique',
      authorAvatar: 'PH',
      content: 'Essa abordagem do discriminante como detector faz todo o sentido, obrigado!',
      likes: 6,
      liked: false,
      reports: 0,
      createdAt: 'Há 12 min',
    },
    {
      id: 102,
      postId: 1,
      authorId: 3,
      authorName: 'Juliana Santos',
      authorAvatar: 'JS',
      content: 'Se o delta for negativo já nem precisa continuar calculando!',
      likes: 4,
      liked: true,
      reports: 0,
      createdAt: 'Há 8 min',
    },
  ],
  2: [
    {
      id: 201,
      postId: 2,
      authorId: 1,
      authorName: 'Ana Clara',
      authorAvatar: 'AC',
      content: 'Metonímia sempre cai nas provas, excelente síntese.',
      likes: 5,
      liked: false,
      reports: 0,
      createdAt: 'Há 45 min',
    },
  ],
};

const CATEGORIES = ['Todos', 'Matemática', 'Português', 'Química', 'História', 'Física', 'Biologia'];

export interface CommunityFeedProps {
  requireAuthForActions?: boolean;
}

export default function CommunityFeed({ requireAuthForActions = false }: CommunityFeedProps) {
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await postService.listar({
        categoria: activeCategory !== 'Todos' ? activeCategory : undefined,
      });
      if (data && data.length > 0) {
        setPosts(data);
      }
    } catch {
      // Fallback em caso de API offline
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleLike = (id: number) => {
    if (requireAuthForActions && !isAuthenticated) {
      openLoginModal('Faça login para demonstrar seu apoio aos colegas!');
      return;
    }

    const target = posts.find(p => p.id === id);
    const wasLiked = target?.liked ?? false;

    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

    if (wasLiked) {
      likeService.descurtirPost(id).catch(() => {});
    } else {
      likeService.curtirPost(id).catch(() => {});
    }
  };

  const handleCreatePostClick = () => {
    if (requireAuthForActions && !isAuthenticated) {
      openLoginModal('Entre para compartilhar seus resumos e dúvidas com a turma!');
      return;
    }
    setEditingPost(null);
    setIsCreateModalOpen(true);
  };

  const handleEditPostClick = (post: Post) => {
    setEditingPost(post);
    setIsCreateModalOpen(true);
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta publicação?')) return;
    setPosts(prev => prev.filter(p => p.id !== id));
    try {
      await postService.remover(id);
    } catch {
      // Deletado localmente
    }
  };

  const handleReportPost = async (id: number) => {
    try {
      await postService.denunciar(id);
      alert('Publicação denunciada. Obrigado por ajudar a manter nossa comunidade segura!');
    } catch {
      alert('Publicação reportada com sucesso!');
    }
  };

  const handleSavePost = async (data: { titulo: string; texto: string; categoria: string; materia: string }) => {
    if (editingPost) {
      setPosts(prev =>
        prev.map(p =>
          p.id === editingPost.id
            ? {
                ...p,
                title: data.titulo,
                content: data.texto,
                tag: data.categoria,
                materia: data.materia,
              }
            : p
        )
      );
      await postService.editar(editingPost.id, data);
    } else {
      const newLocalPost: Post = {
        id: Date.now(),
        author: user?.nome || 'Você',
        authorId: user?.id,
        avatar: (user?.nome || 'VC').substring(0, 2).toUpperCase(),
        time: 'Agora mesmo',
        tag: data.categoria,
        materia: data.materia,
        title: data.titulo,
        content: data.texto,
        likes: 0,
        comments: 0,
        liked: false,
      };
      setPosts(prev => [newLocalPost, ...prev]);
      try {
        const created = await postService.criar(data);
        setPosts(prev => prev.map(p => (p.id === newLocalPost.id ? created : p)));
      } catch {
        // Post otimista permanece
      }
    }
  };

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory !== 'Todos') {
      result = result.filter(
        p => p.tag === activeCategory || p.materia === activeCategory
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'popular') {
      return [...result].sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [posts, activeCategory, searchQuery, sortBy]);

  return (
    <div className="feed-wrapper">
      <div className="feed-header-actions" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="feed-search-bar" style={{ flex: 1, minWidth: 260, position: 'relative' }}>
          <Search size={18} className="search-icon" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="search"
            className="auth-input"
            placeholder="Pesquisar publicações, tópicos ou autores..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 40, width: '100%', height: 42 }}
            aria-label="Pesquisar publicações"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="feed-sort-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <SlidersHorizontal size={16} color="#777" />
            <select
              className="feed-sort-select auth-input"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'recent' | 'popular')}
              style={{ height: 42, padding: '0 12px' }}
              aria-label="Ordenar publicações"
            >
              <option value="recent">Mais Recentes</option>
              <option value="popular">Mais Populares</option>
            </select>
          </div>

          <button
            type="button"
            className="create-post-btn"
            onClick={handleCreatePostClick}
            aria-label="Criar nova publicação"
          >
            <Plus size={18} />
            <span>Criar Publicação</span>
          </button>
        </div>
      </div>

      <div className="feed-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            id={`feed-category-${cat.toLowerCase()}`}
            className={`feed-category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="feed-empty-state" style={{ textAlign: 'center', padding: '48px 20px', color: '#666' }}>
          <p>Nenhuma publicação encontrada para este filtro ou pesquisa.</p>
        </div>
      ) : (
        filteredPosts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            index={i}
            currentUserId={user?.id}
            isAdmin={Boolean(user?.isAdmin)}
            initialComments={SAMPLE_COMMENTS[post.id] ?? []}
            onToggleLike={toggleLike}
            onEditPost={handleEditPostClick}
            onDeletePost={handleDeletePost}
            onReportPost={handleReportPost}
          />
        ))
      )}

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleSavePost}
        editingPost={editingPost}
      />
    </div>
  );
}
