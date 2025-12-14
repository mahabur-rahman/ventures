import api from './api';

export interface Murmur {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    name?: string;
  };
  likesCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const murmurService = {
  getTimeline: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Murmur>> => {
    const response = await api.get(`/murmurs?page=${page}&limit=${limit}`);
    return response.data;
  },

  getMurmurById: async (id: number): Promise<Murmur> => {
    const response = await api.get(`/murmurs/${id}`);
    return response.data;
  },

  createMurmur: async (content: string): Promise<Murmur> => {
    const response = await api.post('/me/murmurs', { content });
    return response.data;
  },

  deleteMurmur: async (id: number): Promise<void> => {
    await api.delete(`/me/murmurs/${id}`);
  },

  likeMurmur: async (id: number): Promise<void> => {
    await api.post(`/murmurs/${id}/like`);
  },

  unlikeMurmur: async (id: number): Promise<void> => {
    await api.delete(`/murmurs/${id}/like`);
  },

  hasUserLiked: async (id: number): Promise<boolean> => {
    const response = await api.get(`/murmurs/${id}/has-liked`);
    return response.data.hasLiked;
  },
};
