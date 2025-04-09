import { create } from 'zustand';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        set({ user: userData, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Failed to check authentication:', error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  
  login: async (username, password) => {
    try {
      set({ isLoading: true });
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      const userData = await response.json();
      
      set({ user: userData, isAuthenticated: true });
      
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/users/profile'] });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      await apiRequest('POST', '/api/auth/logout', {});
      
      set({ user: null, isAuthenticated: false });
      
      // Clear any user-related queries
      queryClient.invalidateQueries();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
