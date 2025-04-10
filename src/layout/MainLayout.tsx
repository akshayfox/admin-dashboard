import { FC, useEffect, lazy, Suspense } from "react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header/Header";
import { ThemeSelector } from "@/components/theme/theme-selector";
import { useThemeConfig } from "@/stores/theme-config-store";
import { Menu, Sun, Moon } from "lucide-react";

// Lazy load Sidebar to avoid circular dependencies
const Sidebar = lazy(() => import("./Sidebar"));

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { isOpen, toggle } = useSidebarStore();
  const { theme: colorMode, toggleTheme } = useThemeStore();
  const { theme } = useThemeConfig();

  // Apply theme on mount and when it changes
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      root.style.setProperty(`--${cssKey}`, value);
    });
  }, [theme]);

  return (
    <div className={cn(
      "min-h-screen bg-background/95 antialiased",
      colorMode === "dark" ? "dark" : ""
    )}>
      {/* Mobile Menu Button */}
      <button
        onClick={toggle}
        className="fixed md:hidden top-3 right-4 z-50 p-2.5 bg-background/95 rounded-xl border shadow-sm hover:bg-accent/50 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" 
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      {/* Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Suspense fallback={null}>
          <div className={cn(
            "fixed md:sticky top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "md:translate-x-0",
            isOpen ? "md:w-[280px]" : "md:w-0"
          )}>
            <div className={cn(
              "h-full bg-card/95 backdrop-blur-sm border-r shadow-lg",
              "w-[280px] transition-all duration-300 ease-in-out",
              !isOpen && "md:w-0 md:min-w-0 md:opacity-0 md:overflow-hidden"
            )}>
              <Sidebar />
            </div>
          </div>
        </Suspense>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out"
        )}>
          <Header>
            <div className="flex items-center gap-3">
              <button
                onClick={toggle}
                className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="h-6 w-px bg-border" />
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-accent/50 transition-colors"
                title={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {colorMode === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <ThemeSelector />
            </div>
          </Header>
          
          <div className="container mx-auto max-w-full p-4 md:p-6 lg:p-8">
  <div className={cn(
    "mx-auto transition-all duration-300 ease-in-out",
    isOpen ? "max-w-full" : "max-w-full"
  )}>
    <div className="grid gap-4 md:gap-6 lg:gap-8">
      {children}
    </div>
  </div>
</div>

        </main>
      </div>
    </div>
  );
};

export default MainLayout;
