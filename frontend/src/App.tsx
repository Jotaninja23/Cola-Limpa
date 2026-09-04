import { useState, useCallback } from 'react';
import {
  Timer,
  Users,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './App.css';

import PomodoroTimer from './components/PomodoroTimer';
import CommunityFeed from './components/CommunityFeed';
import Dashboard from './components/Dashboard';
import { usePomodoro } from './hooks/usePomodoro';

type Page = 'pomodoro' | 'community' | 'dashboard';

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'pomodoro', label: 'Pomodoro', icon: <Timer size={20} /> },
  { id: 'community', label: 'Comunidade', icon: <Users size={20} /> },
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('pomodoro');
  const [totalXP, setTotalXP] = useState(350);
  const [xpToast, setXpToast] = useState<number | null>(null);

  const handleXPGain = useCallback((xp: number) => {
    setTotalXP(prev => prev + xp);
    setXpToast(xp);
    setTimeout(() => setXpToast(null), 2500);

    // Confetti com cores quentes!
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#C57B57', '#D4943A', '#F5D590', '#4A3022'],
    });
  }, []);

  const pomodoro = usePomodoro(handleXPGain);

  const xpForNextLevel = 500;
  const currentLevelXP = totalXP % xpForNextLevel;
  const level = Math.floor(totalXP / xpForNextLevel) + 1;
  const xpPercent = (currentLevelXP / xpForNextLevel) * 100;

  const PAGE_HEADERS: Record<Page, { title: string; desc: string }> = {
    pomodoro: { title: '🍅 Pomodoro', desc: 'Mantenha o foco, ganhe XP!' },
    community: { title: '💬 Comunidade', desc: 'Compartilhe dicas e aprenda junto' },
    dashboard: { title: '📊 Dashboard', desc: 'Acompanhe seu progresso' },
  };

  return (
    <div className="app-layout">
      {/* XP Toast */}
      {xpToast !== null && (
        <div className="xp-toast">
          <Sparkles size={20} />
          +{xpToast} XP!
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">CL</div>
          <div className="sidebar-logo-text">
            <h1>Cola Limpa</h1>
            <span>Estudos Gamificados</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar-nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* XP Card */}
        <div className="sidebar-xp-card">
          <div className="sidebar-xp-header">
            <span className="sidebar-xp-label">⭐ Nível {level}</span>
            <span className="sidebar-xp-value">{currentLevelXP}/{xpForNextLevel}</span>
          </div>
          <div className="sidebar-xp-bar">
            <div className="sidebar-xp-bar-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <div className="sidebar-xp-level">{totalXP} XP total</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-container">
          <header className="page-header" key={currentPage}>
            <h2>{PAGE_HEADERS[currentPage].title}</h2>
            <p>{PAGE_HEADERS[currentPage].desc}</p>
          </header>

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
        </div>
      </main>
    </div>
  );
}

export default App;
