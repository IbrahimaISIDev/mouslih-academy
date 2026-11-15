import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import { TestimonialsManager } from "@/features/admin/components/testimonials-manager";
import { orders } from "@/mocks/orders";

export const metadata: Metadata = {
  title: "Témoignages — Administration Mouslih Academy",
};

export default async function AdminTestimonialsPage() {
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

      <div className="min-w-0 flex-1 px-8.5 py-7.5">
        <div className="mb-6">
          <h1 className="mb-1 font-serif text-[30px] font-medium">
            {t("title")}
          </h1>
          <p className="text-[15px] text-text-muted">{t("subtitle")}</p>
        </div>
        <TestimonialsManager />
      </div>
    </div>
  );
}
