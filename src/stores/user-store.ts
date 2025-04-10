import { create } from 'zustand';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { User, InsertUser } from '../../shared/schema';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (user: InsertUser) => Promise<User>;
  updateUser: (id: number, user: Partial<InsertUser>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/users', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ users: data });
      } else {
        const error = await response.text();
        set({ error: error || 'Failed to fetch users' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch users' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createUser: async (user) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiRequest('POST', '/api/users', user);
      const newUser = await response.json();
      
      // Update local state
      set((state) => ({
        users: [...state.users, newUser]
      }));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      
      return newUser;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create user' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateUser: async (id, user) => {
    try {
      set({ isLoading: true, error: null });
      await apiRequest('PATCH', `/api/users/${id}`, user);
      
      // Update local state
      set((state) => ({
        users: state.users.map((u) =>
          u.id === id ? { ...u, ...user } : u
        )
      }));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', id] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update user' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteUser: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiRequest('DELETE', `/api/users/${id}`);
      
      // Update local state
      set((state) => ({
        users: state.users.filter((u) => u.id !== id)
      }));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete user' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
