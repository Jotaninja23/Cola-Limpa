import { apiClient } from './apiClient';

export interface CronometroSessionPayload {
  tempoSegundos: number;
  tipoSessao: string;
}

export interface CronometroSessionResponse {
  id: number;
  usuarioId: number;
  tempoSegundos: number;
  tipoSessao: string;
  xpGanho: number;
  dataCriacao: string;
}

export const cronometroService = {
  async salvarSessao(payload: CronometroSessionPayload): Promise<CronometroSessionResponse> {
    return apiClient<CronometroSessionResponse>('/api/cronometro', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listarHistorico(usuarioId: number): Promise<CronometroSessionResponse[]> {
    return apiClient<CronometroSessionResponse[]>(`/api/cronometro/usuario/${usuarioId}`);
  },
};

