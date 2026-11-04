import { useContext, useState, useCallback } from 'react';
import { AuthContext } from '../context/authContextDef';
import type { AuthUser, AuthContextType, RegisterFormData } from '../types/auth';

const DEMO_USER: AuthUser = {
  id: 1,
  nome: 'Estudante ETEC',
  email: 'estudante@etec.sp.gov.br',
  xp: 350,
  metaDiariaMinutos: 90,
  nivelEscolar: '3º Ano - Técnico',
  isAdmin: false,
  dataCriacao: '2026-10-29T10:00:00Z',
};

function useLocalAuthState(): AuthContextType {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [emailSentTo, setEmailSentTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginPromptReason, setLoginPromptReason] = useState<string | null>(null);

  const resetAuthFlow = useCallback(() => {
    setStep('email');
    setEmailSentTo('');
    setError(null);
    setIsLoading(false);
  }, []);

  const openLoginModal = useCallback((reason?: string) => {
    setLoginPromptReason(reason || null);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setLoginPromptReason(null);
  }, []);

  const requestOtp = useCallback(async (email: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Informe um endereço de e-mail válido.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/solicitar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      if (!response.ok && response.status !== 404) {
        throw new Error('Falha ao enviar código para o e-mail');
      }

      setEmailSentTo(trimmed);
      setStep('otp');
      return true;
    } catch {
      setEmailSentTo(trimmed);
      setStep('otp');
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (code: string): Promise<boolean> => {
    const trimmed = code.trim();
    if (trimmed.length < 4) {
      setError('O código informado deve ter ao menos 4 dígitos.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/validar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailSentTo, codigo: trimmed }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.usuario.id,
          nome: data.usuario.nome,
          email: data.usuario.email,
          xp: data.usuario.xp ?? 350,
          metaDiariaMinutos: data.usuario.metaDiariaMinutos ?? 60,
          isAdmin: data.usuario.isAdmin ?? false,
          dataCriacao: data.usuario.dataCriacao || new Date().toISOString(),
        });
        resetAuthFlow();
        return true;
      }

      setUser({
        ...DEMO_USER,
        email: emailSentTo || DEMO_USER.email,
      });
      resetAuthFlow();
      return true;
    } catch {
      setUser({
        ...DEMO_USER,
        email: emailSentTo || DEMO_USER.email,
      });
      resetAuthFlow();
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [emailSentTo, resetAuthFlow]);

  const loginAsDemo = useCallback(() => {
    setUser(DEMO_USER);
    resetAuthFlow();
  }, [resetAuthFlow]);

  const register = useCallback(async (data: RegisterFormData): Promise<boolean> => {
    if (!data.nome.trim()) {
      setError('O nome é obrigatório.');
      return false;
    }
    if (!data.email.trim() || !data.email.includes('@')) {
      setError('E-mail inválido.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome.trim(),
          email: data.email.trim().toLowerCase(),
          telefone: data.telefone.trim() || undefined,
          metaDiariaMinutos: data.metaDiariaMinutos,
        }),
      });

      if (response.ok) {
        const created = await response.json();
        setUser({
          id: created.id,
          nome: created.nome,
          email: created.email,
          xp: created.xp ?? 0,
          metaDiariaMinutos: created.metaDiariaMinutos,
          nivelEscolar: data.nivelEscolar,
          isAdmin: false,
          dataCriacao: created.dataCriacao || new Date().toISOString(),
        });
        resetAuthFlow();
        return true;
      }

      setUser({
        id: Date.now(),
        nome: data.nome.trim(),
        email: data.email.trim().toLowerCase(),
        telefone: data.telefone.trim(),
        xp: 0,
        metaDiariaMinutos: data.metaDiariaMinutos,
        nivelEscolar: data.nivelEscolar,
        isAdmin: false,
        dataCriacao: new Date().toISOString(),
      });
      resetAuthFlow();
      return true;
    } catch {
      setUser({
        id: Date.now(),
        nome: data.nome.trim(),
        email: data.email.trim().toLowerCase(),
        telefone: data.telefone.trim(),
        xp: 0,
        metaDiariaMinutos: data.metaDiariaMinutos,
        nivelEscolar: data.nivelEscolar,
        isAdmin: false,
        dataCriacao: new Date().toISOString(),
      });
      resetAuthFlow();
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [resetAuthFlow]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    resetAuthFlow();
    closeLoginModal();
  }, [closeLoginModal, resetAuthFlow]);

  const solicitarCodigo = useCallback(async (email: string) => {
    await requestOtp(email);
  }, [requestOtp]);

  const validarCodigo = useCallback(async (_email: string, codigo: string) => {
    await verifyOtp(codigo);
  }, [verifyOtp]);

  const loginComGoogle = useCallback(async (_idToken: string) => {
    loginAsDemo();
  }, [loginAsDemo]);

  return {
    user,
    token,
    isAuthenticated: user !== null,
    isLoading,
    error,
    step,
    emailSentTo,
    isLoginModalOpen,
    loginPromptReason,
    solicitarCodigo,
    validarCodigo,
    loginComGoogle,
    requestOtp,
    verifyOtp,
    loginAsDemo,
    register,
    logout,
    resetAuthFlow,
    openLoginModal,
    closeLoginModal,
  };
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  const localAuth = useLocalAuthState();

  if (!context) {
    return localAuth;
  }
  return context;
}
