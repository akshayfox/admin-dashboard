import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Box, Smile, FileText, Users } from "lucide-react";
import type { TopProduct } from '@shared/schema';

interface TopProductsProps {
  products?: TopProduct[];
}

const TopProducts = ({ products }: TopProductsProps) => {
  if (!products) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Top Products</CardTitle>
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    );
  }

  // Icons map for products
  const getProductIcon = (iconName?: string) => {
    switch (iconName) {
      case 'box':
        return <Box className="h-6 w-6 text-slate-600 dark:text-slate-400" />;
      case 'smile':
        return <Smile className="h-6 w-6 text-slate-600 dark:text-slate-400" />;
      case 'file':
        return <FileText className="h-6 w-6 text-slate-600 dark:text-slate-400" />;
      case 'users':
        return <Users className="h-6 w-6 text-slate-600 dark:text-slate-400" />;
      default:
        return <Box className="h-6 w-6 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Top Products</CardTitle>
        <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          View All
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="h-8 w-8 object-contain"
                />
              ) : (
                getProductIcon()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {product.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {product.totalSold} sales
              </p>
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              ${product.totalRevenue.toFixed(2)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TopProducts;
