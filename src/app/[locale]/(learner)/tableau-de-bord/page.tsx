import type { Metadata } from "next";
import { BookOpen, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { daysAgo, formatDuration, localizeDigits } from "@/lib/format";
import { getCourses } from "@/features/catalog/api/get-courses";
import { getEnrollments } from "@/features/learning/api/get-enrollments";
import { getProfile } from "@/features/account/api/get-profile";
import { logout } from "@/features/auth/api/logout";
import { findLessonLocation } from "@/features/learning/find-lesson";

import { LearnerHeader } from "@/components/layout/learner-header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/patterns/alert";
import { EmptyState } from "@/components/patterns/empty-state";
import { ContinueLearningCard } from "@/features/account/components/continue-learning-card";
import {
  MyCourseRow,
  type CourseRowStatus,
} from "@/features/account/components/my-course-row";
import { getLearnerTabItems } from "@/features/account/mobile-tabs";
import { WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Tableau de bord — Mouslih Academy",
};

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ demo?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const { demo } = await searchParams;

  const [t, tNav, courses, fetchedEnrollments, profile] = await Promise.all([
    getTranslations("dashboard"),
    getTranslations("nav"),
    getCourses(),
    getEnrollments(),
    getProfile(),
  ]);

  // `?demo=empty` force la bibliothèque vide pour rendre l'état atteignable en démo
  // (l'unique apprenante de démo a toujours des inscriptions dans les fixtures).
  const enrollments = demo === "empty" ? [] : fetchedEnrollments;

  const learnerNavItems = [
    { label: tNav("dashboard"), href: "/tableau-de-bord", active: true },
    { label: tNav("catalog"), href: "/formations" },
  ];

  const tabItems = getLearnerTabItems("home", {
    home: tNav("home"),
    courses: tNav("myCourses"),
    catalog: tNav("catalog"),
    profile: tNav("profile"),
  });

  const inProgress = enrollments.find(
    (e) => !e.completedAt && e.currentLessonId,
  );
  const inProgressCourse = inProgress
    ? courses.find((c) => c.id === inProgress.courseId)
    : undefined;
  const lessonsRemainingInCourse =
    inProgress && inProgressCourse
      ? Math.max(
          0,
          inProgressCourse.lessonCount - inProgress.completedLessonIds.length,
        )
      : 0;
  const location =
    inProgress && inProgressCourse
      ? findLessonLocation(inProgressCourse, inProgress.currentLessonId)
      : null;

  const continuePct =
    inProgress && inProgressCourse
      ? Math.round(
          (inProgress.completedLessonIds.length /
            inProgressCourse.lessonCount) *
            100,
        )
      : 0;

  return (
    <div className="pb-24 lg:pb-0">
      <LearnerHeader
        navItems={learnerNavItems}
        userName={profile.firstName}
        userMenuItems={[{ label: tNav("profile"), href: "/profil" }]}
        logoutLabel={tNav("logout")}
        onLogout={logout.bind(null, locale)}
      />

      <div className="px-5 py-6 sm:px-6 lg:px-11 lg:py-11">
        <div className="mb-7.5 lg:mb-10">
          <p
            dir="rtl"
            lang="ar"
            className="mb-1.5 font-serif text-lg text-green-ink lg:mb-2 lg:text-[22px]"
          >
            {t("salam")}
          </p>
          <h1 className="mb-1.5 font-serif text-[28px] font-medium tracking-[-0.01em] lg:mb-2 lg:text-[40px]">
            {t("welcomeTitle", { name: profile.firstName })}
          </h1>
          {inProgress && inProgressCourse && (
            <p className="text-sm text-text-muted lg:text-base">
              <span className="lg:hidden">
                {localizeDigits(
                  t("weeklyProgressMobile", {
                    done: profile.lessonsCompletedThisWeek,
                    remaining: lessonsRemainingInCourse,
                  }),
                  locale,
                )}
              </span>
              <span className="hidden lg:inline">
                {localizeDigits(
                  t("weeklyProgress", {
                    done: profile.lessonsCompletedThisWeek,
                    remaining: lessonsRemainingInCourse,
                    course: inProgressCourse.title[locale],
                  }),
                  locale,
                )}
              </span>
            </p>
          )}
        </div>

        {inProgress && inProgressCourse && location && (
          <ContinueLearningCard
            eyebrow={t("continueLabel")}
            lessonTitle={location.lesson.title[locale]}
            contextLine={localizeDigits(
              t("contextLine", {
                course: inProgressCourse.title[locale],
                module: location.module.title[locale],
                index: location.lessonIndex,
                total: location.totalLessons,
              }),
              locale,
            )}
            progressLabel={localizeDigits(
              t("progressLabel", {
                done: inProgress.completedLessonIds.length,
                total: inProgressCourse.lessonCount,
                pct: continuePct,
              }),
              locale,
            )}
            progressPct={continuePct}
            resumeAtPrefix={t("resumeAt")}
            resumeAtTime={formatDuration(inProgress.resumeAtSeconds)}
            resumeButtonLabel={t("resumeButton")}
            href={`/formations/${inProgressCourse.slug}/lecons/${location.lesson.slug}`}
          />
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-4.5 flex items-end justify-between">
              <h2 className="font-serif text-[26px] font-medium lg:text-[28px]">
                {t("myCoursesTitle")}
              </h2>
              <Link
                href="/formations"
                className="hidden text-sm font-semibold text-green-ink lg:inline"
              >
                {t("browseCatalog")}
              </Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="border border-dashed border-border-strong bg-surface px-6 py-11 text-center lg:px-10 lg:py-16">
                <EmptyState
                  icon={BookOpen}
                  title={t("emptyLibrary.title")}
                  description={t("emptyLibrary.description")}
                  action={
                    <Button variant="primary" asChild>
                      <Link href="/formations">{t("emptyLibrary.action")}</Link>
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {enrollments.map((enrollment) => {
                  const course = courses.find(
                    (c) => c.id === enrollment.courseId,
                  );
                  if (!course) return null;

                  const doneCount = enrollment.completedLessonIds.length;
                  const pct = Math.round(
                    (doneCount / course.lessonCount) * 100,
                  );
                  const status: CourseRowStatus = enrollment.completedAt
                    ? "completed"
                    : doneCount > 0
                      ? "inProgress"
                      : "notStarted";

                  const metaLine =
                    status === "completed"
                      ? t("completedOn", {
                          date: enrollment.completedAt
                            ? new Intl.DateTimeFormat(locale, {
                                dateStyle: "long",
                              }).format(new Date(enrollment.completedAt))
                            : "",
                        })
                      : status === "notStarted"
                        ? t("neverStarted")
                        : localizeDigits(
                            t("lastSeenDaysAgo", {
                              days: enrollment.lastActivityAt
                                ? daysAgo(enrollment.lastActivityAt)
                                : 0,
                            }),
                            locale,
                          );

                  const actionLabel =
                    status === "completed"
                      ? t("certificateBtn")
                      : status === "notStarted"
                        ? t("startBtn")
                        : t("continueBtn");

                  const targetLessonId =
                    enrollment.currentLessonId ||
                    course.modules[0]?.subModules[0]?.lessons[0]?.id;
                  const targetLocation = targetLessonId
                    ? findLessonLocation(course, targetLessonId)
                    : null;
                  const actionHref = targetLocation
                    ? `/formations/${course.slug}/lecons/${targetLocation.lesson.slug}`
                    : `/formations/${course.slug}`;

                  return (
                    <MyCourseRow
                      key={course.id}
                      title={course.title[locale]}
                      metaLine={metaLine}
                      status={status}
                      statusLabel={t(`status.${status}`)}
                      progressPct={pct}
                      progressLabel={localizeDigits(
                        t("progressLabel", {
                          done: doneCount,
                          total: course.lessonCount,
                          pct,
                        }),
                        locale,
                      )}
                      actionLabel={actionLabel}
                      actionHref={actionHref}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {profile.pendingRecitation && (
              <div className="border border-border-subtle bg-surface p-5.5">
                <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
                  {t("pendingCorrectionTitle")}
                </p>
                <div className="mb-4 flex gap-3">
                  <Avatar>
                    <AvatarFallback>OS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold">
                      {t("pendingCorrectionSubject", {
                        module: profile.pendingRecitation.moduleOrder,
                      })}
                    </p>
                    <p className="text-[13px] leading-[1.5] text-text-muted">
                      {t("pendingCorrectionMeta", {
                        days: profile.pendingRecitation.submittedDaysAgo,
                      })}
                    </p>
                  </div>
                </div>
                <Alert variant="pending" title={t("pendingCorrectionStatus")} />
              </div>
            )}

            <div className="border border-border-subtle bg-surface p-5.5">
              <p className="mb-3.5 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
                {t("needHelpTitle")}
              </p>
              <p className="mb-4 text-sm leading-[1.6] text-text-soft">
                {t("needHelpBody")}
              </p>
              <Button variant="whatsapp" className="w-full" asChild>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-4" strokeWidth={1.8} />
                  {t("whatsappCta")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <MobileTabBar items={tabItems} className="lg:hidden" />
    </div>
  );
}
