import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  initTheme: () => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

interface MediaQueryList {
  matches: boolean;
  addEventListener(type: string, listener: (e: MediaQueryListEvent) => void): void;
  removeEventListener(type: string, listener: (e: MediaQueryListEvent) => void): void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  
  initTheme: () => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      set({ theme: savedTheme });
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme: Theme = systemPrefersDark ? 'dark' : 'light';
      set({ theme });
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    }
  },
  
  toggleTheme: () => {
    set((state) => {
      const newTheme: Theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    });
  },
  
  setTheme: (theme: Theme) => {
    set({ theme });
    localStorage.setItem('theme', theme);
  }
}));
