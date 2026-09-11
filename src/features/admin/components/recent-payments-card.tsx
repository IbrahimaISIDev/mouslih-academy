import type { AdminOrderRow, Locale } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { DataTable, type DataTableColumn } from "@/components/patterns/data-table";
import { StatusBadge, type StatusBadgeStatus } from "@/components/patterns/status-badge";

export interface RecentPaymentsCardProps {
  title: string;
  allOrdersLabel: string;
  columns: { learner: string; course: string; amount: string; status: string; date: string };
  statusLabels: Record<StatusBadgeStatus, string>;
  payments: AdminOrderRow[];
  locale: Locale;
}

function RecentPaymentsCard({
  title,
  allOrdersLabel,
  columns,
  statusLabels,
  payments,
  locale,
}: RecentPaymentsCardProps) {
  const dateFormatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const tableColumns: DataTableColumn<AdminOrderRow>[] = [
    {
      key: "learner",
      header: columns.learner,
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
    { key: "course", header: columns.course, width: "1.6fr", cell: (row) => <span className="text-text-soft">{row.courseTitle}</span> },
    {
      key: "amount",
      header: columns.amount,
      width: "110px",
      cell: (row) => <span className="font-medium tabular-nums">{formatPrice(row.amountXof, locale)}</span>,
    },
    {
      key: "status",
      header: columns.status,
      width: "110px",
      cell: (row) => <StatusBadge status={row.status} label={statusLabels[row.status]} />,
    },
    {
      key: "date",
      header: columns.date,
      width: "130px",
      cell: (row) => (
        <span dir="ltr" className="text-text-muted tabular-nums">
          {dateFormatter.format(new Date(row.createdAt))}
        </span>
      ),
    },
  ];

  return (
    <div className="border border-border-subtle bg-surface">
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-5">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        <Link href="/admin/commandes" className="text-sm font-semibold text-green-ink">
          {allOrdersLabel}
        </Link>
      </div>
      <DataTable columns={tableColumns} rows={payments} getRowKey={(row) => row.ref} />
    </div>
  );
}

export { RecentPaymentsCard };
