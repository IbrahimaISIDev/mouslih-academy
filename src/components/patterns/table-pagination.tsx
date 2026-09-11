"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DirectionalIcon } from "@/components/patterns/directional-icon";

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  pageLabel: string;
  onPageChange: (page: number) => void;
  previousLabel: string;
  nextLabel: string;
}

function PageSquare({
  page,
  active,
  onClick,
}: {
  page: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "grid size-[34px] place-items-center rounded-sm border text-sm font-semibold",
        active
          ? "border-green-700 bg-green-700 text-green-ink"
          : "border-border-strong text-text-soft",
      )}
    >
      {page}
    </button>
  );
}

function TablePagination({
  page,
  totalPages,
  pageLabel,
  onPageChange,
  previousLabel,
  nextLabel,
}: TablePaginationProps) {
  const shownPages = [1, 2, 3].filter((p) => p <= totalPages);
  const showEllipsis = totalPages > shownPages.length + 1;

  return (
    <div className="flex items-center justify-between px-5.5 py-4">
      <span className="text-sm text-text-muted">{pageLabel}</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label={previousLabel}
          className="grid size-[34px] place-items-center rounded-sm border border-border-subtle text-text-faint disabled:opacity-50"
        >
          <DirectionalIcon icon={ChevronLeft} className="size-[15px]" strokeWidth={1.8} />
        </button>

        {shownPages.map((p) => (
          <PageSquare key={p} page={p} active={p === page} onClick={() => onPageChange(p)} />
        ))}

        {showEllipsis && <span className="px-1 text-sm text-text-faint">…</span>}

        {totalPages > shownPages.length && (
          <PageSquare
            page={totalPages}
            active={page === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-label={nextLabel}
          className="grid size-[34px] place-items-center rounded-sm border border-border-strong text-text-soft disabled:opacity-50"
        >
          <DirectionalIcon icon={ChevronRight} className="size-[15px]" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

export { TablePagination };
