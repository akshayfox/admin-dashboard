import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function createSortableHeader(label: string) {
  return ({ column }: { column: any }) => {
    return (
      <Button
        variant="ghost"
        className="-ml-4 h-8 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  };
}

export function createStatusCell(
  value: string,
  variants: Record<string, { label: string; className: string }>
) {
  const status = variants[value];
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        status.className
      )}
    >
      {status.label}
    </Badge>
  );
}

export function createDateCell(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function createPriceCell(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
