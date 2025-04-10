import { Link, useLocation } from "wouter";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useAuthStore } from "@/stores/auth-store";
import {
  LayoutDashboard,
  LineChart,
  Users,
  Package,
  ClipboardCheck,
  Settings,
  HelpCircle,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

const navItems = [
  {
    heading: "Overview",
    items: [
      { 
        name: "Dashboard", 
        href: "/dashboard", 
        icon: <LayoutDashboard className="h-4.5 w-4.5" />,
        description: "View your analytics and metrics"
      },
      { 
        name: "Analytics", 
        href: "/analytics", 
        icon: <LineChart className="h-4.5 w-4.5" />,
        description: "Track your performance"
      },
    ]
  },
  {
    heading: "Management",
    items: [
      { 
        name: "Users", 
        href: "/users", 
        icon: <Users className="h-4.5 w-4.5" />,
        description: "Manage user accounts"
      },
      { 
        name: "Products", 
        href: "/products", 
        icon: <Package className="h-4.5 w-4.5" />,
        description: "View and edit products"
      },
      { 
        name: "Orders", 
        href: "/orders", 
        icon: <ClipboardCheck className="h-4.5 w-4.5" />,
        description: "Track customer orders"
      }
    ]
  },
  {
    heading: "System",
    items: [
      { 
        name: "Settings", 
        href: "/settings", 
        icon: <Settings className="h-4.5 w-4.5" />,
        description: "Customize your workspace"
      },
      { 
        name: "Help & Support", 
        href: "/help", 
        icon: <HelpCircle className="h-4.5 w-4.5" />,
        description: "Get help and documentation"
      }
    ]
  }
];

export default function Sidebar() {
  const [location] = useLocation();
  const { close } = useSidebarStore();
  const { user, logout } = useAuthStore();

  const handleNavigation = useCallback(() => {
    if (window.innerWidth < 768) {
      close();
    }
  }, [close]);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={handleNavigation}>
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">AdminPro</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          {navItems.map((section, i) => (
            <div key={i} className="space-y-3">
              <h2 className="px-2 text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
                {section.heading}
              </h2>
              <div className="space-y-1">
                {section.items.map((item, j) => {
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={j}
                      href={item.href}
                      onClick={handleNavigation}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent/50",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isActive ? "bg-background text-primary" : "text-muted-foreground/70 group-hover:text-foreground/70"
                        )}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="line-clamp-1 font-medium leading-none tracking-tight mb-1">
                            {item.name}
                          </div>
                          <div className="line-clamp-1 text-xs text-muted-foreground/70">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        isActive ? "text-foreground" : "text-muted-foreground/30",
                        "group-hover:translate-x-0.5 group-hover:text-foreground/70"
                      )} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t p-6">
        <div className="flex items-center gap-3 rounded-xl bg-accent/50 p-3.5">
          <img 
            src={user?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
            alt="User avatar" 
            className="h-10 w-10 rounded-lg ring-2 ring-background"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium tracking-tight truncate">
              {user?.fullName || "John Doe"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role || "Administrator"}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Logout"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}