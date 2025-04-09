import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { isOpen } = useSidebarStore();
  const isMobile = useIsMobile();

  // Calculate main content margin based on sidebar state
  const mainContentClass = `flex-1 transition-all duration-300 ease-in-out ${isOpen ? 'md:ml-64' : ''}`;

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar />
      
      <div className={`flex flex-col w-full ${mainContentClass}`}>
        <TopNav />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
