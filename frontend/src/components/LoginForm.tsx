import { useState, type FormEvent } from 'react';
import { Mail, KeyRound, ArrowRight, ShieldCheck, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginFormProps {
  step: 'email' | 'otp';
  emailSentTo: string;
  isLoading: boolean;
  error: string | null;
  onRequestOtp: (email: string) => Promise<boolean>;
  onVerifyOtp: (code: string) => Promise<boolean>;
  onLoginAsDemo: () => void;
  onLoginWithGoogle?: () => void;
  onNavigateToRegister: () => void;
  onNavigateHome: () => void;
  onResetFlow: () => void;
}

export default function LoginForm({
  step,
  emailSentTo,
  isLoading,
  error,
  onRequestOtp,
  onVerifyOtp,
  onLoginAsDemo,
  onLoginWithGoogle,
  onNavigateToRegister,
  onNavigateHome,
  onResetFlow,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;
    await onRequestOtp(email);
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;
    await onVerifyOtp(code);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-icon-badge">
            <ShieldCheck size={26} />
          </div>
          <h2>Acesso à Plataforma</h2>
          <p>
            {step === 'email'
              ? 'Autenticação sem senha via código numérico seguro enviado ao seu e-mail.'
              : `Insira o código de verificação enviado para ${emailSentTo}`}
          </p>
        </header>

        {error && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {step === 'email' ? (
          <form className="auth-form" onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="login-email-input">Endereço de E-mail</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" aria-hidden="true" />
                <input
                  id="login-email-input"
                  type="email"
                  className="auth-input"
                  placeholder="aluno@escola.sp.gov.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading || !email.trim()}
            >
              <span>{isLoading ? 'Enviando código...' : 'Solicitar Código de Acesso'}</span>
              <ArrowRight size={18} />
            </button>

            <div className="auth-divider">
              <span>ou continue com</span>
            </div>

            {onLoginWithGoogle && (
              <button
                type="button"
                className="auth-social-btn"
                onClick={onLoginWithGoogle}
                disabled={isLoading}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar com o Google</span>
              </button>
            )}

            <button
              type="button"
              className="auth-demo-btn"
              onClick={onLoginAsDemo}
              disabled={isLoading}
            >
              <Sparkles size={18} />
              <span>Entrar com Usuário de Demonstração</span>
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="login-otp-input">Código de 6 Dígitos</label>
              <div className="input-with-icon">
                <KeyRound size={18} className="input-icon" aria-hidden="true" />
                <input
                  id="login-otp-input"
                  type="text"
                  maxLength={6}
                  className="auth-input otp-input"
                  placeholder="123456"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading || code.trim().length < 4}
            >
              <span>{isLoading ? 'Verificando...' : 'Confirmar e Entrar'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="auth-back-btn"
              onClick={onResetFlow}
              disabled={isLoading}
            >
              <ArrowLeft size={16} />
              <span>Usar outro endereço de e-mail</span>
            </button>
          </form>
        )}

        <footer className="auth-footer">
          <p>
            Não possui uma conta?{' '}
            <button
              type="button"
              className="auth-link-btn"
              onClick={onNavigateToRegister}
            >
              Cadastre-se gratuitamente
            </button>
          </p>

          <button
            type="button"
            className="auth-home-btn"
            onClick={onNavigateHome}
          >
            Voltar para a página inicial
          </button>
        </footer>
      </div>
    </div>
  );
}
