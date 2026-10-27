import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('should render all dashboard metrics correctly', () => {
    render(
      <Dashboard
        totalXP={1250}
        sessionsCompleted={5}
        totalMinutesToday={125}
        streak={12}
      />
    );

    expect(screen.getByText('1250')).toBeInTheDocument();
    expect(screen.getByText('XP Total')).toBeInTheDocument();

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Sessões Completas')).toBeInTheDocument();

    expect(screen.getByText('125m')).toBeInTheDocument();
    expect(screen.getByText('Foco Hoje')).toBeInTheDocument();

    expect(screen.getByText('12 dias')).toBeInTheDocument();
    expect(screen.getByText('Sequência')).toBeInTheDocument();
  });

  it('should render weekly chart and day labels', () => {
    render(
      <Dashboard
        totalXP={300}
        sessionsCompleted={1}
        totalMinutesToday={25}
        streak={3}
      />
    );

    expect(screen.getByText('📈 Tempo de Estudo Semanal')).toBeInTheDocument();
    expect(screen.getByText('Seg')).toBeInTheDocument();
    expect(screen.getByText('Ter')).toBeInTheDocument();
    expect(screen.getByText('Qua')).toBeInTheDocument();
    expect(screen.getByText('Qui')).toBeInTheDocument();
    expect(screen.getByText('Sex')).toBeInTheDocument();
    expect(screen.getByText('Sáb')).toBeInTheDocument();
    expect(screen.getByText('Dom')).toBeInTheDocument();
  });
});

