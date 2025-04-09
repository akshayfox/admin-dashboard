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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className={`flex flex-col flex-1 ${!isMobile ? 'md:ml-64' : ''}`}>
        <TopNav />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
