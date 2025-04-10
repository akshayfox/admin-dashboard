import { useEffect } from "react";
import { Switch, Route } from "wouter";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import NotFound from "@/pages/not-found";
import { useThemeStore } from "./stores/theme-store";
import { useThemeConfig } from "./stores/theme-config-store";
import { Notifications } from "./components/ui/notifications";
import type { FC } from 'react';

const Router: FC = () => {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/products" component={Products} />
      <Route path="/users" component={Users} />
      <Route path="/orders" component={Orders} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
};

const App: FC = () => {
  const { theme, initTheme } = useThemeStore();
  const { theme: colorTheme } = useThemeConfig();
  
  useEffect(() => {
    // Initialize theme from localStorage or system preference
    initTheme();
  }, [initTheme]);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <MainLayout>
        <Router />
      </MainLayout>
      <Notifications />
    </>
  );
};

export default App;
