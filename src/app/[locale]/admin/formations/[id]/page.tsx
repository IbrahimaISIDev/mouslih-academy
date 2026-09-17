import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import { getCourseEditor } from "@/features/admin/api/get-course-editor";
import { CourseEditorForm } from "@/features/admin/components/course-editor-form";
import { orders } from "@/mocks/orders";

export const metadata: Metadata = { title: "Gestion de formation — Administration Mouslih Academy" };

interface AdminCourseEditorPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminCourseEditorPage({ params }: AdminCourseEditorPageProps) {
  const { locale: rawLocale, id } = await params;
  const locale = rawLocale as Locale;

  const [tNav, stats, editorData] = await Promise.all([
    getTranslations("admin.sidebar"),
    getAdminStats(),
    getCourseEditor(id),
  ]);

  if (!editorData) notFound();
  const { course, videoStatus } = editorData;

  const ordersNeedingAttention = orders.filter(
    (o) => o.status === "pending" || o.status === "failed",
  ).length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        navItems={getAdminNavItems("courses", tNav.raw("nav"), ordersNeedingAttention, stats.queue.recitationsToReview)}
        userName={tNav("adminName")}
        userRole={tNav("adminRole")}
        wordmark={tNav("wordmark")}
        subtitle={tNav("subtitle")}
        className="shrink-0"
      />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <CourseEditorForm
          courseId={id}
          locale={locale}
          initialCourse={course}
          initialVideoStatus={videoStatus}
          translationDoneCounts={{ en: 6 }}
        />
      </div>
    </div>
  );
}
