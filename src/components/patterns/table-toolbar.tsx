"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableToolbarFilter<F extends string> {
  value: F;
  label: string;
}

export interface TableToolbarProps<F extends string> {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: TableToolbarFilter<F>[];
  activeFilter: F;
  onFilterChange: (value: F) => void;
  countLabel: string;
}

function TableToolbar<F extends string>({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  activeFilter,
  onFilterChange,
  countLabel,
}: TableToolbarProps<F>) {
  return (
    <div className="flex items-center gap-3 border-b border-border-subtle px-5.5 py-4">
      <div className="flex w-[300px] items-center gap-2.5 rounded-sm border border-border-strong px-3.5 py-2.5">
        <Search className="size-4 shrink-0 text-text-muted" strokeWidth={1.7} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-faint"
        />
      </div>

      <div className="flex gap-2">
        {filters.map((filter) => {
          const active = filter.value === activeFilter;
          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                "rounded-sm border px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap",
                active
                  ? "border-green-700 bg-green-700 text-green-ink"
                  : "border-border-strong bg-transparent text-text-soft",
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="ms-auto text-sm text-text-muted">{countLabel}</div>
    </div>
  );
}

export { TableToolbar };
