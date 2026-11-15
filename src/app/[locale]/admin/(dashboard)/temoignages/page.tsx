import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import { TestimonialsManager } from "@/features/admin/components/testimonials-manager";
import { orders } from "@/mocks/orders";

export const metadata: Metadata = {
  title: "Témoignages — Administration Mouslih Academy",
};

export default async function AdminTestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  const [t, tNav, stats] = await Promise.all([
    getTranslations("admin.testimonials"),
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
          "testimonials",
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
        />
        <div className="px-8.5">
          <TestimonialsManager />
        </div>
      </div>
    </div>
  );
}
