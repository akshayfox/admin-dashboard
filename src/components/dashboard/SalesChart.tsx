import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart
} from "recharts";

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data?: SalesData[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 p-3 shadow-xl ring-1 ring-black/5">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-indigo-500 dark:text-indigo-400 font-medium">
              Revenue
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-300">
              {formatCurrency(payload[0].value)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-violet-500 dark:text-violet-400 font-medium">
              Orders
            </span>
            <span className="font-bold text-violet-600 dark:text-violet-300">
              {payload[1].value}
            </span>
          </div>
        </div>
        <div className="mt-2 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      </div>
    );
  }
  return null;
};

export function SalesChart({ data }: SalesChartProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Sales Overview</CardTitle>
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  return (
    <Card className="bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Sales Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Revenue and orders over time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-700 dark:text-indigo-300 font-medium">
            {formatCurrency(totalRevenue)}
          </Badge>
          <Badge variant="outline" className="font-medium">
            {totalOrders} orders
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--indigo-500))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--indigo-500))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--violet-500))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--violet-500))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/30"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                className="text-xs text-muted-foreground"
                tickMargin={10}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                className="text-xs text-muted-foreground"
                tickMargin={10}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                className="text-xs text-muted-foreground"
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--indigo-500))"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                dot={false}
                activeDot={{
                  r: 4,
                  className: "fill-indigo-600 stroke-2 stroke-indigo-100 dark:stroke-indigo-900"
                }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--violet-500))"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  className: "fill-violet-600 stroke-2 stroke-violet-100 dark:stroke-violet-900"
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
