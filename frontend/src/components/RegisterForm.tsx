import { useState, type FormEvent } from 'react';
import { User, Mail, Phone, Clock, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';
import type { RegisterFormData } from '../types/auth';

interface RegisterFormProps {
  isLoading: boolean;
  error: string | null;
  onRegister: (data: RegisterFormData) => Promise<boolean>;
  onLoginWithGoogle?: () => void;
  onNavigateToLogin: () => void;
  onNavigateHome: () => void;
}

const NIVEIS_ESCOLARES = [
  'Ensino Fundamental II',
  '1º / 2º Ano - Ensino Médio',
  '3º Ano - Ensino Técnico / Médio',
  'Pré-Vestibular / Preparatório ENEM',
];

const METAS_MINUTOS = [
  { value: 30, label: '30 min / dia' },
  { value: 60, label: '1 hora / dia' },
  { value: 90, label: '1h 30min / dia' },
  { value: 120, label: '2 horas / dia' },
];

export default function RegisterForm({
  isLoading,
  error,
  onRegister,
  onLoginWithGoogle,
  onNavigateToLogin,
  onNavigateHome,
}: RegisterFormProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nivelEscolar, setNivelEscolar] = useState(NIVEIS_ESCOLARES[2]);
  const [metaDiariaMinutos, setMetaDiariaMinutos] = useState(90);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || isLoading) return;

    await onRegister({
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      nivelEscolar,
      metaDiariaMinutos,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <header className="auth-header">
          <div className="auth-icon-badge">
            <GraduationCap size={26} />
          </div>
          <h2>Cadastro de Estudante</h2>
          <p>Crie seu perfil acadêmico para acumular XP e salvar seus registros de foco.</p>
        </header>

        {error && (
          <div className="auth-error-alert" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-nome-input">Nome Completo</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" aria-hidden="true" />
              <input
                id="register-nome-input"
                type="text"
                className="auth-input"
                placeholder="Ex: João Vitor"
                value={nome}
                onChange={e => setNome(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email-input">Endereço de E-mail</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" aria-hidden="true" />
              <input
                id="register-email-input"
                type="email"
                className="auth-input"
                placeholder="aluno@escola.sp.gov.br"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-telefone-input">Telefone / WhatsApp (opcional)</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" aria-hidden="true" />
              <input
                id="register-telefone-input"
                type="tel"
                className="auth-input"
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-nivel-select">Nível Escolar</label>
            <div className="input-with-icon">
              <GraduationCap size={18} className="input-icon" aria-hidden="true" />
              <select
                id="register-nivel-select"
                className="auth-select"
                value={nivelEscolar}
                onChange={e => setNivelEscolar(e.target.value)}
                disabled={isLoading}
              >
                {NIVEIS_ESCOLARES.map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-meta-select">Meta Diária de Foco</label>
            <div className="input-with-icon">
              <Clock size={18} className="input-icon" aria-hidden="true" />
              <select
                id="register-meta-select"
                className="auth-select"
                value={metaDiariaMinutos}
                onChange={e => setMetaDiariaMinutos(Number(e.target.value))}
                disabled={isLoading}
              >
                {METAS_MINUTOS.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading || !nome.trim() || !email.trim()}
          >
            <span>{isLoading ? 'Cadastrando...' : 'Finalizar Cadastro e Entrar'}</span>
            <ArrowRight size={18} />
          </button>

          {onLoginWithGoogle && (
            <>
              <div className="auth-divider">
                <span>ou</span>
              </div>

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
                <span>Cadastrar com o Google</span>
              </button>
            </>
          )}
        </form>

        <footer className="auth-footer">
          <p>
            Já possui uma conta?{' '}
            <button
              type="button"
              className="auth-link-btn"
              onClick={onNavigateToLogin}
            >
              Fazer login
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
