import React from 'react';
import { LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const UserMenu: React.FC = () => {
  const { user, isAuthenticated, openLoginModal, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="sidebar-auth-guest">
        <button
          className="sidebar-login-btn"
          onClick={() => openLoginModal()}
          aria-label="Entrar na conta"
        >
          <LogIn size={18} />
          <span>Fazer Login</span>
        </button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="sidebar-user-card">
      <div className="sidebar-user-info">
        {user.fotoUrl ? (
          <img src={user.fotoUrl} alt={user.nome} className="sidebar-user-avatar" />
        ) : (
          <div className="sidebar-user-avatar-placeholder">
            {getInitials(user.nome)}
          </div>
        )}
        <div className="sidebar-user-details">
          <div className="sidebar-user-name-row">
            <span className="sidebar-user-name" title={user.nome}>
              {user.nome}
            </span>
            {user.isAdmin && (
              <span className="admin-badge" title="Administrador">
                <ShieldCheck size={14} />
              </span>
            )}
          </div>
          <span className="sidebar-user-email" title={user.email}>
            {user.email}
          </span>
        </div>
      </div>
      <button
        className="sidebar-logout-btn"
        onClick={logout}
        title="Encerrar sessão"
        aria-label="Encerrar sessão"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};
