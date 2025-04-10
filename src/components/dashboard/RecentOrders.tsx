import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  user: {
    fullName: string;
    avatarUrl: string;
  };
  product: string;
  status: "completed" | "processing" | "pending" | "cancelled";
  totalAmount: number;
  createdAt: string;
}

interface RecentOrdersProps {
  orders?: Order[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const getStatusConfig = (status: Order['status']) => {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        icon: CheckCircle2,
        color: 'text-emerald-500 dark:text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20'
      };
    case 'processing':
      return {
        label: 'Processing',
        icon: Clock,
        color: 'text-blue-500 dark:text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20'
      };
    case 'pending':
      return {
        label: 'Pending',
        icon: AlertCircle,
        color: 'text-yellow-500 dark:text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20'
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        icon: XCircle,
        color: 'text-rose-500 dark:text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/20'
      };
  }
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (!orders) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b py-4 last:border-0">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recent Orders
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest customer orders
          </p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {orders.map((order) => {
          const status = getStatusConfig(order.status);
          return (
            <div key={order.id} className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12">
                  <img
                    src={order.user.avatarUrl}
                    alt={order.user.fullName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm"
                  />
                  <div className={cn(
                    "absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900",
                    status.bg
                  )} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {order.user.fullName}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium border",
                        status.color,
                        status.border
                      )}
                    >
                      <status.icon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{order.orderNumber}</span>
                    <span>•</span>
                    <span>{order.product}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
