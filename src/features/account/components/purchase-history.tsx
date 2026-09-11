import { Download } from "lucide-react";
import type { Course, Locale, Order } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import {
  StatusBadge,
  type StatusBadgeStatus,
} from "@/components/patterns/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface PurchaseHistoryProps {
  orders: Order[];
  courses: Course[];
  locale: Locale;
  title: string;
  statusLabels: Record<StatusBadgeStatus, string>;
  columns: {
    reference: string;
    course: string;
    amount: string;
    status: string;
    date: string;
    receipt: string;
  };
  downloadLabel: string;
  downloadReceiptLabel: string;
  noneLabel: string;
}

function PurchaseHistory({
  orders,
  courses,
  locale,
  title,
  statusLabels,
  columns,
  downloadLabel,
  downloadReceiptLabel,
  noneLabel,
}: PurchaseHistoryProps) {
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  return (
    <div className="border border-border-subtle bg-surface p-6 lg:p-7.5">
      <h2 className="mb-6 font-serif text-xl font-semibold lg:text-2xl">
        {title}
      </h2>

      <div className="hidden border border-border-subtle lg:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{columns.date}</TableHead>
              <TableHead>{columns.course}</TableHead>
              <TableHead>{columns.amount}</TableHead>
              <TableHead>{columns.status}</TableHead>
              <TableHead>{columns.receipt}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const course = courses.find((c) => c.id === order.courseId);
              return (
                <TableRow key={order.ref}>
                  <TableCell className="tabular-nums text-text-muted" dir="ltr">
                    {dateFormatter.format(new Date(order.createdAt))}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{course?.title[locale]}</div>
                    <div dir="ltr" className="mt-0.5 text-xs text-text-faint">
                      Wave · {order.ref}
                    </div>
                  </TableCell>
                  <TableCell className="font-serif text-[17px] font-semibold text-text">
                    {formatPrice(order.amountXof, locale)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={order.status}
                      label={statusLabels[order.status]}
                    />
                  </TableCell>
                  <TableCell>
                    {order.status === "paid" ? (
                      <a
                        href="#"
                        className="text-sm font-semibold text-green-ink"
                      >
                        {downloadLabel}
                      </a>
                    ) : (
                      <span className="text-text-faint">{noneLabel}</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 lg:hidden">
        {orders.map((order) => {
          const course = courses.find((c) => c.id === order.courseId);
          return (
            <div
              key={order.ref}
              className="border-b border-hairline pb-4 last:border-b-0 last:pb-0"
            >
              <div className="mb-1.5 flex items-start justify-between gap-3">
                <p className="text-[15px] font-medium">
                  {course?.title[locale]}
                </p>
                <StatusBadge
                  status={order.status}
                  label={statusLabels[order.status]}
                />
              </div>
              <div className="flex items-baseline justify-between">
                <p dir="ltr" className="text-xs text-text-faint">
                  {dateFormatter.format(new Date(order.createdAt))} ·{" "}
                  {order.ref}
                </p>
                <p className="font-serif text-[17px] font-semibold">
                  {formatPrice(order.amountXof, locale)}
                </p>
              </div>
              {order.status === "paid" && (
                <a
                  href="#"
                  className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-green-ink"
                >
                  <Download className="size-3.5" strokeWidth={1.8} />
                  {downloadReceiptLabel}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { PurchaseHistory };
