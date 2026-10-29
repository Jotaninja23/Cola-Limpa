export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  fotoUrl?: string | null;
  xp: number;
  metaDiariaMinutos?: number | null;
  isAdmin: boolean;
  dataCriacao: string;
}

export interface TokenResponse {
  token: string;
  usuario: AuthUser;
}

export interface GoogleLoginPayload {
  idToken: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  loginPromptReason: string | null;
  solicitarCodigo: (email: string) => Promise<void>;
  validarCodigo: (email: string, codigo: string) => Promise<void>;
  loginComGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  openLoginModal: (reason?: string) => void;
  closeLoginModal: () => void;
}

