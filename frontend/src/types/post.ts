export interface Post {
  id: number;
  author: string;
  authorId?: number;
  avatar: string;
  time: string;
  tag: string;
  materia?: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  reports?: number;
}

export interface PostApiPayload {
  titulo: string;
  texto: string;
  categoria: string;
  materia: string;
}

export interface PostApiResponse {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  usuarioFotoUrl?: string | null;
  titulo: string;
  texto: string;
  categoria: string;
  materia: string;
  qtCurtidas: number;
  qtDenuncias: number;
  dataCriacao: string;
}

