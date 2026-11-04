import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PomodoroTimer from './PomodoroTimer';

describe('PomodoroTimer', () => {
  const defaultProps = {
    mode: 'focus' as const,
    timeLeft: 1500,
    duration: 1500,
    isRunning: false,
    modeLabel: 'Foco',
    sessionsCompleted: 2,
    totalMinutesToday: 50,
    weeklyData: [45, 60, 30, 90, 75, 50, 0],
    onToggle: vi.fn(),
    onReset: vi.fn(),
    onSetMode: vi.fn(),
  };

  it('should render formatted time and mode label', () => {
    render(<PomodoroTimer {...defaultProps} />);

    expect(screen.getByText('25:00')).toBeInTheDocument();
    expect(screen.getAllByText('Foco')[0]).toBeInTheDocument();
  });

  it('should trigger onToggle when main button is clicked', () => {
    const handleToggle = vi.fn();
    render(<PomodoroTimer {...defaultProps} onToggle={handleToggle} />);

    const toggleBtn = screen.getByRole('button', { name: /iniciar/i });
    fireEvent.click(toggleBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('should show pause title when running', () => {
    render(<PomodoroTimer {...defaultProps} isRunning={true} />);

    const pauseBtn = screen.getByRole('button', { name: /pausar/i });
    expect(pauseBtn).toBeInTheDocument();
  });

  it('should trigger onReset when reset button is clicked', () => {
    const handleReset = vi.fn();
    render(<PomodoroTimer {...defaultProps} onReset={handleReset} />);

    const resetBtn = screen.getByRole('button', { name: /resetar/i });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('should trigger onSetMode when mode tabs are clicked', () => {
    const handleSetMode = vi.fn();
    render(<PomodoroTimer {...defaultProps} onSetMode={handleSetMode} />);

    const breakTab = screen.getByRole('button', { name: /pausa/i });
    fireEvent.click(breakTab);

    expect(handleSetMode).toHaveBeenCalledWith('shortBreak');
  });

  it('should trigger onSetMode with shortBreak when skip is clicked from focus mode', () => {
    const handleSetMode = vi.fn();
    render(<PomodoroTimer {...defaultProps} mode="focus" onSetMode={handleSetMode} />);

    const skipBtn = screen.getByRole('button', { name: /pular/i });
    fireEvent.click(skipBtn);

    expect(handleSetMode).toHaveBeenCalledWith('shortBreak');
  });

  it('should trigger onSetMode with focus when skip is clicked from break mode', () => {
    const handleSetMode = vi.fn();
    render(<PomodoroTimer {...defaultProps} mode="shortBreak" onSetMode={handleSetMode} />);

    const skipBtn = screen.getByRole('button', { name: /pular/i });
    fireEvent.click(skipBtn);

    expect(handleSetMode).toHaveBeenCalledWith('focus');
  });

  it('should display correct statistics and calculated XP', () => {
    render(<PomodoroTimer {...defaultProps} sessionsCompleted={3} totalMinutesToday={90} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Sessões Hoje')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('Minutos')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('XP Ganho')).toBeInTheDocument();
  });

  it('should render finish button in free study mode and trigger onFinishFreeStudy', () => {
    const handleFinishFree = vi.fn();
    render(
      <PomodoroTimer
        {...defaultProps}
        mode="free"
        modeLabel="Estudo Livre"
        timeLeft={300}
        onFinishFreeStudy={handleFinishFree}
      />
    );

    expect(screen.getByText('Estudo Livre')).toBeInTheDocument();
    expect(screen.getByText('+1 XP acumulados')).toBeInTheDocument();

    const finishBtn = screen.getByRole('button', { name: /concluir e salvar estudo livre/i });
    fireEvent.click(finishBtn);

    expect(handleFinishFree).toHaveBeenCalledTimes(1);
  });
});
