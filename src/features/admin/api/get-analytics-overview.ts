import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { AnalyticsOverview } from "@/lib/types";

export const ANALYTICS_RANGES = [7, 30, 90] as const;
export type AnalyticsRange = (typeof ANALYTICS_RANGES)[number];

const EMPTY: AnalyticsOverview = {
  days: 30,
  totals: { visitors: 0, pageViews: 0, videoPlays: 0, signups: 0, sales: 0, revenueXof: 0, mobileShare: 0 },
  daily: [],
  sources: [],
  funnel: (["visit", "course", "video", "signup", "checkout", "payment"] as const).map((step) => ({
    step,
    sessions: 0,
  })),
  topPages: [],
  topVideos: [],
};

/** Mesure d'audience sans cookie (voir lib/analytics.ts). Aucune donnée fictive en mode démo. */
export async function getAnalyticsOverview(days: AnalyticsRange): Promise<AnalyticsOverview> {
  if (USE_MOCKS) return { ...EMPTY, days };
  return apiFetch<AnalyticsOverview>(`/api/admin/analytics?days=${days}`);
}
