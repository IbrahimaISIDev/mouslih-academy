import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { AdminOrderRow, AdminOrdersFilter, Locale, Paginated } from "@/lib/types";
import { getInitials } from "@/lib/format";
import { orders } from "@/mocks/orders";
import { adminUsers } from "@/mocks/admin-users";
import { courses } from "@/mocks/courses";
import { adminStats } from "@/mocks/admin-stats";

const PAGE_SIZE = 7;

export interface GetAdminOrdersQuery {
  q?: string;
  filter?: AdminOrdersFilter;
  page?: number;
  locale: Locale;
}

export async function getAdminOrders({
  q = "",
  filter = "all",
  page = 1,
  locale,
}: GetAdminOrdersQuery): Promise<Paginated<AdminOrderRow>> {
  if (!USE_MOCKS) {
    const search = new URLSearchParams({ page: String(page), locale });
    if (q) search.set("q", q);
    if (filter !== "all") search.set("status", filter);
    return clientApiFetch<Paginated<AdminOrderRow>>(`/api/admin/orders?${search}`);
  }

  await sleep(400);

  const query = q.trim().toLowerCase();

  const rows: AdminOrderRow[] = [...orders]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map((order) => {
      const user = adminUsers.find((u) => u.id === order.userId);
      const course = courses.find((c) => c.id === order.courseId);
      return {
        ref: order.ref,
        learnerName: user?.name ?? "",
        learnerInitials: getInitials(user?.name ?? ""),
        courseTitle: course?.title[locale] ?? "",
        amountXof: order.amountXof,
        status: order.status,
        createdAt: order.createdAt,
      };
    });

  const filtered = rows.filter((row) => {
    if (filter !== "all" && row.status !== filter) return false;
    if (!query) return true;
    return (
      row.ref.toLowerCase().includes(query) ||
      row.learnerName.toLowerCase().includes(query) ||
      row.courseTitle.toLowerCase().includes(query)
    );
  });

  const start = (page - 1) * PAGE_SIZE;

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    page,
    pageSize: PAGE_SIZE,
    total: adminStats.totalOrdersCount,
  };
}
