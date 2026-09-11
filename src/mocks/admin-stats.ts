import type { AdminStats } from "@/lib/types";

export const adminStats: AdminStats = {
  kpi: {
    revenueXof: 1285000,
    revenueChangePct: 18,
    revenueChangeXof: 195000,
    salesCount: 58,
    salesChange: 12,
    learnersCount: 1240,
    learnersChange: 64,
    completionRatePct: 64,
    completionRateChangePts: -3,
  },
  salesByCourse: [
    { courseId: "c-rectification-fatiha", sales: 31, revenueXof: 465000 },
    { courseId: "c-regles-tajwid", sales: 11, revenueXof: 440000 },
    { courseId: "c-initiation-nourania", sales: 8, revenueXof: 200000 },
    { courseId: "c-fiqh-priere", sales: 5, revenueXof: 100000 },
    { courseId: "c-sciences-hadith", sales: 3, revenueXof: 135000 },
  ],
  queue: {
    recitationsToReview: 7,
    oldestRecitationDaysAgo: 2,
    unansweredQuestions: 2,
  },
  totalOrdersCount: 412,
};
