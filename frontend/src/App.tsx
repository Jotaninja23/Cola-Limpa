import { useState, useCallback } from 'react';
import {
  Home,
  Timer,
  Users,
  LayoutDashboard,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

import PomodoroTimer from './components/PomodoroTimer';
import CommunityFeed from './components/CommunityFeed';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { usePomodoro } from './hooks/usePomodoro';
import { useAuth } from './hooks/useAuth';

export type Page = 'home' | 'pomodoro' | 'community' | 'dashboard' | 'login' | 'register';

interface NavItem {
  id: Page;
  label: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
  { id: 'community', label: 'Comunidade', icon: Users },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

interface AppProps {
  initialPage?: Page;
}

function App({ initialPage = 'home' }: AppProps) {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [totalXP, setTotalXP] = useState(350);
  const [xpToast, setXpToast] = useState<number | null>(null);

  const auth = useAuth();

  const handleXPGain = useCallback((xp: number) => {
    setTotalXP(prev => prev + xp);
    setXpToast(xp);
    setTimeout(() => setXpToast(null), 2500);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C57D1E', '#B36C12', '#362317', '#FAF5ED'],
    });
  }, []);

  const pomodoro = usePomodoro(handleXPGain);

  const xpForNextLevel = 500;
  const currentLevelXP = totalXP % xpForNextLevel;
  const level = Math.floor(totalXP / xpForNextLevel) + 1;
  const xpPercent = (currentLevelXP / xpForNextLevel) * 100;

  const PAGE_HEADERS: Partial<Record<Page, { title: string; desc: string; icon: typeof Timer }>> = {
    pomodoro: {
      title: 'Pomodoro',
      desc: 'Mantenha o foco e ganhe experiência em cada ciclo concluído',
      icon: Timer,
    },
    community: {
      title: 'Comunidade',
      desc: 'Compartilhe dicas, sínteses e aprenda em conjunto',
      icon: Users,
    },
    dashboard: {
      title: 'Dashboard',
      desc: 'Acompanhe seu progresso, metas diárias e assiduidade',
      icon: LayoutDashboard,
    },
  };

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="app-layout">
      {xpToast !== null && (
        <div className="xp-toast" role="status" aria-live="polite">
          <Sparkles size={20} />
          <span>+{xpToast} XP!</span>
        </div>
      )}

      <aside className="sidebar" aria-label="Navegação Principal">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">CL</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-brand-name">Cola Limpa</span>
            <span>Estudos Gamificados</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`nav-${id}`}
              className={`sidebar-nav-item ${currentPage === id ? 'active' : ''}`}
              onClick={() => setCurrentPage(id)}
              aria-current={currentPage === id ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-auth-section">
          {auth.isAuthenticated && auth.user ? (
            <div className="sidebar-user-card">
              <div className="sidebar-user-avatar" aria-hidden="true">
                {auth.user.nome.substring(0, 2).toUpperCase()}
              </div>
              <div className="sidebar-user-details">
                <span className="sidebar-user-name">{auth.user.nome}</span>
                <span className="sidebar-user-role">{auth.user.nivelEscolar || 'Estudante'}</span>
              </div>
              <button
                type="button"
                className="sidebar-logout-btn"
                onClick={auth.logout}
                title="Encerrar sessão"
                aria-label="Encerrar sessão"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="sidebar-guest-actions">
              <button
                type="button"
                id="sidebar-login-btn"
                className="sidebar-auth-btn login-btn"
                onClick={() => setCurrentPage('login')}
              >
                <LogIn size={16} />
                <span>Entrar</span>
              </button>
              <button
                type="button"
                id="sidebar-register-btn"
                className="sidebar-auth-btn register-btn"
                onClick={() => setCurrentPage('register')}
              >
                <UserPlus size={16} />
                <span>Cadastrar</span>
              </button>
            </div>
          )}
        </div>

        <div className="sidebar-xp-card">
          <div className="sidebar-xp-header">
            <span className="sidebar-xp-label">
              <Award size={16} />
              <span>Nível {level}</span>
            </span>
            <span className="sidebar-xp-value">{currentLevelXP}/{xpForNextLevel}</span>
          </div>
          <div className="sidebar-xp-bar" role="progressbar" aria-valuenow={currentLevelXP} aria-valuemin={0} aria-valuemax={xpForNextLevel}>
            <div className="sidebar-xp-bar-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <div className="sidebar-xp-level">{totalXP} XP total</div>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-container">
          {currentPage in PAGE_HEADERS && (
            <header className="page-header" key={currentPage}>
              <div className="page-header-content">
                <h2>{PAGE_HEADERS[currentPage]?.title}</h2>
                <p>{PAGE_HEADERS[currentPage]?.desc}</p>
              </div>
            </header>
          )}

          {currentPage === 'home' && (
            <LandingPage
              onNavigate={setCurrentPage}
              isAuthenticated={auth.isAuthenticated}
              userName={auth.user?.nome}
            />
          )}

          {currentPage === 'pomodoro' && (
            <PomodoroTimer
              mode={pomodoro.mode}
              timeLeft={pomodoro.timeLeft}
              duration={pomodoro.duration}
              isRunning={pomodoro.isRunning}
              modeLabel={pomodoro.modeLabel}
              sessionsCompleted={pomodoro.sessionsCompleted}
              totalMinutesToday={pomodoro.totalMinutesToday}
              weeklyData={pomodoro.weeklyData}
              onToggle={pomodoro.toggleTimer}
              onReset={pomodoro.resetTimer}
              onSetMode={pomodoro.setMode}
            />
          )}

          {currentPage === 'community' && <CommunityFeed />}

          {currentPage === 'dashboard' && (
            <Dashboard
              totalXP={totalXP}
              sessionsCompleted={pomodoro.sessionsCompleted}
              totalMinutesToday={pomodoro.totalMinutesToday}
              streak={7}
            />
          )}

          {currentPage === 'login' && (
            <LoginForm
              step={auth.step}
              emailSentTo={auth.emailSentTo}
              isLoading={auth.isLoading}
              error={auth.error}
              onRequestOtp={auth.requestOtp}
              onVerifyOtp={async code => {
                const ok = await auth.verifyOtp(code);
                if (ok) handleLoginSuccess();
                return ok;
              }}
              onLoginAsDemo={() => {
                auth.loginAsDemo();
                handleLoginSuccess();
              }}
              onNavigateToRegister={() => setCurrentPage('register')}
              onNavigateHome={() => setCurrentPage('home')}
              onResetFlow={auth.resetAuthFlow}
            />
          )}

          {currentPage === 'register' && (
            <RegisterForm
              isLoading={auth.isLoading}
              error={auth.error}
              onRegister={async data => {
                const ok = await auth.register(data);
                if (ok) handleRegisterSuccess();
                return ok;
              }}
              onNavigateToLogin={() => setCurrentPage('login')}
              onNavigateHome={() => setCurrentPage('home')}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
