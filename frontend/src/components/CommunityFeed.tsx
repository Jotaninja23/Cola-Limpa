import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  tag: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
}

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
    comments: 8,
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
    comments: 15,
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
    comments: 22,
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
    comments: 6,
    liked: false,
  },
];

const CATEGORIES = ['Todos', 'Matemática', 'Português', 'Química', 'História', 'Física', 'Biologia'];

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const toggleLike = (id: number) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const filteredPosts = activeCategory === 'Todos'
    ? posts
    : posts.filter(p => p.tag === activeCategory);

  return (
    <div className="feed-wrapper">
      {/* Category Filter */}
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

      {/* Posts */}
      {filteredPosts.map((post, i) => (
        <article
          key={post.id}
          className="post-card"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="post-card-header">
            <div className="post-avatar">{post.avatar}</div>
            <div className="post-author-info">
              <div className="post-author-name">{post.author}</div>
              <div className="post-time">{post.time}</div>
            </div>
            <span className="post-tag">{post.tag}</span>
          </div>
          <div className="post-card-body">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
          <div className="post-card-footer">
            <button
              id={`like-btn-${post.id}`}
              className={`post-action-btn ${post.liked ? 'liked' : ''}`}
              onClick={() => toggleLike(post.id)}
            >
              <Heart size={18} />
              <span>{post.likes}</span>
            </button>
            <button className="post-action-btn">
              <MessageCircle size={18} />
              <span>{post.comments}</span>
            </button>
            <button className="post-action-btn">
              <Share2 size={18} />
            </button>
            <button className="post-action-btn" style={{ marginLeft: 'auto' }}>
              <Bookmark size={18} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
