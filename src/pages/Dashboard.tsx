import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { RecentOrders } from "@/components/dashboard/RecentOrders";

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

const recentOrders = [
  {
    id: "1",
    orderNumber: "ORD001",
    user: {
      fullName: "John Doe",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    product: "Nike Air Max 270",
    status: "completed" as const,
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
    status: "processing" as const,
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
    status: "pending" as const,
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
    status: "cancelled" as const,
    totalAmount: 349.99,
    createdAt: "2025-04-10T08:30:00Z"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-6">
        <AnalyticsCards data={analyticsData} />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
          <div className="col-span-1 lg:col-span-4">
            <SalesChart data={salesData} />
          </div>
          <div className="col-span-1 lg:col-span-3">
            <TopProducts products={topProducts} />
          </div>
        </div>
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
}
