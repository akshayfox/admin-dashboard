import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TopProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  sales: number;
  trend: number;
}

interface TopProductsProps {
  products?: TopProduct[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function TopProducts({ products }: TopProductsProps) {
  if (!products) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 mb-4 last:mb-0">
              <Skeleton className="h-12 w-12 rounded-lg" />
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

  return (
    <Card className="bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Top Products
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Best performing products
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-700 dark:text-violet-300 font-medium">
          {products.length} products
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-xl border bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className="relative aspect-square h-14 w-14 overflow-hidden rounded-xl border bg-white dark:bg-slate-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover transition-transform duration-200 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {product.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product.category}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {formatCurrency(product.price)}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <div className={cn(
                    "flex items-center gap-0.5",
                    product.trend > 0 
                      ? "text-emerald-500 dark:text-emerald-400" 
                      : "text-rose-500 dark:text-rose-400"
                  )}>
                    {product.trend > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(product.trend)}%
                  </div>
                  <span className="text-muted-foreground">
                    ({product.sales})
                  </span>
                </div>
              </div>
            </div>
            <div className={cn(
              "absolute inset-x-0 bottom-0 h-0.5 transition-transform duration-200 group-hover:scale-100",
              product.trend > 0 
                ? "bg-gradient-to-r from-emerald-500 to-green-500 scale-x-75" 
                : "bg-gradient-to-r from-rose-500 to-red-500 scale-x-75"
            )} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
