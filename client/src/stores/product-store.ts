import { create } from 'zustand';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Product, InsertProduct } from '@shared/schema';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: InsertProduct) => Promise<void>;
  updateProduct: (id: number, product: Partial<InsertProduct>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/products', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ products: data });
      } else {
        const error = await response.text();
        set({ error: error || 'Failed to fetch products' });
      }
    } catch (error) {
      set({ error: error.message || 'Failed to fetch products' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createProduct: async (product) => {
    try {
      set({ isLoading: true, error: null });
      await apiRequest('POST', '/api/products', product);
      
      // Refetch products to update the store
      await get().fetchProducts();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    } catch (error) {
      set({ error: error.message || 'Failed to create product' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateProduct: async (id, product) => {
    try {
      set({ isLoading: true, error: null });
      await apiRequest('PATCH', `/api/products/${id}`, product);
      
      // Update local state
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...product } : p
        )
      }));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products', id] });
    } catch (error) {
      set({ error: error.message || 'Failed to update product' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await apiRequest('DELETE', `/api/products/${id}`);
      
      // Update local state
      set((state) => ({
        products: state.products.filter((p) => p.id !== id)
      }));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    } catch (error) {
      set({ error: error.message || 'Failed to delete product' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
