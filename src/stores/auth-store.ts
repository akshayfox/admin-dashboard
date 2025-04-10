import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { User } from '../../shared/schema';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userId: number, updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<User>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
      set({ user: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await apiRequest<void>('/api/auth/logout', {
        method: 'POST',
      });
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateProfile: async (userId, updates) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<User>(`/api/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      set({ user: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
