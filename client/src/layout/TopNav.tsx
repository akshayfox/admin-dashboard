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
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggle}
            className="p-2 mr-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            aria-label="Toggle Sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input 
              type="search" 
              placeholder="Search..." 
              className="h-9 w-48 md:w-64 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-slate-600 pl-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button className="p-2 relative rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
            <Bell className="h-5 w-5" />
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
