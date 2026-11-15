import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { StatCard } from "@/components/patterns/stat-card";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import {
  ANALYTICS_RANGES,
  getAnalyticsOverview,
  type AnalyticsRange,
} from "@/features/admin/api/get-analytics-overview";
import {
  DailyColumns,
  HorizontalBars,
} from "@/features/admin/components/audience/audience-charts";
import { orders } from "@/mocks/orders";

export const metadata: Metadata = {
  title: "Audience — Administration Mouslih Academy",
};

interface AdminAudiencePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ jours?: string }>;
}

/** Une entrée par jour de la période, y compris les jours sans visite (à zéro). */
function fillDays(days: number, rows: { date: string; visitors: number }[]) {
  const byDate = new Map(rows.map((r) => [r.date, r.visitors]));
  const today = new Date();
  const result: { date: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(
      Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() - i,
      ),
    );
    const date = day.toISOString().slice(0, 10);
    result.push({ date, value: byDate.get(date) ?? 0 });
  }
  return result;
}

function Card({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-sm border border-border-subtle bg-surface p-5.5",
        className,
      )}
    >
      <h2 className="font-serif text-xl font-medium">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function AdminAudiencePage({
  params,
  searchParams,
}: AdminAudiencePageProps) {
  const [{ locale: rawLocale }, { jours }] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = rawLocale as Locale;
  const days: AnalyticsRange = ANALYTICS_RANGES.includes(
    Number(jours) as AnalyticsRange,
  )
    ? (Number(jours) as AnalyticsRange)
    : 30;

  const [t, tNav, stats, overview] = await Promise.all([
    getTranslations("admin.audience"),
    getTranslations("admin.sidebar"),
    getAdminStats(),
    getAnalyticsOverview(days),
  ]);

  const number = new Intl.NumberFormat(locale);
  const ordersNeedingAttention = orders.filter(
    (o) => o.status === "pending" || o.status === "failed",
  ).length;
  const visits = overview.funnel[0]?.sessions ?? 0;
  const pct = (value: number) =>
    visits > 0 ? `${Math.round((value / visits) * 100)} %` : "—";
  const empty = overview.totals.visitors === 0;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        navItems={getAdminNavItems(
          "audience",
          tNav.raw("nav"),
          ordersNeedingAttention,
          stats.queue.recitationsToReview,
        )}
        userName={tNav("adminName")}
        userRole={tNav("adminRole")}
        wordmark={tNav("wordmark")}
        subtitle={tNav("subtitle")}
        className="shrink-0"
      />

      <div className="min-w-0 flex-1 pb-10">
        <AdminPageHeader
          locale={locale}
          title={t("title")}
          subtitle={t("subtitle")}
          actions={
            <nav aria-label={t("rangeLabel")} className="flex gap-2">
              {ANALYTICS_RANGES.map((value) => (
                <Link
                  key={value}
                  href={
                    value === 30
                      ? "/admin/audience"
                      : `/admin/audience?jours=${value}`
                  }
                  aria-current={value === days ? "page" : undefined}
                  className={cn(
                    "rounded-sm border px-3.5 py-2.5 text-[13px] font-semibold",
                    value === days
                      ? "border-green-700 bg-green-700 text-green-ink"
                      : "border-border-strong text-text-soft hover:bg-row-hover",
                  )}
                >
                  {t("range", { days: value })}
                </Link>
              ))}
            </nav>
          }
        />
        <div className="px-8.5">
          <div className="mb-6 grid grid-cols-4 gap-5">
            <StatCard
              primary
              label={t("stats.visitors")}
              value={number.format(overview.totals.visitors)}
            />
            <StatCard
              label={t("stats.videoPlays")}
              value={number.format(overview.totals.videoPlays)}
            />
            <StatCard
              label={t("stats.signups")}
              value={number.format(overview.totals.signups)}
            />
            <StatCard
              label={t("stats.sales", { count: overview.totals.sales })}
              value={formatPrice(overview.totals.revenueXof, locale)}
            />
          </div>

          {empty && (
            <p className="mb-6 rounded-sm border border-border-subtle bg-surface px-5 py-4 text-sm text-text-muted">
              {t("empty")}
            </p>
          )}

          <div className="grid grid-cols-[1fr_380px] items-start gap-6">
            <div className="flex flex-col gap-6">
              <Card
                title={t("daily.title")}
                subtitle={t("daily.subtitle", {
                  pageViews: number.format(overview.totals.pageViews),
                  mobile: overview.totals.mobileShare,
                })}
              >
                <DailyColumns
                  data={fillDays(days, overview.daily).map((d) => ({
                    ...d,
                    label: t("daily.value", { count: d.value }),
                  }))}
                  locale={locale}
                  tableCaption={t("daily.title")}
                  dateHeader={t("daily.dateHeader")}
                  valueHeader={t("daily.valueHeader")}
                />
              </Card>

              <Card title={t("funnel.title")} subtitle={t("funnel.subtitle")}>
                <HorizontalBars
                  locale={locale}
                  rows={overview.funnel.map((step, i) => ({
                    key: step.step,
                    label: t(`funnel.steps.${step.step}`),
                    value: step.sessions,
                    detail: i === 0 ? undefined : pct(step.sessions),
                  }))}
                />
              </Card>

              <Card title={t("videos.title")} subtitle={t("videos.subtitle")}>
                {overview.topVideos.length === 0 ? (
                  <p className="text-sm text-text-muted">{t("videos.empty")}</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-subtle text-start text-xs font-semibold tracking-[0.08em] text-text-muted uppercase">
                        <th className="pb-2.5 text-start font-semibold">
                          {t("videos.columns.video")}
                        </th>
                        <th className="pb-2.5 text-end font-semibold">
                          {t("videos.columns.plays")}
                        </th>
                        <th className="pb-2.5 text-end font-semibold">
                          {t("videos.columns.completions")}
                        </th>
                        <th className="pb-2.5 text-end font-semibold">
                          {t("videos.columns.rate")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.topVideos.map((video) => (
                        <tr
                          key={video.lessonId}
                          className="border-b border-hairline last:border-0"
                        >
                          <td className="py-2.75 pe-4 text-text">
                            {video.title}
                          </td>
                          <td className="py-2.75 text-end tabular-nums">
                            {number.format(video.plays)}
                          </td>
                          <td className="py-2.75 text-end tabular-nums">
                            {number.format(video.completions)}
                          </td>
                          <td className="py-2.75 text-end text-text-muted tabular-nums">
                            {video.plays > 0
                              ? `${Math.round((video.completions / video.plays) * 100)} %`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </div>

            <div className="flex flex-col gap-6">
              <Card title={t("sources.title")} subtitle={t("sources.subtitle")}>
                {overview.sources.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    {t("sources.empty")}
                  </p>
                ) : (
                  <HorizontalBars
                    locale={locale}
                    rows={overview.sources.map((s) => ({
                      key: s.source,
                      label: t.has(`sources.names.${s.source}`)
                        ? t(`sources.names.${s.source}`)
                        : s.source,
                      value: s.visitors,
                    }))}
                  />
                )}
              </Card>

              <Card title={t("pages.title")}>
                {overview.topPages.length === 0 ? (
                  <p className="text-sm text-text-muted">{t("pages.empty")}</p>
                ) : (
                  <ol className="flex flex-col">
                    {overview.topPages.map((page) => (
                      <li
                        key={page.path}
                        className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.25 text-sm last:border-0"
                      >
                        <span
                          dir="ltr"
                          className="truncate text-text-soft"
                          title={page.path}
                        >
                          {page.path}
                        </span>
                        <span className="shrink-0 font-semibold tabular-nums">
                          {number.format(page.views)}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </Card>

              <div className="flex gap-3 rounded-sm border border-border-subtle bg-surface p-4.5 text-[13px] leading-[1.55] text-text-muted">
                <ShieldCheck
                  className="mt-0.5 size-4.5 shrink-0 text-green-800"
                  strokeWidth={1.7}
                />
                <p>{t("privacy")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
