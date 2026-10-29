import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

export const DEFAULT_AUTH_CONTEXT: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isLoginModalOpen: false,
  loginPromptReason: null,
  solicitarCodigo: async () => {},
  validarCodigo: async () => {},
  loginComGoogle: async () => {},
  logout: () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

