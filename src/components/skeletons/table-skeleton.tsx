import { Skeleton } from "@/components/ui/skeleton";

export interface TableSkeletonColumn {
  width: string;
  kind?: "avatar" | "badge" | "text";
}

export interface TableSkeletonProps {
  columns: TableSkeletonColumn[];
  rows?: number;
}

const ROW_COUNT_DEFAULT = 7;

/** En-tête + N lignes de 56 px min, largeurs de cellule variables par colonne
 *  (avatar rond, texte long, badge court) — reprend la géométrie réelle de DataTable. */
function TableSkeleton({ columns, rows = ROW_COUNT_DEFAULT }: TableSkeletonProps) {
  const gridTemplateColumns = columns.map((c) => c.width).join(" ");

  return (
    <div>
      <div className="grid gap-4 border-b border-border-subtle bg-bg px-5.5 py-3" style={{ gridTemplateColumns }}>
        {columns.map((_, i) => (
          <Skeleton key={i} className="h-2.5 w-2/3 bg-skeleton-secondary" />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid min-h-14 items-center gap-4 border-b border-hairline px-5.5 py-3.5"
          style={{ gridTemplateColumns }}
        >
          {columns.map((column, colIndex) =>
            column.kind === "avatar" ? (
              <div key={colIndex} className="flex items-center gap-2.5">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            ) : column.kind === "badge" ? (
              <Skeleton key={colIndex} className="h-[22px] w-16 rounded-sm" />
            ) : (
              <Skeleton key={colIndex} className="h-3.5 w-4/5" />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

export { TableSkeleton };
