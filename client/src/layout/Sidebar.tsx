import { Link, useLocation } from "wouter";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useAuthStore } from "@/stores/auth-store";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  LineChart,
  Users,
  Package,
  ClipboardCheck,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck
} from "lucide-react";

const navItems = [
  {
    heading: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5 mr-2 text-indigo-500" /> },
      { name: "Analytics", href: "/analytics", icon: <LineChart className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> },
      { name: "Users", href: "/users", icon: <Users className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> },
      { name: "Products", href: "/products", icon: <Package className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> },
      { name: "Orders", href: "/orders", icon: <ClipboardCheck className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> }
    ]
  },
  {
    heading: "Settings",
    items: [
      { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> },
      { name: "Help & Support", href: "/help", icon: <HelpCircle className="h-5 w-5 mr-2 text-slate-500 dark:text-slate-400" /> }
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();
  const { isOpen, toggle, close } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const isMobile = useIsMobile();

  // In mobile view, manage sidebar visibility with transform and overlay
  const sidebarClasses = `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 ${
    !isOpen ? '-translate-x-full' : 'translate-x-0'
  } md:translate-x-0`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden" 
          onClick={close}
          aria-hidden="true"
        />
      )}
      
      <aside className={sidebarClasses} data-state={isOpen ? "open" : "closed"}>
        {/* Logo and Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold dark:text-white">AdminPro</span>
          </Link>
          {isMobile && (
            <button 
              onClick={close}
              className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((section, i) => (
              <div key={i}>
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  {section.heading}
                </div>
                {section.items.map((item, j) => {
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={j}
                      href={item.href}
                      onClick={() => isMobile && close()}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center">
            <img 
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
              alt="User avatar" 
              className="h-8 w-8 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {user?.fullName || "John Doe"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.role || "Administrator"}
              </p>
            </div>
            <button 
              onClick={logout}
              className="ml-auto p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}