import { useState } from "react";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { mockOrders } from "@/data/mock/orders";
import { createDateCell, createPriceCell, createSortableHeader, createStatusCell } from "@/components/ui/data-table/columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  product: {
    name: string;
    price: number;
    quantity: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  totalAmount: number;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

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
    header: createSortableHeader("Order"),
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={order.customer.avatar} />
            <AvatarFallback>
              {order.customer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{order.orderNumber}</span>
            <span className="text-xs text-muted-foreground">{order.customer.name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "product.name",
    header: createSortableHeader("Product"),
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{order.product.name}</span>
          <span className="text-xs text-muted-foreground">Qty: {order.product.quantity}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: createSortableHeader("Amount"),
    cell: ({ row }) => createPriceCell(row.original.totalAmount),
  },
  {
    accessorKey: "status",
    header: createSortableHeader("Status"),
    cell: ({ row }) => createStatusCell(row.original.status, statusVariants),
  },
  {
    accessorKey: "paymentMethod",
    header: createSortableHeader("Payment"),
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.paymentMethod === 'credit_card' ? 'Credit Card' :
         row.original.paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: createSortableHeader("Date"),
    cell: ({ row }) => createDateCell(row.original.createdAt),
  },
];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your orders
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={mockOrders}
        searchKey="orderNumber"
        onRowClick={handleViewOrder}
      />

      {selectedOrder && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedOrder.customer.avatar} />
                    <AvatarFallback>
                      {selectedOrder.customer.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedOrder.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    statusVariants[selectedOrder.status].className
                  )}
                >
                  {statusVariants[selectedOrder.status].label}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4 space-y-3">
                  <h4 className="font-medium">Product Details</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Product</span>
                      <span className="font-medium">{selectedOrder.product.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium">{selectedOrder.product.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">{createPriceCell(selectedOrder.product.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-medium">{createPriceCell(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 space-y-3">
                  <h4 className="font-medium">Shipping Details</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.street}
                    </p>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p className="text-sm">
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
