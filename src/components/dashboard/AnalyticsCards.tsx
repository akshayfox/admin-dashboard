import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface AnalyticsCardsProps {
  data?: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    growth: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value);
};

export function AnalyticsCards({ data }: AnalyticsCardsProps) {
  if (!data) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-[120px]" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      trend: 12.5,
      bgClass: "bg-gradient-to-br from-green-400 to-emerald-500",
      iconClass: "text-white",
      decoration: "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent"
    },
    {
      title: "Total Orders",
      value: formatNumber(data.totalOrders),
      icon: ShoppingCart,
      trend: -2.3,
      bgClass: "bg-gradient-to-br from-blue-400 to-indigo-500",
      iconClass: "text-white",
      decoration: "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent"
    },
    {
      title: "Total Customers",
      value: formatNumber(data.totalCustomers),
      icon: Users,
      trend: 8.1,
      bgClass: "bg-gradient-to-br from-purple-400 to-pink-500",
      iconClass: "text-white",
      decoration: "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent"
    },
    {
      title: "Growth Rate",
      value: data.growth + "%",
      icon: TrendingUp,
      trend: data.growth,
      bgClass: "bg-gradient-to-br from-orange-400 to-red-500",
      iconClass: "text-white",
      decoration: "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent"
    }
  ];

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i} className="relative overflow-hidden group transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
          <div className={cn(
            "p-6 text-white relative",
            card.bgClass,
            card.decoration
          )}>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm">
                <card.icon className={cn("h-6 w-6", card.iconClass)} />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80 mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight">
                  {card.value}
                </h3>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                card.trend > 0 ? "text-green-100" : "text-red-100"
              )}>
                {card.trend > 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {Math.abs(card.trend)}%
              </div>
              <span className="text-sm text-white/60">
                vs last month
              </span>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
              <card.icon className="w-24 h-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
