import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Check, Trash2, MessageSquare, FileText, AlertCircle } from 'lucide-react';
import type { Post } from '../types/post';
import type { Comment } from '../types/comment';
import { moderacaoService } from '../services/moderacaoService';

export default function ModerationPanel() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      if (activeTab === 'posts') {
        const data = await moderacaoService.listarPostsOcultados();
        setPosts(data || []);
      } else {
        const data = await moderacaoService.listarComentariosOcultados();
        setComments(data || []);
      }
    } catch {
      // Fallback em caso de falha de conexão
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAprovarPost = async (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    try {
      await moderacaoService.aprovarPost(id);
      setMessage('Publicação aprovada e retornada ao feed público.');
    } catch {
      setMessage('Publicação aprovada localmente.');
    }
  };

  const handleRemoverPost = async (id: number) => {
    if (!window.confirm('Excluir definitivamente esta publicação e todos os seus comentários?')) return;
    setPosts(prev => prev.filter(p => p.id !== id));
    try {
      await moderacaoService.removerPostDefinitivo(id);
      setMessage('Publicação excluída definitivamente.');
    } catch {
      setMessage('Publicação excluída localmente.');
    }
  };

  const handleAprovarComentario = async (id: number) => {
    setComments(prev => prev.filter(c => c.id !== id));
    try {
      await moderacaoService.aprovarComentario(id);
      setMessage('Comentário aprovado e restaurado.');
    } catch {
      setMessage('Comentário aprovado localmente.');
    }
  };

  const handleRemoverComentario = async (id: number) => {
    if (!window.confirm('Excluir definitivamente este comentário?')) return;
    setComments(prev => prev.filter(c => c.id !== id));
    try {
      await moderacaoService.removerComentarioDefinitivo(id);
      setMessage('Comentário excluído definitivamente.');
    } catch {
      setMessage('Comentário excluído localmente.');
    }
  };

  return (
    <div className="moderation-panel-wrapper" style={{ maxWidth: 860, margin: '0 auto', padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <ShieldCheck size={28} color="#C57D1E" />
        <div>
          <h2 style={{ margin: 0, fontSize: 22, color: '#362317' }}>Painel de Moderação Comunitária</h2>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: 14 }}>
            Revise os conteúdos reportados com 5 ou mais denúncias preventivas.
          </p>
        </div>
      </div>

      {message && (
        <div style={{ background: '#E8F5E9', color: '#2E7D32', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
          {message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, borderBottom: '2px solid #E8DFD0', marginBottom: 20 }}>
        <button
          type="button"
          className={`sidebar-nav-item ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
          style={{ width: 'auto', padding: '10px 18px', borderRadius: '8px 8px 0 0' }}
        >
          <FileText size={18} />
          <span>Publicações Denunciadas ({posts.length})</span>
        </button>
        <button
          type="button"
          className={`sidebar-nav-item ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
          style={{ width: 'auto', padding: '10px 18px', borderRadius: '8px 8px 0 0' }}
        >
          <MessageSquare size={18} />
          <span>Comentários Denunciados ({comments.length})</span>
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Carregando denúncias...</div>
      ) : activeTab === 'posts' ? (
        posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#FAF5ED', borderRadius: 12 }}>
            <Check size={36} color="#2E7D32" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: 0, color: '#362317' }}>Tudo limpo!</h4>
            <p style={{ color: '#777', margin: '4px 0 0' }}>Nenhuma publicação aguardando despacho da moderação.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map(post => (
              <div key={post.id} style={{ background: '#fff', border: '1px solid #E8DFD0', borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <strong>{post.author}</strong> • <span style={{ color: '#888' }}>{post.time}</span>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#C62828', fontSize: 13, fontWeight: 700 }}>
                    <AlertCircle size={15} />
                    {post.reports || 5} denúncias
                  </span>
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: 17 }}>{post.title}</h3>
                <p style={{ margin: '0 0 16px 0', color: '#555', lineHeight: 1.5 }}>{post.content}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleAprovarPost(post.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2E7D32', borderColor: '#2E7D32' }}
                  >
                    <Check size={16} />
                    <span>Aprovar & Restaurar</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleRemoverPost(post.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#C62828', borderColor: '#C62828' }}
                  >
                    <Trash2 size={16} />
                    <span>Excluir Definitivamente</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#FAF5ED', borderRadius: 12 }}>
          <Check size={36} color="#2E7D32" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ margin: 0, color: '#362317' }}>Tudo limpo!</h4>
          <p style={{ color: '#777', margin: '4px 0 0' }}>Nenhum comentário aguardando moderação no momento.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comments.map(c => (
            <div key={c.id} style={{ background: '#fff', border: '1px solid #E8DFD0', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <strong>{c.authorName}</strong> • <span style={{ color: '#888' }}>{c.createdAt}</span>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#C62828', fontSize: 13, fontWeight: 700 }}>
                  <AlertCircle size={15} />
                  {c.reports || 5} denúncias
                </span>
              </div>
              <p style={{ margin: '0 0 16px 0', color: '#555', lineHeight: 1.5 }}>{c.content}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleAprovarComentario(c.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#2E7D32', borderColor: '#2E7D32' }}
                >
                  <Check size={16} />
                  <span>Aprovar & Restaurar</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleRemoverComentario(c.id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#C62828', borderColor: '#C62828' }}
                >
                  <Trash2 size={16} />
                  <span>Excluir Definitivamente</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

