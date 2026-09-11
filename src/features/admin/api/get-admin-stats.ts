import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { AdminStats } from "@/lib/types";
import { adminStats } from "@/mocks/admin-stats";

export async function getAdminStats(range: string = "30d"): Promise<AdminStats> {
  if (USE_MOCKS) {
    await sleep(400);
    return adminStats;
  }

  return apiFetch<AdminStats>(`/api/admin/stats?range=${range}`);
}
