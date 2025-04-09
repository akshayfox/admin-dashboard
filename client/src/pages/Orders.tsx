import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Filter, Search, Eye, FileText, Package } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import type { OrderWithUser } from "@shared/schema";

const Orders = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);

  // Fetch orders
  const { data: orders, isLoading } = useQuery<OrderWithUser[]>({
    queryKey: ['/api/orders'],
  });

  // Define columns for data table
  const columns = [
    {
      header: "Order ID",
      accessorKey: "orderNumber",
      cell: ({ row }) => (
        <span className="font-medium text-slate-900 dark:text-white">
          {row.getValue("orderNumber")}
        </span>
      )
    },
    {
      header: "Customer",
      id: "customer",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={order.user.avatarUrl || ''} />
              <AvatarFallback>
                {order.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-slate-900 dark:text-white">{order.user.fullName}</span>
          </div>
        );
      }
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span className="text-slate-500 dark:text-slate-400">{format(date, "MMM dd, yyyy")}</span>;
      }
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status} />;
      }
    },
    {
      header: "Amount",
      accessorKey: "totalAmount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        return <span className="text-slate-900 dark:text-white">${amount.toFixed(2)}</span>;
      }
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleViewOrder(order)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const handleViewOrder = (order: OrderWithUser) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="default">
            <Package className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center w-full max-w-sm space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={orders || []} 
          isLoading={isLoading}
          pagination
          title="Orders"
        />
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {format(new Date(selectedOrder.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-md border-slate-200 dark:border-slate-800">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedOrder.user.avatarUrl || ''} />
                  <AvatarFallback>
                    {selectedOrder.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {selectedOrder.user.fullName}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Customer ID: {selectedOrder.user.id}
                  </p>
                </div>
              </div>

              <div className="border rounded-md border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 font-medium">
                  Order Summary
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Amount</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      ${parseFloat(selectedOrder.totalAmount.toString()).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Order Status</span>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Orders;
