"use client";

import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AdminOrderRow, AdminOrdersFilter, Locale } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useTableUrlState } from "@/features/admin/hooks/use-table-url-state";
import { useAdminOrders } from "@/features/admin/hooks/use-admin-orders";
import { DataTable, type DataTableColumn } from "@/components/patterns/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { TableToolbar } from "@/components/patterns/table-toolbar";
import { TablePagination } from "@/components/patterns/table-pagination";
import { EmptyState } from "@/components/patterns/empty-state";
import { SectionError } from "@/components/patterns/section-error";
import { StatusBadge, type StatusBadgeStatus } from "@/components/patterns/status-badge";

const FILTER_VALUES: AdminOrdersFilter[] = ["all", "paid", "pending", "failed"];
const PAGE_SIZE = 7;

export interface OrdersTableProps {
  locale: Locale;
  statusLabels: Record<StatusBadgeStatus, string>;
}

function OrdersTable({ locale, statusLabels }: OrdersTableProps) {
  const t = useTranslations("admin.table");
  const tError = useTranslations("states.sectionError");
  const { q, setQ, filter, setFilter, page, setPage } = useTableUrlState(FILTER_VALUES, {
    q: "",
    filter: "all",
    page: 1,
  });

  const { data, isPending, isError, refetch } = useAdminOrders(q, filter, page, locale);

  function resetFilters() {
    setQ("");
    setFilter("all");
  }
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  const columns: DataTableColumn<AdminOrderRow>[] = [
    {
      key: "ref",
      header: t("orders.columns.ref"),
      width: "1.1fr",
      cell: (row) => (
        <span dir="ltr" className="text-text-soft tabular-nums">
          {row.ref}
        </span>
      ),
    },
    {
      key: "learner",
      header: t("orders.columns.learner"),
      width: "1.4fr",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-green-100 font-serif text-xs text-green-ink">
            {row.learnerInitials}
          </span>
          <span className="font-medium">{row.learnerName}</span>
        </div>
      ),
    },
    { key: "course", header: t("orders.columns.course"), width: "1.6fr", cell: (row) => <span className="text-text-soft">{row.courseTitle}</span> },
    {
      key: "amount",
      header: t("orders.columns.amount"),
      width: "1fr",
      cell: (row) => <span className="font-medium tabular-nums">{formatPrice(row.amountXof, locale)}</span>,
    },
    {
      key: "status",
      header: t("orders.columns.status"),
      width: "1fr",
      cell: (row) => <StatusBadge status={row.status} label={statusLabels[row.status]} />,
    },
    {
      key: "date",
      header: t("orders.columns.date"),
      width: "110px",
      align: "end",
      cell: (row) => (
        <span dir="ltr" className="text-text-muted tabular-nums">
          {dateFormatter.format(new Date(row.createdAt))}
        </span>
      ),
    },
  ];

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="border border-border-subtle bg-surface">
      <TableToolbar
        searchValue={q}
        onSearchChange={setQ}
        searchPlaceholder={t("orders.searchPlaceholder")}
        filters={FILTER_VALUES.map((value) => ({ value, label: t(`orders.filters.${value}`) }))}
        activeFilter={filter}
        onFilterChange={setFilter}
        countLabel={t("rowCount", {
          shown: data?.items.length ?? 0,
          total: new Intl.NumberFormat(locale).format(total),
        })}
      />

      {isError ? (
        <div className="p-5.5">
          <SectionError
            title={tError("title")}
            body={tError("body")}
            retryLabel={tError("retry")}
            onRetry={() => refetch()}
          />
        </div>
      ) : isPending || !data ? (
        <TableSkeleton
          columns={[
            { width: "1.1fr" },
            { width: "1.4fr", kind: "avatar" },
            { width: "1.6fr" },
            { width: "1fr" },
            { width: "1fr", kind: "badge" },
            { width: "110px" },
          ]}
        />
      ) : (
        <div className="motion-safe:[animation:page-enter_260ms_ease-out]">
          <DataTable
            columns={columns}
            rows={data.items}
            getRowKey={(row) => row.ref}
            emptyState={
              <EmptyState
                icon={Package}
                title={t("orders.emptyTitle")}
                description={t("orders.emptyDescription")}
                action={
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-sm border border-green-700 px-4.5 py-2.75 text-sm font-semibold text-green-ink"
                  >
                    {t("orders.emptyAction")}
                  </button>
                }
              />
            }
          />
        </div>
      )}

      <TablePagination
        page={page}
        totalPages={totalPages}
        pageLabel={t("pageLabel", { page, total: new Intl.NumberFormat(locale).format(totalPages) })}
        onPageChange={setPage}
        previousLabel={t("previousPage")}
        nextLabel={t("nextPage")}
      />
    </div>
  );
}

export { OrdersTable };
