import { useQuery } from "@tanstack/react-query";
import type { AdminOrdersFilter, Locale } from "@/lib/types";
import { getAdminOrders } from "@/features/admin/api/get-admin-orders";

export function useAdminOrders(q: string, filter: AdminOrdersFilter, page: number, locale: Locale) {
  return useQuery({
    queryKey: ["admin-orders", q, filter, page, locale],
    queryFn: () => getAdminOrders({ q, filter, page, locale }),
  });
}
