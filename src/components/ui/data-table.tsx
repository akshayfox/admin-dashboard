import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { useState } from "react";
import * as XLSX from 'xlsx';

interface DataTableProps {
  columns: {
    header: string;
    accessorKey?: string;
    id?: string;
    cell?: ({ row }: any) => React.ReactNode;
  }[];
  data: any[];
  isLoading?: boolean;
  pagination?: boolean;
  title?: string;
}

export function DataTable({
  columns,
  data,
  isLoading = false,
  pagination = false,
  title = "Data",
}: DataTableProps) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Function to export data to Excel
  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Format data for export - strip out any React components
    const exportData = data.map(row => {
      const newRow: Record<string, any> = {};
      
      columns.forEach(column => {
        if (column.accessorKey) {
          // Use column header as the key in the Excel file
          newRow[column.header] = row[column.accessorKey];
        }
      });
      
      return newRow;
    });
    
    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Skip if no data or loading
  if (isLoading) {
    return (
      <div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500 dark:text-slate-400">
        No data to display
      </div>
    );
  }

  // Setup pagination
  const totalPages = pagination ? Math.ceil(data.length / rowsPerPage) : 1;
  const startIndex = pagination ? (page - 1) * rowsPerPage : 0;
  const endIndex = pagination ? startIndex + rowsPerPage : data.length;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div>
      {/* Table actions - Export button */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">{title}</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-600 border-green-200 hover:border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800 dark:hover:border-green-700 rounded-lg shadow-sm hover:shadow transition-all"
          onClick={exportToExcel}
        >
          <Download className="h-4 w-4" />
          <span>Export Excel</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/80 dark:bg-slate-800/50">
            <TableRow>
              {columns.map((column, i) => (
                <TableHead key={i} className="whitespace-nowrap font-semibold text-sm text-slate-700 dark:text-slate-300 py-4">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} className="py-3.5 text-slate-700 dark:text-slate-300">
                    {column.cell
                      ? column.cell({ row: { original: row, getValue: (key: string) => row[key] } })
                      : column.accessorKey
                      ? row[column.accessorKey]
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 mt-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border rounded-xl border-slate-200/70 dark:border-slate-800/70 shadow-sm">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium text-slate-900 dark:text-white">{startIndex + 1}</span> to{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {Math.min(endIndex, data.length)}
            </span> of{" "}
            <span className="font-medium text-slate-900 dark:text-white">{data.length}</span> results
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to display max 5 page buttons with ellipsis
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="icon"
                  className={`h-9 w-9 rounded-lg font-medium ${
                    pageNum === page 
                      ? 'bg-primary hover:bg-primary/90 text-white shadow-md' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
