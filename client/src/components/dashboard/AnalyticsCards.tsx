import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@shared/schema";

interface AnalyticsCardsProps {
  stats?: DashboardStats;
}

const AnalyticsCards = ({ stats }: AnalyticsCardsProps) => {
  if (!stats) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      previousValue: `$${stats.todayRevenue.toFixed(2)} today`,
      percentChange: stats.todayRevenue > 0 ? (stats.todayRevenue / stats.totalRevenue) * 100 : 0,
      progressWidth: "72%",
      progressColor: "bg-emerald-500"
    },
    {
      title: "Orders",
      value: stats.totalOrders.toLocaleString(),
      previousValue: `${stats.pendingOrders} pending`,
      percentChange: stats.totalOrders > 0 ? (stats.pendingOrders / stats.totalOrders) * 100 : 0,
      progressWidth: "58%",
      progressColor: "bg-indigo-500"
    },
    {
      title: "Products",
      value: stats.totalProducts.toLocaleString(),
      previousValue: `${stats.lowStockProducts} low stock`,
      percentChange: stats.totalProducts > 0 ? (stats.lowStockProducts / stats.totalProducts) * 100 : 0,
      progressWidth: "35%",
      progressColor: "bg-amber-500"
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      previousValue: `${stats.completedOrders} completed orders`,
      percentChange: stats.totalOrders > 0 ? (stats.completedOrders / stats.totalOrders) * 100 : 0,
      progressWidth: "42%",
      progressColor: "bg-blue-500"
    }
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</h3>
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
              card.percentChange >= 0 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
            }`}>
              {card.percentChange >= 0 ? '+' : ''}{card.percentChange.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-semibold text-slate-900 dark:text-white">{card.value}</span>
            <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">from {card.previousValue}</span>
          </div>
          <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`${card.progressColor} h-full rounded-full`} style={{ width: card.progressWidth }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
