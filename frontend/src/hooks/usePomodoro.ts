import { useState, useEffect, useCallback, useRef } from 'react';
import { cronometroService } from '../services/cronometroService';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'free';

interface PomodoroState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  totalMinutesToday: number;
  weeklyData: number[];
  freeStudySeconds: number;
  isBiologicalLimitReached: boolean;
}

const DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
  free: 0,
};

const MODE_LABELS: Record<TimerMode, string> = {
  focus: 'Foco',
  shortBreak: 'Pausa Curta',
  longBreak: 'Pausa Longa',
  free: 'Estudo Livre',
};

const BIOLOGICAL_LIMIT_SECONDS = 57600; // 16 horas contínuas

export function usePomodoro(onXPGain: (xp: number) => void) {
  const [state, setState] = useState<PomodoroState>(() => {
    try {
      const saved = localStorage.getItem('cola_limpa_pomodoro_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          isRunning: false, // Pausado ao recarregar aba
        };
      }
    } catch {
      // Ignora erro de parse
    }
    return {
      mode: 'focus',
      timeLeft: DURATIONS.focus,
      isRunning: false,
      sessionsCompleted: 0,
      totalMinutesToday: 0,
      weeklyData: [45, 60, 30, 90, 75, 50, 0],
      freeStudySeconds: 0,
      isBiologicalLimitReached: false,
    };
  });

  const [pendingXp, setPendingXp] = useState<{ amount: number; sessionType: string; durationSeconds: number } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persiste estado no localStorage para continuidade
  useEffect(() => {
    try {
      localStorage.setItem('cola_limpa_pomodoro_state', JSON.stringify({
        mode: state.mode,
        timeLeft: state.timeLeft,
        sessionsCompleted: state.sessionsCompleted,
        totalMinutesToday: state.totalMinutesToday,
        weeklyData: state.weeklyData,
        freeStudySeconds: state.freeStudySeconds,
      }));
    } catch {
      // Ignora erro de storage
    }
  }, [state]);

  // Efeito colateral limpo para conceder XP e sincronizar com o backend
  useEffect(() => {
    if (pendingXp) {
      onXPGain(pendingXp.amount);

      // Envia sessão ao backend se autenticado
      cronometroService.salvarSessao({
        tempoSegundos: pendingXp.durationSeconds,
        tipoSessao: pendingXp.sessionType,
      }).catch(() => {
        // Fallback gracioso
      });

      // Notificação nativa do navegador
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Cola Limpa - Ciclo Concluído!', {
          body: `Parabéns! Você concluiu um ciclo de ${pendingXp.sessionType} e ganhou +${pendingXp.amount} XP!`,
          icon: '/favicon.svg',
        });
      }

      setPendingXp(null);
    }
  }, [pendingXp, onXPGain]);

  const tick = useCallback(() => {
    setState(prev => {
      // Modo Estudo Livre (progressivo)
      if (prev.mode === 'free') {
        const nextSeconds = prev.freeStudySeconds + 1;
        if (nextSeconds >= BIOLOGICAL_LIMIT_SECONDS) {
          return {
            ...prev,
            freeStudySeconds: nextSeconds,
            timeLeft: nextSeconds,
            isRunning: false,
            isBiologicalLimitReached: true,
          };
        }
        return {
          ...prev,
          freeStudySeconds: nextSeconds,
          timeLeft: nextSeconds,
        };
      }

      // Modos temporizados normais (Pomodoro regressivo)
      if (prev.timeLeft <= 1) {
        const xpGain = prev.mode === 'focus' ? 25 : 10;
        const durationSeconds = prev.mode === 'focus' ? DURATIONS.focus : DURATIONS[prev.mode];

        setPendingXp({
          amount: xpGain,
          sessionType: prev.mode === 'focus' ? 'POMODORO' : 'PAUSA',
          durationSeconds,
        });

        const newSessions = prev.mode === 'focus'
          ? prev.sessionsCompleted + 1
          : prev.sessionsCompleted;

        const addedMinutes = prev.mode === 'focus'
          ? DURATIONS.focus / 60
          : 0;

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
  }, []);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, tick]);

  const toggleTimer = () => {
    // Solicita permissão de notificação se ainda default
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    setState(prev => ({ ...prev, isRunning: !prev.isRunning, isBiologicalLimitReached: false }));
  };

  const resetTimer = () => {
    setState(prev => ({
      ...prev,
      timeLeft: prev.mode === 'free' ? 0 : DURATIONS[prev.mode],
      freeStudySeconds: 0,
      isRunning: false,
      isBiologicalLimitReached: false,
    }));
  };

  const finishFreeStudy = () => {
    if (state.mode !== 'free' || state.freeStudySeconds <= 0) return;
    const minutes = Math.floor(state.freeStudySeconds / 60);
    const xpCalculated = Math.floor(state.freeStudySeconds / 180);

    if (xpCalculated > 0) {
      setPendingXp({
        amount: xpCalculated,
        sessionType: 'LIVRE',
        durationSeconds: state.freeStudySeconds,
      });
    }

    setState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: 0,
      freeStudySeconds: 0,
      totalMinutesToday: prev.totalMinutesToday + minutes,
      weeklyData: prev.weeklyData.map((v, i) =>
        i === 6 ? prev.totalMinutesToday + minutes : v
      ),
    }));
  };

  const setMode = (mode: TimerMode) => {
    setState(prev => ({
      ...prev,
      mode,
      timeLeft: mode === 'free' ? 0 : DURATIONS[mode],
      freeStudySeconds: 0,
      isRunning: false,
      isBiologicalLimitReached: false,
    }));
  };

  return {
    ...state,
    toggleTimer,
    resetTimer,
    finishFreeStudy,
    setMode,
    modeLabel: MODE_LABELS[state.mode],
    duration: state.mode === 'free' ? Math.max(state.freeStudySeconds, 1) : DURATIONS[state.mode],
  };
}
