import React, { useState, useEffect, useCallback } from 'react';
import type { AuthUser, AuthContextType } from '../types/auth';
import { authService } from '../services/authService';
import { AuthContext } from './authContextDef';

const TOKEN_KEY = 'cola_limpa_token';
const USER_KEY = 'cola_limpa_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginPromptReason, setLoginPromptReason] = useState<string | null>(null);

  const openLoginModal = useCallback((reason?: string) => {
    setLoginPromptReason(reason || null);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setLoginPromptReason(null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
    closeLoginModal();
  }, [closeLoginModal]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      openLoginModal('Sua sessão expirou. Conecte-se novamente para continuar.');
    };

    window.addEventListener('cola_limpa_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('cola_limpa_unauthorized', handleUnauthorized);
    };
  }, [logout, openLoginModal]);

  const solicitarCodigo = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await authService.solicitarCodigo(email);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validarCodigo = useCallback(async (email: string, codigo: string) => {
    setIsLoading(true);
    try {
      const response = await authService.validarCodigo(email, codigo);
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.usuario));
      setToken(response.token);
      setUser(response.usuario);
      closeLoginModal();
    } finally {
      setIsLoading(false);
    }
  }, [closeLoginModal]);

  const loginComGoogle = useCallback(async (idToken: string) => {
    setIsLoading(true);
    try {
      const response = await authService.loginComGoogle(idToken);
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.usuario));
      setToken(response.token);
      setUser(response.usuario);
      closeLoginModal();
    } finally {
      setIsLoading(false);
    }
  }, [closeLoginModal]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    isLoginModalOpen,
    loginPromptReason,
    solicitarCodigo,
    validarCodigo,
    loginComGoogle,
    logout,
    openLoginModal,
    closeLoginModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
