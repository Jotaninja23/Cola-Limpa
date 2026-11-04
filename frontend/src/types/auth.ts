export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  fotoUrl?: string | null;
  xp: number;
  metaDiariaMinutos?: number | null;
  nivelEscolar?: string | null;
  isAdmin?: boolean;
  dataCriacao?: string;
}

export type AuthUser = UserProfile;

export interface TokenResponse {
  token: string;
  usuario: AuthUser;
}

export interface GoogleLoginPayload {
  idToken: string;
}

export interface RegisterFormData {
  nome: string;
  email: string;
  telefone: string;
  metaDiariaMinutos: number;
  nivelEscolar: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  step: 'email' | 'otp';
  emailSentTo: string;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  step: 'email' | 'otp';
  emailSentTo: string;
  isLoginModalOpen: boolean;
  loginPromptReason: string | null;
  solicitarCodigo: (email: string) => Promise<void>;
  validarCodigo: (email: string, codigo: string) => Promise<void>;
  loginComGoogle: (idToken: string) => Promise<void>;
  requestOtp: (email: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  loginAsDemo: () => void;
  register: (data: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  resetAuthFlow: () => void;
  openLoginModal: (reason?: string) => void;
  closeLoginModal: () => void;
}
