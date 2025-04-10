import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Product, InsertProduct } from '../../shared/schema';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: InsertProduct) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<Product[]>('/api/products');
      set({ products: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      set((state) => ({
        products: [...state.products, data],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      const data = await apiRequest<Product>(`/api/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(product),
      });
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? data : p)),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiRequest<void>(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
