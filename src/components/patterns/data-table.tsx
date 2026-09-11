import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  width: string;
  align?: "end";
  cell: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyState?: ReactNode;
}

function DataTable<T>({ columns, rows, getRowKey, emptyState }: DataTableProps<T>) {
  const gridTemplateColumns = columns.map((c) => c.width).join(" ");

  return (
    <div>
      <div
        className="grid gap-4 border-b border-border-subtle bg-bg px-5.5 py-3 text-xs font-semibold tracking-[0.1em] text-text-muted uppercase"
        style={{ gridTemplateColumns }}
      >
        {columns.map((column) => (
          <span
            key={column.key}
            className={cn(column.align === "end" && "text-end")}
          >
            {column.header}
          </span>
        ))}
      </div>

      {rows.length === 0 && emptyState ? (
        <div className="px-5.5 py-14">{emptyState}</div>
      ) : (
        rows.map((row) => (
          <div
            key={getRowKey(row)}
            className="grid min-h-14 items-center gap-4 border-b border-hairline px-5.5 py-3.5 text-sm hover:bg-row-hover"
            style={{ gridTemplateColumns }}
          >
            {columns.map((column) => (
              <div key={column.key} className={cn(column.align === "end" && "text-end")}>
                {column.cell(row)}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export { DataTable };
