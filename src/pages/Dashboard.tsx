import { StatCard } from "@/components/ui/card/StatCard";
import { AreaChart } from "@/components/ui/charts/AreaChart";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { createDateCell, createPriceCell, createStatusCell } from "@/components/ui/data-table/columns";
import { type ColumnDef } from "@tanstack/react-table";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

// Sample data
const analyticsData = {
  totalRevenue: 154200,
  totalOrders: 1485,
  totalCustomers: 3240,
  growth: 12.5
};

const salesData = [
  { date: "Jan 1", revenue: 4000, orders: 24 },
  { date: "Jan 2", revenue: 3000, orders: 18 },
  { date: "Jan 3", revenue: 2000, orders: 22 },
  { date: "Jan 4", revenue: 2780, orders: 30 },
  { date: "Jan 5", revenue: 1890, orders: 20 },
  { date: "Jan 6", revenue: 2390, orders: 28 },
  { date: "Jan 7", revenue: 3490, orders: 32 },
];

const topProducts = [
  {
    id: "1",
    name: "Nike Air Max 270",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    price: 129.99,
    sales: 240,
    trend: 12.5
  },
  {
    id: "2", 
    name: "MacBook Pro M2",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    price: 1299.99,
    sales: 180,
    trend: 8.3
  },
  {
    id: "3",
    name: "iPhone 14 Pro",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
    price: 999.99,
    sales: 350,
    trend: -2.1
  },
  {
    id: "4",
    name: "Sony WH-1000XM4",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
    price: 349.99,
    sales: 120,
    trend: 5.4
  }
];

interface Order {
  id: string;
  orderNumber: string;
  user: {
    fullName: string;
    avatarUrl: string;
  };
  product: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

const recentOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD001",
    user: {
      fullName: "John Doe",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    product: "Nike Air Max 270",
    status: "completed",
    totalAmount: 129.99,
    createdAt: "2025-04-10T10:00:00Z"
  },
  {
    id: "2",
    orderNumber: "ORD002",
    user: {
      fullName: "Jane Smith",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    product: "MacBook Pro M2",
    status: "processing",
    totalAmount: 1299.99,
    createdAt: "2025-04-10T09:30:00Z"
  },
  {
    id: "3",
    orderNumber: "ORD003",
    user: {
      fullName: "Alex Johnson",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    product: "iPhone 14 Pro",
    status: "pending",
    totalAmount: 999.99,
    createdAt: "2025-04-10T09:00:00Z"
  },
  {
    id: "4",
    orderNumber: "ORD004",
    user: {
      fullName: "Sarah Wilson",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    },
    product: "Sony WH-1000XM4",
    status: "cancelled",
    totalAmount: 349.99,
    createdAt: "2025-04-10T08:30:00Z"
  }
];

const statusVariants = {
  pending: {
    label: "Pending",
    className: "text-yellow-700 dark:text-yellow-500 border-yellow-300 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
  },
  processing: {
    label: "Processing",
    className: "text-blue-700 dark:text-blue-500 border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-950",
  },
  completed: {
    label: "Completed",
    className: "text-emerald-700 dark:text-emerald-500 border-emerald-300 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950",
  },
  cancelled: {
    label: "Cancelled",
    className: "text-rose-700 dark:text-rose-500 border-rose-300 dark:border-rose-500 bg-rose-50 dark:bg-rose-950",
  },
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order",
  },
  {
    accessorKey: "user.fullName",
    header: "Customer",
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => createPriceCell(row.original.totalAmount),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => createStatusCell(row.original.status, statusVariants),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => createDateCell(row.original.createdAt),
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Your business at a glance
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={analyticsData.totalRevenue}
          icon={DollarSign}
          trend={analyticsData.growth}
          valuePrefix="$"
          gradientFrom="from-blue-500/10"
          gradientTo="to-blue-500/5"
          iconClassName="text-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={analyticsData.totalOrders}
          icon={ShoppingCart}
          trend={8.2}
          gradientFrom="from-green-500/10"
          gradientTo="to-green-500/5"
          iconClassName="text-green-500"
        />
        <StatCard
          title="Total Customers"
          value={analyticsData.totalCustomers}
          icon={Users}
          trend={-2.1}
          gradientFrom="from-violet-500/10"
          gradientTo="to-violet-500/5"
          iconClassName="text-violet-500"
        />
        <StatCard
          title="Growth Rate"
          value={analyticsData.growth}
          icon={TrendingUp}
          valueSuffix="%"
          gradientFrom="from-orange-500/10"
          gradientTo="to-orange-500/5"
          iconClassName="text-orange-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-full lg:col-span-4">
          <AreaChart
            data={salesData}
            title="Sales Overview"
            subtitle="Compare revenue and orders over time"
            categories={[
              {
                key: "revenue",
                label: "Revenue",
                color: "#3b82f6",
                formatter: (value) => `$${value.toLocaleString()}`,
              },
              {
                key: "orders",
                label: "Orders",
                color: "#10b981",
              },
            ]}
          />
        </div>
        <div className="col-span-full lg:col-span-3">
          <DataTable
            columns={columns}
            data={recentOrders}
            searchKey="orderNumber"
          />
        </div>
      </div>
    </div>
  );
}
