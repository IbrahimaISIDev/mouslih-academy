import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { AdminOrderRow, Locale } from "@/lib/types";
import { getInitials } from "@/lib/format";
import { orders } from "@/mocks/orders";
import { adminUsers } from "@/mocks/admin-users";
import { courses } from "@/mocks/courses";

const RECENT_PAYMENTS_COUNT = 6;

export async function getRecentPayments(locale: Locale): Promise<AdminOrderRow[]> {
  if (!USE_MOCKS) {
    return apiFetch<AdminOrderRow[]>(`/api/admin/orders/recent?locale=${locale}`);
  }

  await sleep(400);

  return [...orders]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, RECENT_PAYMENTS_COUNT)
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
}
