import { useQuery } from "@tanstack/react-query";
import type { AdminUsersFilter } from "@/lib/types";
import { getAdminUsers } from "@/features/admin/api/get-admin-users";

export function useAdminUsers(q: string, filter: AdminUsersFilter, page: number) {
  return useQuery({
    queryKey: ["admin-users", q, filter, page],
    queryFn: () => getAdminUsers({ q, filter, page }),
  });
}
