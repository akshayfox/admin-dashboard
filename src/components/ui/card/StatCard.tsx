import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  trendLabel?: string;
  iconClassName?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
  gradientFrom = "from-primary/10",
  gradientTo = "to-primary/5",
  trendLabel = "vs last month",
  iconClassName,
  valuePrefix,
  valueSuffix,
}: StatCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
      className
    )}>
      <div className={cn(
        "p-6 text-foreground bg-gradient-to-br",
        gradientFrom,
        gradientTo
      )}>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-background/10 backdrop-blur-sm">
            <Icon className={cn("h-6 w-6", iconClassName)} />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <h3 className="text-2xl font-bold tracking-tight">
              {valuePrefix}{value}{valueSuffix}
            </h3>
          </div>
        </div>
        {typeof trend !== 'undefined' && (
          <div className="mt-4 flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend > 0 ? "text-emerald-500" : "text-rose-500"
            )}>
              {trend > 0 ? "↑" : "↓"}
              {Math.abs(trend)}%
            </div>
            <span className="text-sm text-muted-foreground">
              {trendLabel}
            </span>
          </div>
        )}
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
          <Icon className="w-24 h-24" />
        </div>
      </div>
    </Card>
  );
}
