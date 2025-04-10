import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Order, OrderWithUser, InsertOrder, OrderStatus } from '../../shared/schema';

interface OrderState {
  orders: OrderWithUser[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  addOrder: (order: InsertOrder) => Promise<void>;
  updateOrder: (id: number, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<OrderWithUser[]>('/api/orders');
      set({ orders: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addOrder: async (order) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<OrderWithUser>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order),
      });
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      set((state) => ({
        orders: [...state.orders, data],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateOrder: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<OrderWithUser>(`/api/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? data : o)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<OrderWithUser>(`/api/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      
      set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? data : o)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiRequest<void>(`/api/orders/${id}`, {
        method: 'DELETE',
      });
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
