import type { Metadata } from "next";
import { Plus, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { StatCard } from "@/components/patterns/stat-card";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import { getRecentPayments } from "@/features/admin/api/get-recent-payments";
import { getRecentSignups } from "@/features/admin/api/get-recent-signups";
import { courses } from "@/mocks/courses";
import { orders } from "@/mocks/orders";
import { RangeSelector, type DashboardRange } from "@/features/admin/components/range-selector";
import { RecentPaymentsCard } from "@/features/admin/components/recent-payments-card";
import { SalesByCourseCard } from "@/features/admin/components/sales-by-course-card";
import { QueueCard } from "@/features/admin/components/queue-card";
import { RecentSignupsCard } from "@/features/admin/components/recent-signups-card";
import { TopCourseBanner } from "@/features/admin/components/top-course-banner";

export const metadata: Metadata = { title: "Vue d'ensemble — Administration Mouslih Academy" };

const ADMIN_DEMO_TODAY = new Date("2026-08-31");
const RANGE_VALUES: DashboardRange[] = ["30d", "90d", "year"];

interface AdminDashboardPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminDashboardPage({ params, searchParams }: AdminDashboardPageProps) {
  const [{ locale: rawLocale }, { range }] = await Promise.all([params, searchParams]);
  const locale = rawLocale as Locale;

  const [t, tNav, tStatus, stats, recentPayments, recentSignups] = await Promise.all([
    getTranslations("admin.dashboard"),
    getTranslations("admin.sidebar"),
    getTranslations("common.orderStatus"),
    getAdminStats(),
    getRecentPayments(locale),
    getRecentSignups(),
  ]);

  const initialRange: DashboardRange = RANGE_VALUES.includes(range as DashboardRange)
    ? (range as DashboardRange)
    : "30d";

  const topCourseSales = stats.salesByCourse[0];
  const topCourse = courses.find((c) => c.id === topCourseSales.courseId);
  const courseTitles = Object.fromEntries(courses.map((c) => [c.id, c.title[locale]]));

  const ordersNeedingAttention = orders.filter(
    (o) => o.status === "pending" || o.status === "failed",
  ).length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        navItems={getAdminNavItems("dashboard", tNav.raw("nav"), ordersNeedingAttention, stats.queue.recitationsToReview)}
        userName={tNav("adminName")}
        userRole={tNav("adminRole")}
        wordmark={tNav("wordmark")}
        subtitle={tNav("subtitle")}
        className="shrink-0"
      />

      <div className="min-w-0 flex-1">
        <div className="flex h-[70px] items-center justify-between border-b border-border-subtle bg-surface px-8.5">
          <div className="flex w-[320px] items-center gap-2.5 rounded-sm border border-border-strong px-3.5 py-2.5">
            <Search className="size-4 shrink-0 text-text-muted" strokeWidth={1.7} />
            <span className="text-sm text-text-faint">{t("searchPlaceholder")}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted">
              {new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(ADMIN_DEMO_TODAY)}
            </span>
            <button
              type="button"
              className="flex items-center gap-2 rounded-sm bg-green-700 px-5 py-2.75 text-sm font-semibold text-green-ink"
            >
              <Plus className="size-4" strokeWidth={2} />
              {t("newCourse")}
            </button>
          </div>
        </div>

        <div className="px-8.5 py-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="mb-1 font-serif text-[32px] font-medium">{t("title")}</h1>
              <p className="text-[15px] text-text-muted">{t("subtitle")}</p>
            </div>
            <RangeSelector
              initialRange={initialRange}
              labels={{ "30d": t("range.30d"), "90d": t("range.90d"), year: t("range.year") }}
            />
          </div>

          <div className="mb-7 grid grid-cols-4 gap-5">
            <StatCard
              primary
              label={t("stats.revenue")}
              value={formatPrice(stats.kpi.revenueXof, locale)}
              change={{
                direction: "up",
                label: t("stats.revenueChange", {
                  pct: stats.kpi.revenueChangePct,
                  amount: formatPrice(stats.kpi.revenueChangeXof, locale),
                }),
              }}
            />
            <StatCard
              label={t("stats.sales")}
              value={String(stats.kpi.salesCount)}
              change={{
                direction: "up",
                label: t("stats.salesChange", {
                  count: stats.kpi.salesChange,
                  topSales: topCourseSales.sales,
                  topCourse: courseTitles[topCourseSales.courseId],
                }),
              }}
            />
            <StatCard
              label={t("stats.learners")}
              value={new Intl.NumberFormat(locale).format(stats.kpi.learnersCount)}
              change={{ direction: "up", label: t("stats.learnersChange", { count: stats.kpi.learnersChange }) }}
            />
            <StatCard
              label={t("stats.completionRate")}
              value={`${stats.kpi.completionRatePct} %`}
              change={{
                direction: "down",
                label: t("stats.completionRateChange", { pts: stats.kpi.completionRateChangePts }),
              }}
            />
          </div>

          <div className="grid grid-cols-[1fr_360px] items-start gap-6">
            <div className="flex flex-col gap-6">
              <RecentPaymentsCard
                title={t("recentPayments.title")}
                allOrdersLabel={t("recentPayments.allOrders")}
                columns={{
                  learner: t("recentPayments.columns.learner"),
                  course: t("recentPayments.columns.course"),
                  amount: t("recentPayments.columns.amount"),
                  status: t("recentPayments.columns.status"),
                  date: t("recentPayments.columns.date"),
                }}
                statusLabels={{
                  paid: tStatus("paid"),
                  pending: tStatus("pending"),
                  failed: tStatus("failed"),
                  refunded: tStatus("refunded"),
                  draft: tStatus("draft"),
                  premium: tStatus("premium"),
                }}
                payments={recentPayments}
                locale={locale}
              />
              <SalesByCourseCard
                title={t("salesByCourse.title")}
                subtitle={t("salesByCourse.subtitle")}
                salesLabel={(sales, amount) => t("salesByCourse.salesLabel", { count: sales, amount })}
                sales={stats.salesByCourse}
                courseTitles={courseTitles}
                locale={locale}
              />
            </div>

            <div className="flex flex-col gap-5">
              <QueueCard
                title={t("queue.title")}
                count={stats.queue.recitationsToReview + stats.queue.unansweredQuestions}
                recitationsLabel={t("queue.recitations", { count: stats.queue.recitationsToReview })}
                recitationsDetail={t("queue.recitationsDetail", { days: stats.queue.oldestRecitationDaysAgo })}
                questionsLabel={t("queue.questions", { count: stats.queue.unansweredQuestions })}
                questionsDetail={t("queue.questionsDetail")}
                ctaLabel={t("queue.cta")}
              />
              <RecentSignupsCard
                title={t("recentSignups.title")}
                signups={recentSignups.map((s) => ({
                  id: s.id,
                  name: s.name,
                  initials: s.initials,
                  city: s.city,
                  timeAgo:
                    s.hoursAgo !== undefined
                      ? t("recentSignups.timeAgoHours", { hours: s.hoursAgo })
                      : t("recentSignups.timeAgoYesterday"),
                }))}
              />
              {topCourse && (
                <TopCourseBanner
                  title={t("topCourse.title")}
                  courseTitle={topCourse.title[locale]}
                  body={t("topCourse.body", {
                    sales: topCourseSales.sales,
                    revenue: formatPrice(topCourseSales.revenueXof, locale),
                    rate: 78,
                  })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
