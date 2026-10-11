import type { AdminStats } from "@/lib/types";

export const adminStats: AdminStats = {
  kpi: {
    revenueXof: 588700,
    revenueChangePct: 26,
    revenueChangeXof: 121800,
    salesCount: 58,
    salesChange: 12,
    learnersCount: 1240,
    learnersChange: 64,
    completionRatePct: 64,
    completionRateChangePts: -3,
  },
  salesByCourse: [
    { courseId: "c-rectification-fatiha", sales: 58, revenueXof: 588700 },
  ],
  queue: {
    recitationsToReview: 0,
    oldestRecitationDaysAgo: 0,
    unansweredQuestions: 2,
  },
  totalOrdersCount: 412,
};
