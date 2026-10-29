import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Comment } from '../types/comment';
import PostCard, { type Post } from './PostCard';
import { useAuth } from '../hooks/useAuth';

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: 'Ana Clara',
    avatar: 'AC',
    time: 'Há 15 min',
    tag: 'Matemática',
    title: 'Dica para resolver equações do 2º grau mais rápido!',
    content: 'Pessoal, descobri uma forma muito mais rápida de usar a fórmula de Bhaskara. Ao invés de decorar, pensem no discriminante como o "detector" de raízes...',
    likes: 24,
    comments: 2,
    liked: false,
  },
  {
    id: 2,
    author: 'Pedro Henrique',
    avatar: 'PH',
    time: 'Há 1h',
    tag: 'Português',
    title: 'Resumo: Figuras de linguagem para a prova',
    content: 'Fiz um mapa mental de todas as figuras de linguagem que caem com frequência. Metáfora, metonímia, catacrese, prosopopeia... Compartilhando com vocês!',
    likes: 42,
    comments: 1,
    liked: true,
  },
  {
    id: 3,
    author: 'Juliana Santos',
    avatar: 'JS',
    time: 'Há 2h',
    tag: 'Química',
    title: 'Tabela periódica: como decorar os elementos?',
    content: 'Alguém tem dicas pra decorar a tabela periódica? Estou tentando usar músicas mas não acho nenhuma boa. Aceito sugestões!',
    likes: 18,
    comments: 0,
    liked: false,
  },
  {
    id: 4,
    author: 'Lucas Martins',
    avatar: 'LM',
    time: 'Há 3h',
    tag: 'História',
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
  const { isAuthenticated, openLoginModal } = useAuth();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const toggleLike = (id: number) => {
    if (requireAuthForActions && !isAuthenticated) {
      openLoginModal('Faça login para demonstrar seu apoio aos colegas!');
      return;
    }
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleCreatePost = () => {
    if (requireAuthForActions && !isAuthenticated) {
      openLoginModal('Entre para compartilhar seus resumos e dúvidas com a turma!');
      return;
    }
    alert('Funcionalidade de publicação conectada! Digite seu resumo.');
  };

  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(p => p.tag === activeCategory);

  return (
    <div className="feed-wrapper">
      <div className="feed-header-actions">
        <button
          type="button"
          className="create-post-btn"
          onClick={handleCreatePost}
          aria-label="Criar nova publicação"
        >
          <Plus size={18} />
          <span>Criar Publicação</span>
        </button>
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

      {filteredPosts.map((post, i) => (
        <PostCard
          key={post.id}
          post={post}
          index={i}
          initialComments={SAMPLE_COMMENTS[post.id] ?? []}
          onToggleLike={toggleLike}
        />
      ))}
    </div>
  );
}
