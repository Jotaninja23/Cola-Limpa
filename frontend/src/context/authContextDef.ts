import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

export const DEFAULT_AUTH_CONTEXT: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  step: 'email',
  emailSentTo: '',
  isLoginModalOpen: false,
  loginPromptReason: null,
  solicitarCodigo: async () => {},
  validarCodigo: async () => {},
  loginComGoogle: async () => {},
  requestOtp: async () => false,
  verifyOtp: async () => false,
  loginAsDemo: () => {},
  register: async () => false,
  logout: () => {},
  resetAuthFlow: () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
