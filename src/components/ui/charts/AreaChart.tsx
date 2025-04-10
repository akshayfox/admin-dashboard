import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartData {
  [key: string]: string | number;
  date: string;
}

interface AreaChartProps {
  data: ChartData[];
  title: string;
  subtitle?: string;
  categories: {
    key: string;
    label: string;
    color: string;
    formatter?: (value: number) => string;
  }[];
  className?: string;
  showLegend?: boolean;
  height?: number;
}

export function AreaChart({
  data,
  title,
  subtitle,
  categories,
  className,
  showLegend = true,
  height = 350,
}: AreaChartProps) {
  const formatters = Object.fromEntries(
    categories.map(({ key, formatter }) => [
      key,
      formatter || ((value: number) => value.toString()),
    ])
  );

  return (
    <Card className={cn(
      "bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {showLegend && (
          <div className="flex items-center gap-2">
            {categories.map(({ key, label, color }) => (
              <Badge
                key={key}
                variant="secondary"
                className={cn(
                  "font-medium bg-opacity-10 dark:bg-opacity-10",
                  `bg-[${color}] text-[${color}]`
                )}
              >
                {label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height={height}>
            <RechartsAreaChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <defs>
                {categories.map(({ key, color }) => (
                  <linearGradient
                    key={key}
                    id={`color-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={color}
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor={color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
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
                tickLine={false}
                axisLine={false}
                className="text-xs text-muted-foreground"
                tickMargin={10}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-xl ring-1 ring-black/5">
                        <div className="grid gap-2">
                          {payload.map((item) => {
                            const category = categories.find(
                              (c) => c.key === item.name
                            );
                            if (!category || !item.value || typeof item.name !== 'string') return null;
                            const formatter = formatters[item.name] || ((v: number) => v.toString());
                            return (
                              <div key={item.name} className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: category.color,
                                  }}
                                />
                                <span className="text-[0.70rem] uppercase text-muted-foreground font-medium">
                                  {category.label}
                                </span>
                                <span className="font-bold">
                                  {formatter(item.value as number)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-2 text-xs font-medium text-muted-foreground">
                          {label}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {categories.map(({ key, color }) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#color-${key})`}
                  dot={false}
                  activeDot={{
                    r: 4,
                    className: cn(
                      "stroke-2",
                      `fill-[${color}] stroke-[${color}]/10`
                    ),
                  }}
                />
              ))}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
