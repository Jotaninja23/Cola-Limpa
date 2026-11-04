import { Clock, Flame, Trophy, Target, TrendingUp, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  totalXP: number;
  sessionsCompleted: number;
  totalMinutesToday: number;
  streak: number;
  metaDiariaMinutos?: number;
  weeklyData?: number[];
}

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const DEFAULT_WEEKLY_MINUTES = [45, 60, 30, 90, 75, 50, 0];

export default function Dashboard({
  totalXP,
  sessionsCompleted,
  totalMinutesToday,
  streak,
  metaDiariaMinutos = 90,
  weeklyData = DEFAULT_WEEKLY_MINUTES,
}: DashboardProps) {
  const todayIndex = new Date().getDay();
  const todayIdx = todayIndex === 0 ? 6 : todayIndex - 1;

  const weeklyWithToday = weeklyData.map((v, i) => (i === todayIdx ? totalMinutesToday || v : v));
  const maxVal = Math.max(...weeklyWithToday, 1);

  const metaPercent = Math.min(100, Math.round((totalMinutesToday / metaDiariaMinutos) * 100));
  const isMetaConcluida = totalMinutesToday >= metaDiariaMinutos;

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

      <div className="daily-goal-card" style={{ background: '#FAF5ED', border: '1px solid #E8DFD0', borderRadius: 12, padding: '18px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={20} color="#C57D1E" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#362317' }}>Meta Diária de Estudos</h3>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: isMetaConcluida ? '#2E7D32' : '#C57D1E' }}>
            {totalMinutesToday} de {metaDiariaMinutos} min ({metaPercent}%)
          </span>
        </div>
        <div className="sidebar-xp-bar" role="progressbar" aria-valuenow={totalMinutesToday} aria-valuemin={0} aria-valuemax={metaDiariaMinutos} style={{ height: 10 }}>
          <div className="sidebar-xp-bar-fill" style={{ width: `${metaPercent}%`, backgroundColor: isMetaConcluida ? '#2E7D32' : '#C57D1E' }} />
        </div>
        {isMetaConcluida && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, color: '#2E7D32', fontSize: 13, fontWeight: 600 }}>
            <CheckCircle2 size={16} />
            <span>Meta diária batida! Parabéns pelo foco nos estudos!</span>
          </div>
        )}
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
