import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from 'react';
import type { SalesData } from '@shared/schema';

interface SalesChartProps {
  data?: SalesData[];
  timeRange: 'weekly' | 'monthly' | 'yearly';
  onRangeChange: (range: 'weekly' | 'monthly' | 'yearly') => void;
}

const SalesChart = ({ data, timeRange, onRangeChange }: SalesChartProps) => {
  if (!data) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Sales Overview</CardTitle>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Format data for chart display
  const formattedData = useMemo(() => {
    return data.map(item => ({
      name: item.date,
      revenue: item.revenue
    }));
  }, [data]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Sales Overview</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant={timeRange === 'weekly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onRangeChange('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === 'monthly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onRangeChange('monthly')}
          >
            Monthly
          </Button>
          <Button 
            variant={timeRange === 'yearly' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onRangeChange('yearly')}
          >
            Yearly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 20,
                right: 30,
                left: 30,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis 
                dataKey="name" 
                className="text-slate-500 dark:text-slate-400 text-xs" 
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                className="text-slate-500 dark:text-slate-400 text-xs" 
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
