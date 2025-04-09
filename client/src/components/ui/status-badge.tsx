import React from "react";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let badgeStyles = '';
  
  switch (status.toLowerCase()) {
    case 'completed':
      badgeStyles = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400';
      break;
    case 'processing':
      badgeStyles = 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400';
      break;
    case 'shipped':
      badgeStyles = 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400';
      break;
    case 'cancelled':
      badgeStyles = 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400';
      break;
    case 'pending':
      badgeStyles = 'bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400';
      break;
    default:
      badgeStyles = 'bg-slate-50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400';
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${badgeStyles}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
}
