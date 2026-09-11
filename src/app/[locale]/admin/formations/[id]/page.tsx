import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { formatTotalDuration } from "@/lib/format";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { StatusBadge } from "@/components/patterns/status-badge";
import { getAdminNavItems } from "@/features/admin/nav-items";
import { getAdminStats } from "@/features/admin/api/get-admin-stats";
import { getCourseEditor } from "@/features/admin/api/get-course-editor";
import { TranslationEditorCard } from "@/features/admin/components/translation-editor-card";
import { CurriculumEditor } from "@/features/admin/components/curriculum-editor";
import { CoverImageCard } from "@/features/admin/components/cover-image-card";
import { CourseSettingsCard } from "@/features/admin/components/course-settings-card";
import { CourseActionBar } from "@/features/admin/components/course-action-bar";
import { orders } from "@/mocks/orders";

export const metadata: Metadata = { title: "Gestion de formation — Administration Mouslih Academy" };

const LAST_EDITED_MINUTES = 12;

interface AdminCourseEditorPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminCourseEditorPage({ params }: AdminCourseEditorPageProps) {
  const { locale: rawLocale, id } = await params;
  const locale = rawLocale as Locale;

  const [t, tNav, stats, editorData] = await Promise.all([
    getTranslations("admin.course"),
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

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border-subtle bg-surface px-8.5 pt-5.5">
          <p className="mb-3.5 text-[13px] text-text-muted">
            {t("breadcrumb")} <span className="mx-2 inline-block rtl:scale-x-[-1]">›</span>
            <span className="text-text-soft">{course.title[locale]}</span>
          </p>
          <div className="mb-5.5 flex items-start justify-between gap-7">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="font-serif text-[30px] font-medium">{course.title[locale]}</h1>
                <StatusBadge
                  status={course.status === "draft" ? "draft" : "paid"}
                  label={course.status === "draft" ? t("status.draft") : t("status.published")}
                />
              </div>
              <p className="text-sm text-text-muted">
                {t("meta", {
                  modules: course.modules.length,
                  lessons: course.lessonCount,
                  duration: formatTotalDuration(course.totalDurationSeconds),
                  minutes: LAST_EDITED_MINUTES,
                })}
              </p>
            </div>
            <div className="flex shrink-0 gap-2.5">
              <button
                type="button"
                className="rounded-sm border border-border-strong px-4.5 py-2.75 text-sm font-semibold text-text-soft"
              >
                {t("previewLearner")}
              </button>
              <button
                type="button"
                className="rounded-sm border border-green-700 bg-green-700 px-5 py-2.75 text-sm font-semibold text-green-ink"
              >
                {t("publish")}
              </button>
            </div>
          </div>
          <div className="flex gap-1">
            <span className="border-b-2 border-green-700 px-4 py-3 text-[15px] font-semibold text-green-ink">
              {t("tabs.content")}
            </span>
            <span className="px-4 py-3 text-[15px] text-text-muted">{t("tabs.info")}</span>
            <span className="px-4 py-3 text-[15px] text-text-muted">{t("tabs.pricing")}</span>
            <span className="px-4 py-3 text-[15px] text-text-muted">{t("tabs.learners")}</span>
          </div>
        </div>

        <div className="flex-1 px-8.5 py-7">
          <div className="mb-6">
            <TranslationEditorCard course={course} translationDoneCounts={{ en: 6 }} />
          </div>

          <div className="grid grid-cols-[1fr_340px] items-start gap-6">
            <CurriculumEditor courseId={course.id} initialModules={course.modules} videoStatus={videoStatus} addModuleLabel={t("curriculum.addModule")} />

            <div className="flex flex-col gap-5">
              <CoverImageCard title={t("cover.title")} replaceLabel={t("cover.replace")} />
              <CourseSettingsCard
                title={t("settings.title")}
                levelLabel={t("settings.level")}
                levelOptions={{
                  beginner: t("settings.levels.beginner"),
                  intermediate: t("settings.levels.intermediate"),
                  advanced: t("settings.levels.advanced"),
                }}
                initialLevel={course.level}
                priceLabel={t("settings.price")}
                initialPriceXof={course.priceXof}
                freePreviewLabel={t("settings.freePreview")}
                freePreviewHelp={t("settings.freePreviewHelp", { count: 2 })}
                certificateLabel={t("settings.certificate")}
                certificateHelp={t("settings.certificateHelp")}
                voiceCorrectionLabel={t("settings.voiceCorrection")}
                voiceCorrectionHelp={t("settings.voiceCorrectionHelp")}
                initialHasCertificate={course.hasCertificate}
                initialHasVoiceCorrection={course.hasVoiceCorrection}
              />
            </div>
          </div>
        </div>

        <CourseActionBar
          autosavedLabel={t("actionBar.autosaved", { minutes: LAST_EDITED_MINUTES })}
          deleteLabel={t("delete")}
          previewLabel={t("previewLearner")}
          publishLabel={t("publish")}
        />
      </div>
    </div>
  );
}
