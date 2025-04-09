import { useQuery } from "@tanstack/react-query";
import AnalyticsCards from "@/components/dashboard/AnalyticsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import TopProducts from "@/components/dashboard/TopProducts";
import RecentOrders from "@/components/dashboard/RecentOrders";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationStore } from "@/stores/notification-store";
import { useState } from "react";
import type { DashboardStats, TopProduct, SalesData, OrderWithUser } from "@shared/schema";

const Dashboard = () => {
  const { showNotification } = useNotificationStore();
  const [timeRange, setTimeRange] = useState("monthly");

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch top products
  const { data: topProducts, isLoading: productsLoading } = useQuery<TopProduct[]>({
    queryKey: ['/api/dashboard/top-products'],
  });

  // Fetch sales data for chart
  const { data: salesData, isLoading: salesLoading } = useQuery<SalesData[]>({
    queryKey: ['/api/dashboard/sales', timeRange],
  });

  // Fetch recent orders
  const { data: recentOrders, isLoading: ordersLoading } = useQuery<OrderWithUser[]>({
    queryKey: ['/api/orders/recent'],
  });

  const handleExport = () => {
    showNotification({
      title: "Export Started",
      message: "Your dashboard data is being exported.",
      type: "success"
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, John Doe</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Last 30 days</span>
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {statsLoading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <AnalyticsCards stats={stats} />
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-6">
        {salesLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm lg:col-span-2">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : (
          <SalesChart 
            data={salesData} 
            timeRange={timeRange} 
            onRangeChange={setTimeRange} 
          />
        )}

        {productsLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
            <Skeleton className="h-6 w-32 mb-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <TopProducts products={topProducts} />
        )}
      </div>

      {ordersLoading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <RecentOrders orders={recentOrders} />
      )}
    </div>
  );
};

export default Dashboard;
