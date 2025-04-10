import { Search, Menu, Moon, Sun, Bell } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useThemeStore } from "@/stores/theme-store";
import { useNotificationStore } from "@/stores/notification-store";

const TopNav = () => {
  const { toggle } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications } = useNotificationStore();
  
  const hasUnreadNotifications = notifications.some(note => !note.isRead);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 dark:border-slate-800/70 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggle}
            className="p-2 mr-3 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input 
              type="search" 
              placeholder="Search..." 
              className="h-10 w-48 lg:w-64 rounded-lg border-none bg-slate-100/80 dark:bg-slate-800/80 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-primary/30 pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-800/80 transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button 
            className="p-2.5 relative rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-800/80 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {hasUnreadNotifications && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
