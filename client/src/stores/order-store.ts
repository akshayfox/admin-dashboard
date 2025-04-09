import { create } from 'zustand';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Order, OrderWithUser, InsertOrder } from '@shared/schema';

interface OrderState {
  orders: OrderWithUser[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchRecentOrders: () => Promise<void>;
  createOrder: (order: InsertOrder) => Promise<void>;
  updateOrderStatus: (id: number, status: string) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  
  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/orders', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ orders: data });
      } else {
        const error = await response.text();
        set({ error: error || 'Failed to fetch orders' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch orders' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchRecentOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/orders/recent', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ orders: data });
      } else {
        const error = await response.text();
        set({ error: error || 'Failed to fetch recent orders' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch recent orders' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createOrder: async (order) => {
    try {
      set({ isLoading: true, error: null });
      await apiRequest('POST', '/api/orders', order);
      
      // Refetch orders to update the store
      await get().fetchOrders();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create order' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateOrderStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      await apiRequest('PATCH', `/api/orders/${id}`, { status });
      
      // Update local state
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      }));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update order status' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteOrder: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiRequest('DELETE', `/api/orders/${id}`);
      
      // Update local state
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id)
      }));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete order' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
