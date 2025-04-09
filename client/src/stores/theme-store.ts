import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  initTheme: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  
  initTheme: () => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      set({ theme: 'dark' });
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      set({ theme: 'light' });
      document.documentElement.classList.remove('dark');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set({ theme: systemPrefersDark ? 'dark' : 'light' });
      
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    });
  },
  
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
  }
}));
