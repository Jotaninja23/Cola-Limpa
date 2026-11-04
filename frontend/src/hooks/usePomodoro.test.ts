import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePomodoro } from './usePomodoro';

describe('usePomodoro', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default focus values', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    expect(result.current.mode).toBe('focus');
    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.duration).toBe(1500);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.modeLabel).toBe('Foco');
    expect(result.current.sessionsCompleted).toBe(0);
    expect(result.current.totalMinutesToday).toBe(0);
  });

  it('should toggle timer running state', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    act(() => {
      result.current.toggleTimer();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.toggleTimer();
    });
    expect(result.current.isRunning).toBe(false);
  });

  it('should decrement timeLeft when running', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(1497);
  });

  it('should reset timer to mode default duration', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.timeLeft).toBe(1490);

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.isRunning).toBe(false);
  });

  it('should change mode correctly', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    act(() => {
      result.current.setMode('shortBreak');
    });

    expect(result.current.mode).toBe('shortBreak');
    expect(result.current.timeLeft).toBe(300);
    expect(result.current.modeLabel).toBe('Pausa Curta');

    act(() => {
      result.current.setMode('longBreak');
    });

    expect(result.current.mode).toBe('longBreak');
    expect(result.current.timeLeft).toBe(900);
    expect(result.current.modeLabel).toBe('Pausa Longa');
  });

  it('should finish focus session, award 25 XP, and transition to short break', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(1500 * 1000);
    });

    expect(handleXpGain).toHaveBeenCalledWith(25);
    expect(result.current.sessionsCompleted).toBe(1);
    expect(result.current.totalMinutesToday).toBe(25);
    expect(result.current.mode).toBe('shortBreak');
    expect(result.current.timeLeft).toBe(300);
    expect(result.current.isRunning).toBe(false);
  });

  it('should switch to long break after 4 completed focus sessions', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    for (let session = 1; session <= 4; session++) {
      act(() => {
        result.current.setMode('focus');
        result.current.toggleTimer();
      });

      act(() => {
        vi.advanceTimersByTime(1500 * 1000);
      });
    }

    expect(result.current.sessionsCompleted).toBe(4);
    expect(result.current.mode).toBe('longBreak');
    expect(result.current.timeLeft).toBe(900);
  });

  it('should award 10 XP on break completion and transition back to focus', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    act(() => {
      result.current.setMode('shortBreak');
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(300 * 1000);
    });

    expect(handleXpGain).toHaveBeenCalledWith(10);
    expect(result.current.mode).toBe('focus');
    expect(result.current.timeLeft).toBe(1500);
  });

  it('should support free study mode counting upwards and awarding proportional XP on finish', () => {
    const handleXpGain = vi.fn();
    const { result } = renderHook(() => usePomodoro(handleXpGain));

    act(() => {
      result.current.setMode('free');
    });

    expect(result.current.mode).toBe('free');
    expect(result.current.modeLabel).toBe('Estudo Livre');
    expect(result.current.timeLeft).toBe(0);

    act(() => {
      result.current.toggleTimer();
    });

    act(() => {
      vi.advanceTimersByTime(360 * 1000); // 360 segundos = 6 minutos = 2 XP (180s por XP)
    });

    expect(result.current.freeStudySeconds).toBe(360);
    expect(result.current.timeLeft).toBe(360);

    act(() => {
      result.current.finishFreeStudy();
    });

    expect(handleXpGain).toHaveBeenCalledWith(2);
    expect(result.current.totalMinutesToday).toBe(6);
    expect(result.current.freeStudySeconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });
});

