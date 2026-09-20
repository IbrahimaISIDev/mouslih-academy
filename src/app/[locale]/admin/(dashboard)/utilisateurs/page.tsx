import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import { UsersTable } from "@/features/admin/components/users-table";
import { orders } from "@/mocks/orders";

export const metadata: Metadata = { title: "Utilisateurs — Administration Mouslih Academy" };

interface AdminUsersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminUsersPage({ params }: AdminUsersPageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const [t, tNav, stats] = await Promise.all([
    getTranslations("admin.table"),
    getTranslations("admin.sidebar"),
    getAdminStats(),
  ]);

  const ordersNeedingAttention = orders.filter(
    (o) => o.status === "pending" || o.status === "failed",
  ).length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        navItems={getAdminNavItems("users", tNav.raw("nav"), ordersNeedingAttention, stats.queue.recitationsToReview)}
        userName={tNav("adminName")}
        userRole={tNav("adminRole")}
        wordmark={tNav("wordmark")}
        subtitle={tNav("subtitle")}
        className="shrink-0"
      />

      <div className="min-w-0 flex-1 px-8.5 py-7.5">
        <div className="mb-5.5 flex items-end justify-between">
          <div>
            <h1 className="mb-1 font-serif text-[30px] font-medium">{t("users.title")}</h1>
            <p className="text-[15px] text-text-muted">
              {t("users.subtitle", {
                total: new Intl.NumberFormat(locale).format(stats.kpi.learnersCount),
                change: stats.kpi.learnersChange,
              })}
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-sm border border-border-strong bg-surface px-4.5 py-2.75 text-sm font-semibold text-text-soft"
          >
            <Download className="size-4" strokeWidth={1.7} />
            {t("exportCsv")}
          </button>
        </div>

        <UsersTable locale={locale} />
      </div>
    </div>
  );
}
