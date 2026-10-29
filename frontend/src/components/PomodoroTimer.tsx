import { Play, Pause, RotateCcw, SkipForward, Target, Coffee, Feather, TrendingUp } from 'lucide-react';
import type { TimerMode } from '../hooks/usePomodoro';

interface PomodoroTimerProps {
  mode: TimerMode;
  timeLeft: number;
  duration: number;
  isRunning: boolean;
  modeLabel: string;
  sessionsCompleted: number;
  totalMinutesToday: number;
  weeklyData: number[];
  onToggle: () => void;
  onReset: () => void;
  onSetMode: (mode: TimerMode) => void;
}

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const TABS: { mode: TimerMode; label: string; icon: typeof Target }[] = [
  { mode: 'focus', label: 'Foco', icon: Target },
  { mode: 'shortBreak', label: 'Pausa', icon: Coffee },
  { mode: 'longBreak', label: 'Descanso', icon: Feather },
];

export default function PomodoroTimer({
  mode,
  timeLeft,
  duration,
  isRunning,
  modeLabel,
  sessionsCompleted,
  totalMinutesToday,
  weeklyData,
  onToggle,
  onReset,
  onSetMode,
}: PomodoroTimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / duration;

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const isPause = mode !== 'focus';
  const maxWeekly = Math.max(...weeklyData, 1);

  return (
    <div className="pomodoro-wrapper">
      <div className="pomodoro-tabs">
        {TABS.map(({ mode: tabMode, label, icon: Icon }) => (
          <button
            key={tabMode}
            id={`pomodoro-tab-${tabMode}`}
            className={`pomodoro-tab ${mode === tabMode ? 'active' : ''} ${tabMode !== 'focus' && mode === tabMode ? 'pause-mode' : ''}`}
            onClick={() => onSetMode(tabMode)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="timer-container">
        <svg className="timer-svg" viewBox="0 0 260 260">
          <circle className="timer-track" cx="130" cy="130" r={radius} />
          <circle
            className={`timer-progress ${isPause ? 'pause' : 'focus'}`}
            cx="130"
            cy="130"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="timer-display">
          <div className="timer-time">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="timer-label">{modeLabel}</div>
        </div>
      </div>

      <div className="timer-controls">
        <button
          id="timer-reset-btn"
          className="timer-btn timer-btn-secondary"
          onClick={onReset}
          title="Resetar"
          aria-label="Resetar"
        >
          <RotateCcw size={18} />
        </button>
        <button
          id="timer-toggle-btn"
          className={`timer-btn timer-btn-primary ${isPause ? 'pause-mode' : ''}`}
          onClick={onToggle}
          title={isRunning ? 'Pausar' : 'Iniciar'}
          aria-label={isRunning ? 'Pausar' : 'Iniciar'}
        >
          {isRunning ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 2 }} />}
        </button>
        <button
          id="timer-skip-btn"
          className="timer-btn timer-btn-secondary"
          onClick={() => onSetMode(isPause ? 'focus' : 'shortBreak')}
          title="Pular"
          aria-label="Pular"
        >
          <SkipForward size={18} />
        </button>
      </div>

      <div className="pomodoro-stats">
        <div className="pomodoro-stat-card">
          <div className="pomodoro-stat-value">{sessionsCompleted}</div>
          <div className="pomodoro-stat-label">Sessões Hoje</div>
        </div>
        <div className="pomodoro-stat-card">
          <div className="pomodoro-stat-value">{totalMinutesToday}</div>
          <div className="pomodoro-stat-label">Minutos</div>
        </div>
        <div className="pomodoro-stat-card">
          <div className="pomodoro-stat-value">{sessionsCompleted * 25}</div>
          <div className="pomodoro-stat-label">XP Ganho</div>
        </div>
      </div>

      <div className="session-history">
        <div className="session-history-title">
          <TrendingUp size={20} />
          <h3>Atividade Semanal</h3>
        </div>
        <div className="session-bar-chart">
          {weeklyData.map((val, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <div
                className="session-bar"
                style={{ height: `${Math.max((val / maxWeekly) * 100, 4)}%`, width: '100%' }}
              />
              <div className="session-bar-label">{DAYS[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
