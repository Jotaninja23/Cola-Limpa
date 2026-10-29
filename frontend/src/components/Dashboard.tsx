import { Clock, Flame, Trophy, Target, TrendingUp } from 'lucide-react';

interface DashboardProps {
  totalXP: number;
  sessionsCompleted: number;
  totalMinutesToday: number;
  streak: number;
}

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const WEEKLY_MINUTES = [45, 60, 30, 90, 75, 50, 0];

export default function Dashboard({ totalXP, sessionsCompleted, totalMinutesToday, streak }: DashboardProps) {
  const todayIndex = new Date().getDay();
  const todayIdx = todayIndex === 0 ? 6 : todayIndex - 1;

  const weeklyWithToday = WEEKLY_MINUTES.map((v, i) => (i === todayIdx ? totalMinutesToday || v : v));
  const maxVal = Math.max(...weeklyWithToday, 1);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-grid">
        <div className="dash-card" style={{ animationDelay: '0ms' }}>
          <div className="dash-card-icon gold">
            <Trophy size={22} />
          </div>
          <div className="dash-card-value">{totalXP}</div>
          <div className="dash-card-label">XP Total</div>
        </div>

        <div className="dash-card" style={{ animationDelay: '80ms' }}>
          <div className="dash-card-icon brown">
            <Target size={22} />
          </div>
          <div className="dash-card-value">{sessionsCompleted}</div>
          <div className="dash-card-label">Sessões Completas</div>
        </div>

        <div className="dash-card" style={{ animationDelay: '160ms' }}>
          <div className="dash-card-icon blue">
            <Clock size={22} />
          </div>
          <div className="dash-card-value">{totalMinutesToday}m</div>
          <div className="dash-card-label">Foco Hoje</div>
        </div>

        <div className="dash-card" style={{ animationDelay: '240ms' }}>
          <div className="dash-card-icon green">
            <Flame size={22} />
          </div>
          <div className="dash-card-value">{streak} dias</div>
          <div className="dash-card-label">Sequência</div>
        </div>
      </div>

      <div className="weekly-chart-card" style={{ animationDelay: '320ms' }}>
        <div className="weekly-chart-title">
          <TrendingUp size={20} />
          <h3>Tempo de Estudo Semanal</h3>
        </div>
        <div className="weekly-chart">
          {weeklyWithToday.map((val, i) => (
            <div key={i} className="weekly-bar-wrapper">
              <div
                className={`weekly-bar ${i === todayIdx ? 'today' : ''}`}
                style={{ height: `${Math.max((val / maxVal) * 100, 3)}%` }}
              />
              <span className={`weekly-bar-day ${i === todayIdx ? 'today' : ''}`}>
                {DAYS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
