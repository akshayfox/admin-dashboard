import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Edit, Trash, Search, Filter } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import type { OrderWithUser } from '@shared/schema';

interface RecentOrdersProps {
  orders?: OrderWithUser[];
}

const RecentOrders = ({ orders }: RecentOrdersProps) => {
  const [page, setPage] = useState(1);
  const ordersPerPage = 4;
  
  if (!orders) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-28" />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3">
              <div className="grid grid-cols-6 gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-4 py-3 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-6 gap-4">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-4 w-16" />
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (page - 1) * ordersPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle>Recent Orders</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">Add Order</Button>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="whitespace-nowrap py-3 px-4 font-medium text-slate-900 dark:text-slate-200 text-left">Order ID</th>
              <th className="whitespace-nowrap py-3 px-4 font-medium text-slate-900 dark:text-slate-200 text-left">Customer</th>
              <th className="whitespace-nowrap py-3 px-4 font-medium text-slate-900 dark:text-slate-200 text-left">Date</th>
              <th className="whitespace-nowrap py-3 px-4 font-medium text-slate-900 dark:text-slate-200 text-left">Status</th>
              <th className="whitespace-nowrap py-3 px-4 font-medium text-slate-900 dark:text-slate-200 text-left">Amount</th>
              <th className="whitespace-nowrap py-3 px-4 font-medium text-slate-900 dark:text-slate-200 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="whitespace-nowrap py-3 px-4 text-slate-900 dark:text-white">{order.orderNumber}</td>
                <td className="whitespace-nowrap py-3 px-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={order.user.avatarUrl || undefined} />
                      <AvatarFallback>
                        {order.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-900 dark:text-white">{order.user.fullName}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap py-3 px-4 text-slate-500 dark:text-slate-400">
                  {format(new Date(order.createdAt), "MMM dd, yyyy")}
                </td>
                <td className="whitespace-nowrap py-3 px-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="whitespace-nowrap py-3 px-4 text-slate-900 dark:text-white">
                  ${parseFloat(order.totalAmount.toString()).toFixed(2)}
                </td>
                <td className="whitespace-nowrap py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CardContent className="border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {Math.min(startIndex + ordersPerPage, orders.length)}
            </span> of{" "}
            <span className="font-medium text-slate-900 dark:text-white">{orders.length}</span> results
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
