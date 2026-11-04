import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('should have initial unauthenticated state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.step).toBe('email');
    expect(result.current.error).toBeNull();
  });

  it('should set error on invalid email during otp request', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.requestOtp('invalid-email');
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Informe um endereço de e-mail válido.');
    expect(result.current.step).toBe('email');
  });

  it('should advance to otp step on valid email request', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.requestOtp('aluno@escola.sp.gov.br');
      expect(success).toBe(true);
    });

    expect(result.current.step).toBe('otp');
    expect(result.current.emailSentTo).toBe('aluno@escola.sp.gov.br');
    expect(result.current.error).toBeNull();
  });

  it('should authenticate user upon valid otp verification', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.requestOtp('aluno@escola.sp.gov.br');
    });

    await act(async () => {
      const success = await result.current.verifyOtp('123456');
      expect(success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('aluno@escola.sp.gov.br');
  });

  it('should authenticate with demo user', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.loginAsDemo();
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.nome).toBe('Estudante ETEC');
  });

  it('should register a new user and authenticate', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.register({
        nome: 'Maria Silva',
        email: 'maria@etec.sp.gov.br',
        telefone: '11988887777',
        metaDiariaMinutos: 120,
        nivelEscolar: '3º Ano - Médio',
      });
      expect(success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.nome).toBe('Maria Silva');
    expect(result.current.user?.metaDiariaMinutos).toBe(120);
  });

  it('should logout and clear state', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.loginAsDemo();
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
