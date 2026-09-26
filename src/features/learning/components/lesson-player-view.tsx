"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, CheckCircle, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import type { Course, LessonQuestion, Locale } from "@/lib/types";
import type { LessonLocation } from "@/features/learning/find-lesson";
import type { LessonOverviewContent } from "@/mocks/lesson-content";
import { formatDuration, localizeDigits } from "@/lib/format";
import { getLessonState } from "@/features/learning/get-lesson-state";
import { useEnrollment } from "@/features/learning/hooks/use-enrollment";
import { useCompleteLesson } from "@/features/learning/hooks/use-complete-lesson";
import { useSaveLessonPosition } from "@/features/learning/hooks/use-save-lesson-position";
import { getStoredPosition } from "@/features/learning/lesson-progress-storage";
import type { CurriculumModule } from "@/components/patterns/curriculum-accordion";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ProgressBar } from "@/components/patterns/progress-bar";
import { DirectionalIcon } from "@/components/patterns/directional-icon";
import { LessonSidebar } from "@/features/learning/components/lesson-sidebar";
import { LessonTabs } from "@/features/learning/components/lesson-tabs";

const VideoPlayer = dynamic(
  () =>
    import("@/features/learning/components/video-player").then(
      (m) => m.VideoPlayer,
    ),
  { ssr: false, loading: () => <div className="aspect-video bg-green-900" /> },
);

const WHATSAPP_URL = "https://wa.me/221771542311";

export interface LessonPlayerViewProps {
  course: Course;
  location: LessonLocation;
  locale: Locale;
  overviewContent: LessonOverviewContent | null;
  questions: LessonQuestion[];
  previousHref: string | null;
  nextHref: string | null;
}

