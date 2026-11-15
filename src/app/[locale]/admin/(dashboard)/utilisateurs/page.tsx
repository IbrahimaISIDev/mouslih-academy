import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import { UsersTable } from "@/features/admin/components/users-table";
import { orders } from "@/mocks/orders";

export const metadata: Metadata = {
  title: "Utilisateurs — Administration Mouslih Academy",
};

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
        navItems={getAdminNavItems(
          "users",
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
          title={t("users.title")}
          subtitle={t("users.subtitle", {
            total: new Intl.NumberFormat(locale).format(
              stats.kpi.learnersCount,
            ),
            change: stats.kpi.learnersChange,
          })}
        />
        <div className="px-8.5">
          <UsersTable locale={locale} />
        </div>
      </div>
    </div>
  );
}
