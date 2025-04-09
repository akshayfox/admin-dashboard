import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'date';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface FilterPopoverProps {
  filters: FilterOption[];
  activeFilters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
}

export function FilterPopover({ filters, activeFilters, onFilterChange, onClearFilters }: FilterPopoverProps) {
  const [localFilters, setLocalFilters] = React.useState<Record<string, any>>(activeFilters);
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const handleInputChange = (id: string, value: any) => {
    // If value is "all", we want to remove the filter
    if (value === "all") {
      const newFilters = { ...localFilters };
      delete newFilters[id];
      setLocalFilters(newFilters);
    } else {
      setLocalFilters(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleApplyFilters = () => {
    // Remove empty values
    const filteredValues = Object.entries(localFilters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    onFilterChange(filteredValues);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "default" : "outline"} 
          className={`flex items-center gap-2 ${hasActiveFilters ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
          size="sm"
        >
          <Filter className="h-4 w-4" />
          <span>Filter{hasActiveFilters ? ` (${Object.keys(activeFilters).length})` : ''}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filter Data</h4>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs text-slate-500" 
                onClick={onClearFilters}
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-1">
                <Label htmlFor={filter.id} className="text-xs font-medium">
                  {filter.label}
                </Label>
                
                {filter.type === 'select' && (
                  <Select
                    value={localFilters[filter.id] || 'all'}
                    onValueChange={(value) => handleInputChange(filter.id, value)}
                  >
                    <SelectTrigger id={filter.id} className="h-8 text-xs">
                      <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {filter.type === 'text' && (
                  <Input
                    id={filter.id}
                    value={localFilters[filter.id] || ''}
                    onChange={(e) => handleInputChange(filter.id, e.target.value)}
                    placeholder={filter.placeholder}
                    className="h-8 text-xs"
                  />
                )}
                
                {filter.type === 'number' && (
                  <Input
                    id={filter.id}
                    type="number"
                    value={localFilters[filter.id] || ''}
                    onChange={(e) => handleInputChange(filter.id, e.target.value)}
                    placeholder={filter.placeholder}
                    className="h-8 text-xs"
                  />
                )}
                
                {filter.type === 'date' && (
                  <Input
                    id={filter.id}
                    type="date"
                    value={localFilters[filter.id] || ''}
                    onChange={(e) => handleInputChange(filter.id, e.target.value)}
                    className="h-8 text-xs"
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleApplyFilters} 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}