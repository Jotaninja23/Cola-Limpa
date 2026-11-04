import {
  Timer,
  Users,
  LayoutDashboard,
  BookOpen,
  Brain,
  Repeat,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Compass,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'pomodoro' | 'community' | 'dashboard' | 'login' | 'register') => void;
  isAuthenticated: boolean;
  userName?: string;
}

export default function LandingPage({
  onNavigate,
  isAuthenticated,
  userName,
}: LandingPageProps) {
  return (
    <div className="landing-wrapper">
      <section className="landing-hero" aria-label="Apresentação do Cola Limpa">
        <div className="landing-badge">
          <GraduationCap size={16} />
          <span>ETEC • Trabalho de Conclusão de Curso</span>
        </div>

        <h1 className="landing-title">
          Cola Limpa
        </h1>

        <p className="landing-tagline">
          Produtividade Acadêmica, Foco Gamificado e Aprendizagem Ativa
        </p>

        <p className="landing-description">
          Uma plataforma estruturada para mitigar a dispersão digital, organizar sua rotina de preparação
          para vestibulares e potencializar seus estudos por meio de metodologias baseadas em evidências científicas.
        </p>

        <div className="landing-cta-group">
          <button
            type="button"
            className="landing-btn landing-btn-primary"
            onClick={() => onNavigate('pomodoro')}
          >
            <Timer size={20} />
            <span>Iniciar Pomodoro</span>
            <ArrowRight size={18} />
          </button>

          {!isAuthenticated ? (
            <button
              type="button"
              className="landing-btn landing-btn-secondary"
              onClick={() => onNavigate('register')}
            >
              <Sparkles size={18} />
              <span>Criar Conta Gratuita</span>
            </button>
          ) : (
            <button
              type="button"
              className="landing-btn landing-btn-secondary"
              onClick={() => onNavigate('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Ver Meu Progresso</span>
            </button>
          )}

          <button
            type="button"
            className="landing-btn landing-btn-tertiary"
            onClick={() => onNavigate('community')}
          >
            <Users size={18} />
            <span>Comunidade Acadêmica</span>
          </button>
        </div>

        {isAuthenticated && userName && (
          <div className="landing-welcome-pill">
            <CheckCircle2 size={16} />
            <span>Sessão ativa como <strong>{userName}</strong></span>
          </div>
        )}
      </section>

      <section className="landing-quick-nav" aria-label="Acesso rápido às funcionalidades">
        <div className="quick-nav-grid">
          <button
            type="button"
            className="quick-nav-card"
            onClick={() => onNavigate('pomodoro')}
          >
            <div className="quick-nav-icon gold">
              <Timer size={28} />
            </div>
            <h3>Temporizador Pomodoro</h3>
            <p>Ciclos de 25 minutos de foco e pausas cronometradas com ganho de experiência.</p>
            <span className="quick-nav-action">Acessar Temporizador &rarr;</span>
          </button>

          <button
            type="button"
            className="quick-nav-card"
            onClick={() => onNavigate('community')}
          >
            <div className="quick-nav-icon brown">
              <Users size={28} />
            </div>
            <h3>Fórum Colaborativo</h3>
            <p>Compartilhe resumos, resoluções e tire dúvidas organizadas por matéria.</p>
            <span className="quick-nav-action">Explorar Fórum &rarr;</span>
          </button>

          <button
            type="button"
            className="quick-nav-card"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="quick-nav-icon accent">
              <LayoutDashboard size={28} />
            </div>
            <h3>Painel de Desempenho</h3>
            <p>Acompanhe metas diárias, histórico de minutos focados e evolução de níveis.</p>
            <span className="quick-nav-action">Ver Estatísticas &rarr;</span>
          </button>
        </div>
      </section>

      <section className="landing-comparison" aria-label="Problema e Solução">
        <div className="section-title-wrapper">
          <span className="section-number-badge">01 DIAGNÓSTICO</span>
          <h2>O Desafio e a Nossa Solução</h2>
        </div>

        <div className="comparison-grid">
          <article className="comparison-card problem">
            <div className="comparison-header">
              <Clock size={24} />
              <h3>Desafios Enfrentados pelos Alunos</h3>
            </div>
            <ul className="comparison-list">
              <li>
                <span className="bullet-point">&bull;</span>
                Uso frequente de métodos de estudo passivos pouco eficientes (como simples releitura ou grifo indiscriminado).
              </li>
              <li>
                <span className="bullet-point">&bull;</span>
                Sensação de cansaço mental precoce provocada pela falta de intervalos estruturados.
              </li>
              <li>
                <span className="bullet-point">&bull;</span>
                Falta de acompanhamento objetivo do tempo realmente dedicado ao aprendizado.
              </li>
              <li>
                <span className="bullet-point">&bull;</span>
                Dificuldade de encontrar orientações e materiais de apoio curados de forma confiável.
              </li>
            </ul>
          </article>

          <article className="comparison-card solution">
            <div className="comparison-header">
              <Shield size={24} />
              <h3>Soluções Estruturadas do Cola Limpa</h3>
            </div>
            <ul className="comparison-list">
              <li>
                <span className="bullet-point">&bull;</span>
                Estímulo a técnicas ativas de aprendizagem com fundamentação na psicologia cognitiva.
              </li>
              <li>
                <span className="bullet-point">&bull;</span>
                Temporizador automatizado com mecanismos de preservação física e mental contra a exaustão.
              </li>
              <li>
                <span className="bullet-point">&bull;</span>
                Registro detalhado de minutos estudados, assiduidade diária e distribuição semanal.
              </li>
              <li>
                <span className="bullet-point">&bull;</span>
                Comunidade colaborativa com moderação orgânica para compartilhamento de sínteses.
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="landing-methods" aria-label="Metodologias de Estudo">
        <div className="section-title-wrapper">
          <span className="section-number-badge">02 METODOLOGIAS</span>
          <h2>Estratégias Baseadas em Evidências</h2>
        </div>

        <div className="methods-grid">
          <article className="method-card">
            <div className="method-icon-wrap">
              <Repeat size={24} />
            </div>
            <h4>Revisão Espaçada</h4>
            <p>
              Retorno deliberado ao conteúdo em intervalos calculados para combater a curva do esquecimento e consolidar a memória.
            </p>
          </article>

          <article className="method-card">
            <div className="method-icon-wrap">
              <Brain size={24} />
            </div>
            <h4>Prática Ativa</h4>
            <p>
              Exercício mental de autoexplicação e recuperação de conceitos sem recorrer imediatamente às anotações.
            </p>
          </article>

          <article className="method-card">
            <div className="method-icon-wrap">
              <BookOpen size={24} />
            </div>
            <h4>Resolução de Exercícios</h4>
            <p>
              Aplicação direta de fórmulas e teorias em questões de vestibulares anteriores com foco na interpretação.
            </p>
          </article>

          <article className="method-card">
            <div className="method-icon-wrap">
              <Compass size={24} />
            </div>
            <h4>Gestão de Foco</h4>
            <p>
              Segmentação do tempo em blocos controlados para manter o ritmo mental sem sobrecarga cognitiva.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-quote" aria-label="Citação inspiradora">
        <blockquote className="quote-box">
          <p className="quote-text">
            &ldquo;Estudar não é apenas acumular conhecimento, mas aprender a pensar.&rdquo;
          </p>
          <cite className="quote-author">&mdash; Albert Einstein</cite>
        </blockquote>
      </section>

      <footer className="landing-footer" aria-label="Créditos acadêmicos">
        <div className="footer-content">
          <div className="footer-institution">
            <strong>Centro Estadual de Educação Tecnológica Paula Souza &bull; ETEC</strong>
            <p>Curso Técnico em Desenvolvimento de Sistemas</p>
          </div>
          <div className="footer-team">
            <span>Equipe de Desenvolvimento: João Vitor, Mariane, Thiago, Wellington e Yasmin</span>
            <span>Orientação: Prof.ª Patrícia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
