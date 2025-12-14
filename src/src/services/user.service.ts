import api from './api';
import { Murmur, PaginatedResponse } from './murmur.service';

export interface User {
  id: number;
  username: string;
  name?: string;
  bio?: string;
  createdAt: string;
  murmursCount: number;
  followersCount: number;
  followingCount: number;
}

export const userService = {
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getUserMurmurs: async (id: number, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Murmur>> => {
    const response = await api.get(`/users/${id}/murmurs?page=${page}&limit=${limit}`);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/me');
    return response.data;
  },

  followUser: async (id: number): Promise<void> => {
    await api.post(`/users/${id}/follow`);
  },

  unfollowUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}/follow`);
  },

  isFollowing: async (id: number): Promise<boolean> => {
    const response = await api.get(`/users/${id}/is-following`);
    return response.data.isFollowing;
  },
};
