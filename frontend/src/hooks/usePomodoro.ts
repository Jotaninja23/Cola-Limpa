import { useState, useEffect, useCallback, useRef } from 'react';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  totalMinutesToday: number;
  weeklyData: number[];
}

const DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS: Record<TimerMode, string> = {
  focus: 'Foco',
  shortBreak: 'Pausa Curta',
  longBreak: 'Pausa Longa',
};

export function usePomodoro(onXPGain: (xp: number) => void) {
  const [state, setState] = useState<PomodoroState>({
    mode: 'focus',
    timeLeft: DURATIONS.focus,
    isRunning: false,
    sessionsCompleted: 0,
    totalMinutesToday: 0,
    weeklyData: [45, 60, 30, 90, 75, 50, 0], // Dados simulados da semana
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.timeLeft <= 1) {
        // Timer acabou
        const xpGain = prev.mode === 'focus' ? 25 : 10;
        onXPGain(xpGain);

        const newSessions = prev.mode === 'focus'
          ? prev.sessionsCompleted + 1
          : prev.sessionsCompleted;

        const addedMinutes = prev.mode === 'focus'
          ? DURATIONS.focus / 60
          : 0;

        // Auto-switch mode
        let nextMode: TimerMode;
        if (prev.mode === 'focus') {
          nextMode = newSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
        } else {
          nextMode = 'focus';
        }

        return {
          ...prev,
          mode: nextMode,
          timeLeft: DURATIONS[nextMode],
          isRunning: false,
          sessionsCompleted: newSessions,
          totalMinutesToday: prev.totalMinutesToday + addedMinutes,
          weeklyData: prev.weeklyData.map((v, i) =>
            i === 6 ? prev.totalMinutesToday + addedMinutes : v
          ),
        };
      }
      return { ...prev, timeLeft: prev.timeLeft - 1 };
    });
  }, [onXPGain]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, tick]);

  const toggleTimer = () => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setState(prev => ({
      ...prev,
      timeLeft: DURATIONS[prev.mode],
      isRunning: false,
    }));
  };

  const setMode = (mode: TimerMode) => {
    setState(prev => ({
      ...prev,
      mode,
      timeLeft: DURATIONS[mode],
      isRunning: false,
    }));
  };

  return {
    ...state,
    toggleTimer,
    resetTimer,
    setMode,
    modeLabel: MODE_LABELS[state.mode],
    duration: DURATIONS[state.mode],
  };
}
