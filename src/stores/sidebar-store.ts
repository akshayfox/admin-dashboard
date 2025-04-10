import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

// Helper to detect if we're on mobile initially
const isInitiallyMobile = typeof window !== 'undefined' 
  ? window.innerWidth < 768 
  : false;

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: !isInitiallyMobile,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      close: () => set({ isOpen: false }),
      open: () => set({ isOpen: true }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);