function LessonPlayerView({
  course,
  location,
  locale,
  overviewContent,
  questions,
  previousHref,
  nextHref,
}: LessonPlayerViewProps) {
  const t = useTranslations("player");
  const router = useRouter();
  const { lesson, module, lessonIndex, totalLessons } = location;

  const { data: enrollment } = useEnrollment(course.id);
  const completeLessonMutation = useCompleteLesson();
  const savePosition = useSaveLessonPosition(course.id, lesson.id);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [autoAdvanceIn, setAutoAdvanceIn] = useState<number | null>(null);
  const [initialPosition, setInitialPosition] = useState(
    enrollment?.currentLessonId === lesson.id
      ? (enrollment?.resumeAtSeconds ?? 0)
      : 0,
  );

  useEffect(() => {
    const stored = getStoredPosition(course.id, lesson.id);
    if (stored !== null) setInitialPosition(stored);
  }, [course.id, lesson.id]);

  useEffect(() => {
    if (autoAdvanceIn === null || !nextHref) return;
    if (autoAdvanceIn <= 0) {
      router.push(nextHref);
      return;
    }
    const timeout = setTimeout(
      () => setAutoAdvanceIn((n) => (n ?? 1) - 1),
      1000,
    );
    return () => clearTimeout(timeout);
  }, [autoAdvanceIn, nextHref, router]);

  const completedCount = enrollment?.completedLessonIds.length ?? 0;
  const progressPct = Math.round((completedCount / course.lessonCount) * 100);

  const sidebarModules: CurriculumModule[] = course.modules.map(
    (m, moduleIdx) => ({
      id: m.id,
      number: String(moduleIdx + 1).padStart(2, "0"),
      title: m.title[locale],
      meta: "",
      subModules: m.subModules.map((sub) => ({
        id: sub.id,
        title: sub.title ? sub.title[locale] : null,
        lessons: sub.lessons.map((l) => ({
          id: l.id,
          title: l.title[locale],
          duration: formatDuration(l.durationSeconds),
          state:
            l.id === lesson.id
              ? "current"
              : getLessonState(l, enrollment ?? null, true),
        })),
      })),
    }),
  );

  function handleComplete() {
    completeLessonMutation.mutate(lesson.id);
    if (nextHref) setAutoAdvanceIn(3);
  }

  const sidebar = (
    <LessonSidebar
      title={t("sidebarTitle")}
      progressLabel={localizeDigits(
        t("progressLabel", { done: completedCount, total: course.lessonCount }),
        locale,
      )}
      progressPct={progressPct}
      modules={sidebarModules}
      defaultOpen={[module.id]}
      lockedTooltipLabel={t("lockedTooltip")}
      sendRecitationLabel={t("sendRecitation")}
      whatsappHref={WHATSAPP_URL}
    />
  );

  return (
    <div className="pb-28 lg:pb-0">
      {/* Barre supérieure */}
      <div className="flex h-14 items-center gap-5 bg-green-900 px-5 text-on-dark-soft lg:px-5.5">
        <Link
          href="/tableau-de-bord"
          className="flex items-center gap-2.5 text-sm"
        >
          <DirectionalIcon icon={ArrowLeft} className="size-[18px]" strokeWidth={1.7} />
          <span className="hidden lg:inline">{t("backToDashboard")}</span>
        </Link>
        <span className="hidden h-5.5 w-px bg-green-300/30 lg:block" />
        <span className="hidden font-serif text-base text-on-dark lg:inline">
          {course.title[locale]}
        </span>
        <div className="ms-auto flex flex-1 items-center gap-3.5 lg:max-w-95 lg:flex-none">
          <ProgressBar
            percent={progressPct}
            tone="onDark"
            className="hidden flex-1 lg:flex"
            label={localizeDigits(
              t("progressLabel", { done: completedCount, total: course.lessonCount }),
              locale,
            )}
            labelClassName="whitespace-nowrap"
          />
          <span className="text-[13px] tabular-nums text-on-dark-muted lg:hidden">
            {localizeDigits(t("percentLabel", { pct: progressPct }), locale)}
          </span>
        </div>
        <Avatar
          size="sm"
          className="hidden shrink-0 border border-gold-600/50 bg-green-800 lg:flex"
        >
          <AvatarFallback className="bg-transparent text-gold-200">
            {course.title[locale].charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="h-[3px] bg-white/15 lg:hidden">
        <div
          className="h-full bg-gold-200"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_380px]">
        <div className="lg:border-e lg:border-border-subtle">
          <VideoPlayer
            durationSeconds={lesson.durationSeconds}
            initialPositionSeconds={initialPosition}
            verseText={overviewContent?.verseText}
            onProgress={savePosition}
            onComplete={handleComplete}
          />

          {/* Déclencheur du drawer mobile */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex w-full items-center gap-2.5 border-b border-border-subtle bg-bg px-4 py-3.5 lg:hidden"
          >
            <Menu className="size-[18px] text-green-ink" strokeWidth={1.7} />
            <span className="flex-1 text-start text-[15px] font-semibold">
              {t("mobile.programBar")}
            </span>
            <span className="text-[13px] tabular-nums text-text-muted">
              {localizeDigits(
                t("progressLabel", { done: completedCount, total: course.lessonCount }),
                locale,
              )}
            </span>
          </button>

          <div className="px-5 pt-5 lg:px-7.5 lg:pt-6.5">
            <p className="mb-2.5 text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase">
              {localizeDigits(
                t("moduleLessonLabel", {
                  module: module.title[locale],
                  index: lessonIndex,
                  total: totalLessons,
                }),
                locale,
              )}
            </p>
            <h1 className="mb-0 font-serif text-2xl font-medium tracking-[-0.01em] lg:text-[32px]">
              {lesson.title[locale]}
            </h1>
          </div>

          <div className="px-5 lg:px-7.5">
            <LessonTabs
              overview={overviewContent}
              resources={lesson.resources}
              questions={questions}
              locale={locale}
            />
          </div>

          {autoAdvanceIn !== null && (
            <div className="mx-5 mb-5 flex items-center justify-between gap-3 border border-gold-300 bg-gold-50 px-4 py-3 text-sm text-green-ink lg:mx-7.5">
              <span>
                {localizeDigits(t("autoAdvance.message", { seconds: autoAdvanceIn }), locale)}
              </span>
              <button
                type="button"
                onClick={() => setAutoAdvanceIn(null)}
                className="font-semibold text-green-ink underline"
              >
                {t("autoAdvance.cancel")}
              </button>
            </div>
          )}

          <div className="hidden items-center justify-between border-t border-border-subtle bg-bg px-7.5 py-4.5 lg:flex">
            <Button
              variant="secondary"
              disabled={!previousHref}
              asChild={!!previousHref}
            >
              {previousHref ? (
                <Link href={previousHref}>
                  <DirectionalIcon icon={ArrowLeft} className="size-[17px]" strokeWidth={1.8} />
                  {t("nav.previous")}
                </Link>
              ) : (
                <span>
                  <DirectionalIcon icon={ArrowLeft} className="size-[17px]" strokeWidth={1.8} />
                  {t("nav.previous")}
                </span>
              )}
            </Button>
            <button
              type="button"
              onClick={handleComplete}
              className="flex items-center gap-2.5 text-[15px] font-semibold text-green-ink"
            >
              <CheckCircle className="size-[18px]" strokeWidth={1.7} />
              {t("nav.markComplete")}
            </button>
            <Button disabled={!nextHref} asChild={!!nextHref}>
              {nextHref ? (
                <Link href={nextHref}>
                  {t("nav.next")}
                  <DirectionalIcon icon={ArrowRight} className="size-[17px]" strokeWidth={1.8} />
                </Link>
              ) : (
                <span>{t("nav.next")}</span>
              )}
            </Button>
          </div>
        </div>

        <div className="hidden bg-surface lg:block">{sidebar}</div>
      </div>

      {/* Drawer mobile */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="bottom"
          className="top-30 h-auto rounded-t-none border-t p-0"
        >
          <SheetTitle className="sr-only">{t("sidebarTitle")}</SheetTitle>
          <div className="overflow-y-auto">{sidebar}</div>
        </SheetContent>
      </Sheet>

      {/* Barre fixe mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-border-subtle bg-surface/88 px-4 py-3 backdrop-blur-md lg:hidden">
        <Button
          variant="secondary"
          disabled={!previousHref}
          asChild={!!previousHref}
          className="w-13 shrink-0 px-0"
        >
          {previousHref ? (
            <Link href={previousHref} aria-label={t("nav.previous")}>
              <DirectionalIcon icon={ArrowLeft} className="size-[19px]" strokeWidth={1.8} />
            </Link>
          ) : (
            <span aria-hidden="true">
              <DirectionalIcon icon={ArrowLeft} className="size-[19px]" strokeWidth={1.8} />
            </span>
          )}
        </Button>
        <Button disabled={!nextHref} asChild={!!nextHref} className="flex-1">
          {nextHref ? (
            <Link href={nextHref}>
              {t("nav.next")}
              <DirectionalIcon icon={ArrowRight} className="size-[17px]" strokeWidth={1.8} />
            </Link>
          ) : (
            <span>{t("nav.next")}</span>
          )}
        </Button>
      </div>
    </div>
  );
}

export { LessonPlayerView };
