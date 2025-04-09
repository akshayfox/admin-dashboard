import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

// Helper to detect if we're on mobile initially
const isInitiallyMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

export const useSidebarStore = create<SidebarState>((set) => ({
  // Default to closed on mobile, open on desktop
  isOpen: !isInitiallyMobile,
  
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  
  open: () => set({ isOpen: true }),
  
  close: () => set({ isOpen: false })
}));
