import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { StatusBadge } from "@/components/patterns/status-badge";
import { LevelBadge } from "@/components/patterns/level-badge";
import { Link } from "@/i18n/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import { listAdminCourses } from "@/features/admin/api/list-admin-courses";
import { NewCourseDialog } from "@/features/admin/components/new-course-dialog";
import { orders } from "@/mocks/orders";

export const metadata: Metadata = { title: "Formations — Administration Mouslih Academy" };

interface AdminCoursesListPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminCoursesListPage({ params }: AdminCoursesListPageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const [t, tCourse, tNav, stats, courses] = await Promise.all([
    getTranslations("admin.coursesList"),
    getTranslations("admin.course"),
    getTranslations("admin.sidebar"),
    getAdminStats(),
    listAdminCourses(),
  ]);

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

      <div className="min-w-0 flex-1 px-8.5 py-7.5">
        <div className="mb-5.5 flex items-end justify-between">
          <h1 className="font-serif text-[30px] font-medium">{t("title")}</h1>
          <NewCourseDialog />
        </div>

        {courses.length === 0 ? (
          <p className="border border-border-subtle bg-surface p-8 text-center text-text-muted">{t("empty")}</p>
        ) : (
          <div className="border border-border-subtle bg-surface">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("columns.title")}</TableHead>
                  <TableHead>{t("columns.level")}</TableHead>
                  <TableHead>{t("columns.status")}</TableHead>
                  <TableHead>{t("columns.price")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Link
                        href={`/admin/formations/${course.id}`}
                        className="font-medium text-text hover:text-green-ink hover:underline"
                      >
                        {course.title[locale]}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <LevelBadge level={course.level} label={tCourse(`settings.levels.${course.level}`)} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={course.status === "draft" ? "draft" : "paid"}
                        label={course.status === "draft" ? tCourse("status.draft") : tCourse("status.published")}
                      />
                    </TableCell>
                    <TableCell className="tabular-nums">{formatPrice(course.priceXof, locale)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
