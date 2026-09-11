"use client";

import { Eye, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AdminUser, AdminUsersFilter, Locale } from "@/lib/types";
import { useTableUrlState } from "@/features/admin/hooks/use-table-url-state";
import { useAdminUsers } from "@/features/admin/hooks/use-admin-users";
import { DataTable, type DataTableColumn } from "@/components/patterns/data-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { TableToolbar } from "@/components/patterns/table-toolbar";
import { TablePagination } from "@/components/patterns/table-pagination";
import { EmptyState } from "@/components/patterns/empty-state";
import { SectionError } from "@/components/patterns/section-error";

const FILTER_VALUES: AdminUsersFilter[] = ["all", "withPurchase", "withoutPurchase"];
const PAGE_SIZE = 7;

export interface UsersTableProps {
  locale: Locale;
}

function UsersTable({ locale }: UsersTableProps) {
  const t = useTranslations("admin.table");
  const tError = useTranslations("states.sectionError");
  const { q, setQ, filter, setFilter, page, setPage } = useTableUrlState(FILTER_VALUES, {
    q: "",
    filter: "all",
    page: 1,
  });

  const { data, isPending, isError, refetch } = useAdminUsers(q, filter, page);
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  const columns: DataTableColumn<AdminUser>[] = [
    {
      key: "learner",
      header: t("users.columns.learner"),
      width: "1.5fr",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-green-100 font-serif text-[13px] text-green-ink">
            {row.name
              .split(" ")
              .map((w) => w.charAt(0))
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-xs text-text-faint">{row.city}</div>
          </div>
        </div>
      ),
    },
    { key: "email", header: t("users.columns.email"), width: "1.6fr", cell: (row) => <span className="text-text-soft">{row.email}</span> },
    {
      key: "phone",
      header: t("users.columns.phone"),
      width: "1fr",
      cell: (row) => (
        <span dir="ltr" className="text-text-soft tabular-nums">
          {row.phone}
        </span>
      ),
    },
    {
      key: "courses",
      header: t("users.columns.courses"),
      width: "0.9fr",
      cell: (row) => <span className="text-text-soft">{t("users.coursesCount", { count: row.coursesCount })}</span>,
    },
    {
      key: "joined",
      header: t("users.columns.joined"),
      width: "1fr",
      cell: (row) => <span className="text-text-muted tabular-nums">{dateFormatter.format(new Date(row.joinedAt))}</span>,
    },
    {
      key: "actions",
      header: "",
      width: "90px",
      align: "end",
      cell: () => (
        <div className="flex justify-end gap-3">
          <button type="button" className="text-text-muted hover:text-text">
            <Eye className="size-[17px]" strokeWidth={1.6} />
          </button>
          <button type="button" className="text-text-muted hover:text-text">
            <Pencil className="size-[17px]" strokeWidth={1.6} />
          </button>
        </div>
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
        searchPlaceholder={t("users.searchPlaceholder")}
        filters={FILTER_VALUES.map((value) => ({ value, label: t(`users.filters.${value}`) }))}
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
            { width: "1.5fr", kind: "avatar" },
            { width: "1.6fr" },
            { width: "1fr" },
            { width: "0.9fr" },
            { width: "1fr" },
            { width: "90px" },
          ]}
        />
      ) : (
        <div className="motion-safe:[animation:page-enter_260ms_ease-out]">
          <DataTable
            columns={columns}
            rows={data.items}
            getRowKey={(row) => row.id}
            emptyState={<EmptyState icon={Eye} title={t("noResults")} />}
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

export { UsersTable };
