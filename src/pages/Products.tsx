import { useState } from "react";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { mockProducts, type Product } from "@/data/mock/products";
import { createDateCell, createPriceCell, createSortableHeader } from "@/components/ui/data-table/columns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Star, StarHalf } from "lucide-react";

const statusVariants = {
  in_stock: {
    label: "In Stock",
    className: "text-emerald-700 dark:text-emerald-500 border-emerald-300 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950",
  },
  low_stock: {
    label: "Low Stock",
    className: "text-yellow-700 dark:text-yellow-500 border-yellow-300 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
  },
  out_of_stock: {
    label: "Out of Stock",
    className: "text-rose-700 dark:text-rose-500 border-rose-300 dark:border-rose-500 bg-rose-50 dark:bg-rose-950",
  },
};

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: createSortableHeader("Product"),
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-12 w-12 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{product.name}</span>
            <span className="text-xs text-muted-foreground">{product.category}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: createSortableHeader("Price"),
    cell: ({ row }) => createPriceCell(row.original.price),
  },
  {
    accessorKey: "stock",
    header: createSortableHeader("Stock"),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{row.original.stock}</span>
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            statusVariants[row.original.status].className
          )}
        >
          {statusVariants[row.original.status].label}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: createSortableHeader("Rating"),
    cell: ({ row }) => {
      const rating = row.original.rating;
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      
      return (
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-500">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
            {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
          </div>
          <span className="text-sm font-medium">({row.original.reviews})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sales",
    header: createSortableHeader("Sales"),
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.sales}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: createSortableHeader("Last Updated"),
    cell: ({ row }) => createDateCell(row.original.updatedAt),
  },
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your products
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={mockProducts}
        searchKey="name"
        onRowClick={handleViewProduct}
      />

      {selectedProduct && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6">
              <div className="flex items-start gap-6">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="h-32 w-32 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        statusVariants[selectedProduct.status].className
                      )}
                    >
                      {statusVariants[selectedProduct.status].label}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm">{selectedProduct.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4 space-y-3">
                  <h4 className="font-medium">Product Stats</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">{createPriceCell(selectedProduct.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock</span>
                      <span className="font-medium">{selectedProduct.stock}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sales</span>
                      <span className="font-medium">{selectedProduct.sales}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <div className="flex text-yellow-500">
                          {[...Array(Math.floor(selectedProduct.rating))].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          {selectedProduct.rating % 1 >= 0.5 && (
                            <StarHalf className="h-4 w-4 fill-current" />
                          )}
                        </div>
                        <span className="font-medium">({selectedProduct.reviews})</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 space-y-3">
                  <h4 className="font-medium">Dates</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">{createDateCell(selectedProduct.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">{createDateCell(selectedProduct.updatedAt)}</span>
                    </div>
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
