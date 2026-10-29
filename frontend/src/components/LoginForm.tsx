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
              <span>ou</span>
            </div>

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
