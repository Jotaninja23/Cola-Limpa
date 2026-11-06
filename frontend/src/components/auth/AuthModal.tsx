import React, { useState, useEffect, useCallback } from 'react';
import { X, Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PinInput } from './PinInput';
import { Logo } from '../common/Logo';

export const AuthModal: React.FC = () => {
  const {
    isLoginModalOpen,
    loginPromptReason,
    closeLoginModal,
    solicitarCodigo,
    validarCodigo,
    loginComGoogle,
    isLoading,
  } = useAuth();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const canResend = countdown === 0;

  const handleClose = useCallback(() => {
    setStep('email');
    setEmail('');
    setOtp('');
    setError(null);
    setCountdown(30);
    closeLoginModal();
  }, [closeLoginModal]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 'otp' && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginModalOpen, handleClose]);

  if (!isLoginModalOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    try {
      await solicitarCodigo(cleanEmail);
      setStep('otp');
      setCountdown(30);
      setOtp('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao solicitar código.');
    }
  };

  const handleOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('O código precisa ter exatamente 6 dígitos numéricos.');
      return;
    }

    try {
      await validarCodigo(email.trim().toLowerCase(), otp);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código inválido ou expirado.');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isLoading) return;
    setError(null);
    try {
      await solicitarCodigo(email.trim().toLowerCase());
      setCountdown(30);
      setOtp('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao reenviar código.');
    }
  };

  const handleGoogleDemoLogin = async () => {
    setError(null);
    try {
      // Em ambiente de teste/dev, simula ou chama autenticação SSO
      await loginComGoogle('mock-google-id-token');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha na autenticação com Google.');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          className="auth-modal-close-btn"
          onClick={handleClose}
          aria-label="Fechar janela de login"
        >
          <X size={20} />
        </button>

        {step === 'email' ? (
          <div className="auth-step-container">
            <div className="auth-modal-header">
              <div className="auth-modal-icon" style={{ background: 'transparent' }}>
                <Logo size={52} aria-hidden="true" />
              </div>
              <h2 id="auth-modal-title">Entre no Cola Limpa</h2>
              <p>Estude com foco, compartilhe na comunidade e ganhe XP!</p>
            </div>

            {loginPromptReason && (
              <div className="auth-prompt-banner" role="status">
                <AlertCircle size={18} />
                <span>{loginPromptReason}</span>
              </div>
            )}

            {error && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="auth-email-input">E-mail de estudante</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="auth-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@etec.sp.gov.br"
                    required
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin-icon" /> Enviando código...
                  </>
                ) : (
                  'Receber Código de Acesso'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>ou continue com</span>
            </div>

            <button
              type="button"
              className="auth-social-btn"
              onClick={handleGoogleDemoLogin}
              disabled={isLoading}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
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
              <span>Continuar com Google</span>
            </button>
          </div>
        ) : (
          <div className="auth-step-container">
            <button
              type="button"
              className="auth-back-btn"
              onClick={() => setStep('email')}
              aria-label="Voltar para alteração de e-mail"
            >
              <ArrowLeft size={16} /> Trocar e-mail
            </button>

            <div className="auth-modal-header">
              <h2 id="auth-modal-title">Código de Confirmação</h2>
              <p>
                Insira o código de 6 dígitos enviado para <strong>{email}</strong>
              </p>
            </div>

            {error && (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="auth-form">
              <PinInput
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
                onComplete={() => handleOtpSubmit()}
              />

              <div className="auth-resend-container">
                {canResend ? (
                  <button
                    type="button"
                    className="auth-resend-btn active"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    Reenviar código
                  </button>
                ) : (
                  <span className="auth-resend-timer">
                    Reenviar código em {countdown}s
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spin-icon" /> Validando...
                  </>
                ) : (
                  'Entrar na Plataforma'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
