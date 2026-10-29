export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  fotoUrl?: string;
  xp: number;
  metaDiariaMinutos?: number;
  nivelEscolar?: string;
  isAdmin?: boolean;
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
