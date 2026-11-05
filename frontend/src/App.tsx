import { useState, useCallback, useEffect } from 'react';
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
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

import PomodoroTimer from './components/PomodoroTimer';
import CommunityFeed from './components/CommunityFeed';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ModerationPanel from './components/ModerationPanel';
import EditProfileModal from './components/EditProfileModal';
import { usePomodoro } from './hooks/usePomodoro';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/auth/AuthModal';
import { authService } from './services/authService';
import { cronometroService } from './services/cronometroService';

export type Page = 'home' | 'pomodoro' | 'community' | 'dashboard' | 'login' | 'register' | 'moderation';

interface NavItem {
  id: Page;
  label: string;
  icon: typeof Home;
}

const BASE_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
  { id: 'community', label: 'Comunidade', icon: Users },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export interface AppProps {
  initialPage?: Page;
}

function calculateStreak(sessions: { dataCriacao: string }[]): number {
  if (!sessions || sessions.length === 0) return 0;
  const dateSet = new Set<string>();
  sessions.forEach(s => {
    try {
      const d = new Date(s.dataCriacao);
      const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dateSet.add(isoDate);
    } catch {
      // ignora data inválida
    }
  });

  const formatDay = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const today = new Date();
  const todayStr = formatDay(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDay(yesterday);

  let currentCheck = new Date();
  if (!dateSet.has(todayStr)) {
    if (!dateSet.has(yesterdayStr)) {
      return 0;
    }
    currentCheck = yesterday;
  }

  let count = 0;
  while (dateSet.has(formatDay(currentCheck))) {
    count++;
    currentCheck.setDate(currentCheck.getDate() - 1);
  }
  return count;
}

export function AppContent({ initialPage = 'home' }: AppProps) {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const [totalXP, setTotalXP] = useState(350);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userWeeklyMinutes, setUserWeeklyMinutes] = useState<number[]>([45, 60, 30, 90, 75, 50, 0]);
  const [userStreak, setUserStreak] = useState<number>(1);

  const auth = useAuth();
  const displayXP = auth.user?.xp !== undefined ? auth.user.xp : totalXP;

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

  // Carrega histórico real de cronômetro quando autenticado
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id) {
      cronometroService
        .listarHistorico(auth.user.id)
        .then(sessions => {
          if (sessions && sessions.length > 0) {
            const minutesByDay = [0, 0, 0, 0, 0, 0, 0];
            const now = new Date();
            sessions.forEach(s => {
              const date = new Date(s.dataCriacao);
              const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
              if (diffDays >= 0 && diffDays < 7) {
                const dayIndex = (date.getDay() + 6) % 7;
                minutesByDay[dayIndex] += Math.round(s.tempoSegundos / 60);
              }
            });
            setUserWeeklyMinutes(minutesByDay);
            setUserStreak(Math.max(1, calculateStreak(sessions)));
          }
        })
        .catch(() => {});
    }
  }, [auth.isAuthenticated, auth.user?.id]);

  const xpForNextLevel = 500;
  const currentLevelXP = displayXP % xpForNextLevel;
  const level = Math.floor(displayXP / xpForNextLevel) + 1;
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
    moderation: {
      title: 'Moderação',
      desc: 'Revise postagens e comentários reportados pela comunidade acadêmica',
      icon: ShieldCheck,
    },
  };

  const navItems = [...BASE_NAV_ITEMS];
  if (auth.user?.isAdmin) {
    navItems.push({ id: 'moderation', label: 'Moderação', icon: ShieldCheck });
  }

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('dashboard');
  };

  const handleSaveProfile = async (data: { nome: string; telefone?: string; fotoUrl?: string; metaDiariaMinutos?: number }) => {
    if (!auth.user) return;
    try {
      const updated = await authService.atualizarPerfil(auth.user.id, data);
      localStorage.setItem('cola_limpa_user', JSON.stringify(updated));
      window.location.reload();
    } catch {
      // Atualização local de fallback
      const updated = { ...auth.user, ...data };
      localStorage.setItem('cola_limpa_user', JSON.stringify(updated));
    }
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
          {navItems.map(({ id, label, icon: Icon }) => (
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
            <div className="sidebar-user-card" style={{ cursor: 'pointer' }} onClick={() => setIsEditProfileOpen(true)}>
              <div className="sidebar-user-avatar" aria-hidden="true">
                {auth.user.nome.substring(0, 2).toUpperCase()}
              </div>
              <div className="sidebar-user-details">
                <span className="sidebar-user-name" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {auth.user.nome}
                  <UserCheck size={14} color="#C57D1E" />
                </span>
                <span className="sidebar-user-role">
                  {auth.user.isAdmin ? 'Administrador' : auth.user.nivelEscolar || 'Estudante'}
                </span>
              </div>
              <button
                type="button"
                className="sidebar-logout-btn"
                onClick={e => {
                  e.stopPropagation();
                  auth.logout();
                }}
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
          <div className="sidebar-xp-level">{displayXP} XP total</div>
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
              isBiologicalLimitReached={pomodoro.isBiologicalLimitReached}
              onToggle={pomodoro.toggleTimer}
              onReset={pomodoro.resetTimer}
              onSetMode={pomodoro.setMode}
              onFinishFreeStudy={pomodoro.finishFreeStudy}
            />
          )}

          {currentPage === 'community' && <CommunityFeed requireAuthForActions={true} />}

          {currentPage === 'dashboard' && (
            <Dashboard
              totalXP={displayXP}
              sessionsCompleted={pomodoro.sessionsCompleted}
              totalMinutesToday={pomodoro.totalMinutesToday}
              streak={userStreak}
              metaDiariaMinutos={auth.user?.metaDiariaMinutos || 90}
              weeklyData={userWeeklyMinutes}
            />
          )}

          {currentPage === 'moderation' && <ModerationPanel />}

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
              onLoginWithGoogle={async () => {
                await auth.loginComGoogle('mock-google-id-token');
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
              onLoginWithGoogle={async () => {
                await auth.loginComGoogle('mock-google-id-token');
                handleRegisterSuccess();
              }}
              onNavigateToLogin={() => setCurrentPage('login')}
              onNavigateHome={() => setCurrentPage('home')}
            />
          )}
        </div>
      </main>

      {/* Modal global de autenticação */}
      <AuthModal />

      {/* Modal de edição de perfil */}
      {auth.user && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          user={auth.user}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}

export default function App({ initialPage = 'home' }: AppProps) {
  return (
    <AuthProvider>
      <AppContent initialPage={initialPage} />
    </AuthProvider>
  );
}
