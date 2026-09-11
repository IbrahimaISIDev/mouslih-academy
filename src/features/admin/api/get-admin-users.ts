import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { AdminUser, AdminUsersFilter, Paginated } from "@/lib/types";
import { adminUsers } from "@/mocks/admin-users";
import { adminStats } from "@/mocks/admin-stats";

const PAGE_SIZE = 7;

export interface GetAdminUsersQuery {
  q?: string;
  filter?: AdminUsersFilter;
  page?: number;
}

export async function getAdminUsers({
  q = "",
  filter = "all",
  page = 1,
}: GetAdminUsersQuery): Promise<Paginated<AdminUser>> {
  if (!USE_MOCKS) {
    const search = new URLSearchParams({ page: String(page) });
    if (q) search.set("q", q);
    if (filter !== "all") search.set("filter", filter);
    return apiFetch<Paginated<AdminUser>>(`/api/admin/users?${search}`);
  }

  await sleep(400);

  const query = q.trim().toLowerCase();
  const filtered = adminUsers.filter((user) => {
    if (filter === "withPurchase" && user.coursesCount === 0) return false;
    if (filter === "withoutPurchase" && user.coursesCount > 0) return false;
    if (!query) return true;
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query)
    );
  });

  const start = (page - 1) * PAGE_SIZE;

  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    page,
    pageSize: PAGE_SIZE,
    total: adminStats.kpi.learnersCount,
  };
}
