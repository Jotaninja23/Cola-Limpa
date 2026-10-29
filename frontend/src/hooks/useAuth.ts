import { useContext } from 'react';
import { AuthContext, DEFAULT_AUTH_CONTEXT } from '../context/authContextDef';
import type { AuthContextType } from '../types/auth';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    return DEFAULT_AUTH_CONTEXT;
  }
  return context;
}
