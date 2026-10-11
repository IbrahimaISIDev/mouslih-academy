"use client";

import { Fragment, useState } from "react";
import { CheckCircle2, Clock, Lock, Play, Target } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Lesson, Locale } from "@/lib/types";
import { formatDuration, localizeDigits } from "@/lib/format";
import { parseYouTubeVideoId } from "@/lib/youtube";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { YouTubeFacade } from "@/components/patterns/youtube-facade";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { TextWithArabic } from "@/components/patterns/text-with-arabic";

export interface VideoProgrammeProps {
  lessons: Lesson[];
  courseSlug: string;
  locale: Locale;
  /** Formation achetée : chaque vidéo mène directement au lecteur. */
  isPurchased: boolean;
  /** `detailed` : description, objectif et erreurs (page formation) ; `compact` : une ligne
   *  par vidéo (accueil). */
  variant: "detailed" | "compact";
  labels: {
    videoNumber: string;
    free: string;
    watchFree: string;
    watch: string;
    locked: string;
    objective: string;
    previewCaption: string;
    /** Intitulé de la liste à puces, ex. « Dans cette vidéo, vous apprendrez à : ». */
    learnTitle: string;
    /** Légende de l'encadré du passage arabe, ex. « Passage étudié ». */
    passageLabel: string;
  };
}

/** Programme des vidéos d'une formation : numéro, titre, passage arabe, durée et accès. */
function VideoProgramme({
  lessons,
  courseSlug,
  locale,
  isPurchased,
  variant,
  labels,
}: VideoProgrammeProps) {
  const [preview, setPreview] = useState<Lesson | null>(null);
  const previewVideoId = preview?.videoUrl
    ? parseYouTubeVideoId(preview.videoUrl)
    : null;

  return (
    <>
      <ol
        className={
          variant === "detailed"
            ? "flex flex-col gap-5 lg:gap-6"
            : "divide-y divide-border-subtle border border-border-subtle bg-surface"
        }
      >
        {lessons.map((lesson, index) => {
          const number = localizeDigits(
            String(index + 1).padStart(2, "0"),
            locale,
          );
          const canPreview = !isPurchased && lesson.isFreePreview;
          const lessonHref = `/formations/${courseSlug}/lecons/${lesson.slug}`;

          const action = isPurchased ? (
            <Link
              href={lessonHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-green-ink hover:underline"
            >
              <Play className="size-3.5" fill="currentColor" strokeWidth={0} />
              {labels.watch}
            </Link>
          ) : canPreview ? (
            <button
              type="button"
              onClick={() => setPreview(lesson)}
              className={
                variant === "detailed"
                  ? "inline-flex items-center gap-2 rounded-sm bg-green-700 px-4.5 py-2.5 text-sm font-semibold text-on-dark transition-colors hover:bg-green-800"
                  : "inline-flex items-center gap-2 rounded-sm bg-green-100 px-3 py-2 text-sm font-semibold text-green-ink transition-colors hover:bg-green-100/70"
              }
            >
              <Play className="size-3.5" fill="currentColor" strokeWidth={0} />
              {labels.watchFree}
            </button>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 text-[13px] text-text-muted"
              title={labels.locked}
            >
              <Lock className="size-3.5" strokeWidth={1.8} />
              <span className="sr-only sm:not-sr-only">{labels.locked}</span>
            </span>
          );

          if (variant === "detailed") {
            return (
              <li key={lesson.id}>
                <DetailedVideoCard
                  lesson={lesson}
                  number={number}
                  locale={locale}
                  labels={labels}
                  action={action}
                  showFreeBadge={lesson.isFreePreview && !isPurchased}
                />
              </li>
            );
          }

          return (
            <li
              key={lesson.id}
              className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 px-5 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center lg:px-6"
            >
              <span
                aria-hidden="true"
                className="font-serif text-[28px] leading-none text-gold-600 tabular-nums lg:text-[34px]"
              >
                {number}
              </span>

              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-text-muted uppercase">
                  {localizeDigits(
                    labels.videoNumber.replace("{number}", number),
                    locale,
                  )}
                  {lesson.isFreePreview && !isPurchased && (
                    <span className="ms-2.5 rounded-sm bg-gold-50 px-1.5 py-0.5 tracking-[0.08em] text-gold-600">
                      {labels.free}
                    </span>
                  )}
                </p>
                <h3 className="font-serif text-lg leading-snug font-semibold lg:text-xl">
                  {lesson.title[locale]}
                </h3>
                {lesson.passage && (
                  // Le bloc suit le sens de la page (aligné sous le titre) ; seul le texte
                  // arabe lui-même est en RTL.
                  <p className="mt-1.5">
                    <span
                      dir="rtl"
                      lang="ar"
                      className="inline-block font-arabic-serif text-[22px] leading-[1.6] text-green-ink lg:text-[26px]"
                    >
                      {lesson.passage}
                    </span>
                  </p>
                )}
              </div>

              {
                <div className="col-start-2 flex items-center gap-4 sm:col-start-3">
                  <span
                    dir="ltr"
                    className="text-[13px] text-text-muted tabular-nums"
                  >
                    {formatDuration(lesson.durationSeconds)}
                  </span>
                  {action}
                </div>
              }
            </li>
          );
        })}
      </ol>

      <Dialog
        open={preview !== null}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.title[locale]}</DialogTitle>
            {preview?.passage && (
              <DialogDescription
                dir="rtl"
                lang="ar"
                className="text-start font-arabic-serif text-xl text-green-ink"
              >
                {preview.passage}
              </DialogDescription>
            )}
          </DialogHeader>
          {preview && previewVideoId && (
            <YouTubeFacade
              key={preview.id}
              videoId={previewVideoId}
              title={preview.title[locale]}
              caption={labels.previewCaption}
              className="group relative grid aspect-video w-full place-items-center overflow-hidden bg-green-800"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface DetailedVideoCardProps {
  lesson: Lesson;
  number: string;
  locale: Locale;
  labels: VideoProgrammeProps["labels"];
  action: React.ReactNode;
  showFreeBadge: boolean;
}

/** Carte d'une vidéo sur la page formation : ce qu'on y apprend, en un coup d'œil. */
function DetailedVideoCard({
  lesson,
  number,
  locale,
  labels,
  action,
  showFreeBadge,
}: DetailedVideoCardProps) {
  const keyPoints = lesson.keyPoints ?? [];

  return (
    <article className="overflow-hidden border border-border-subtle bg-surface transition-shadow hover:shadow-card-hover">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-bg px-5 py-3 lg:px-6.5">
        <div className="flex items-center gap-3">
          <span className="font-serif text-[26px] leading-none text-gold-600 tabular-nums">
            {number}
          </span>
          <span className="text-[11px] font-semibold tracking-[0.16em] text-text-muted uppercase">
            {localizeDigits(
              labels.videoNumber.replace("{number}", number),
              locale,
            )}
          </span>
          {showFreeBadge && (
            <span className="rounded-sm bg-gold-200 px-2 py-0.5 text-[11px] font-semibold tracking-[0.08em] text-green-ink uppercase">
              {labels.free}
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-text-muted">
          <Clock className="size-3.5" strokeWidth={1.8} />
          <span dir="ltr" className="tabular-nums">
            {formatDuration(lesson.durationSeconds)}
          </span>
        </span>
      </header>

      <div className="grid gap-6 px-5 py-6 lg:grid-cols-[1fr_230px] lg:gap-8 lg:px-6.5 lg:py-7">
        <div className="min-w-0">
          <h3 className="font-serif text-[22px] leading-snug font-semibold tracking-[-0.005em] lg:text-[26px]">
            {lesson.title[locale]}
          </h3>

          {keyPoints.length > 0 ? (
            <>
              <p className="mt-5 mb-3 text-xs font-semibold tracking-[0.14em] text-gold-600 uppercase">
                {labels.learnTitle}
              </p>
              <ul className="flex flex-col gap-3">
                {keyPoints.map((point) => (
                  <li
                    key={point.fr}
                    className="flex gap-3 text-[15px] leading-[1.6] text-text lg:text-base"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-green-700"
                      strokeWidth={1.8}
                    />
                    <span>
                      <TextWithArabic text={point[locale]} locale={locale} />
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            lesson.description && (
              <p className="mt-3 max-w-[66ch] text-[15px] leading-[1.7] text-text-soft">
                <TextWithArabic
                  text={lesson.description[locale]}
                  locale={locale}
                />
              </p>
            )
          )}
        </div>

        {lesson.passage && (
          <div className="relative order-first flex flex-col items-center justify-center overflow-hidden rounded-sm bg-green-900 px-5 py-6 text-center lg:order-none">
            <GeometricPattern variant="khatam" opacity={0.2} />
            {/* Passage de plusieurs mots (« الَّذِينَ — الْمَغْضُوبِ ») : un mot par ligne,
                séparés par un filet doré, plutôt qu'un tiret qui casse en fin de ligne. */}
            <div className="relative flex flex-col items-center gap-1.5">
              {lesson.passage.split(/\s+—\s+/).map((word, i) => (
                <Fragment key={word}>
                  {i > 0 && <span className="h-px w-8 bg-gold-600/70" />}
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic-serif text-[30px] leading-[1.5] text-gold-200 lg:text-[34px]"
                  >
                    {word}
                  </p>
                </Fragment>
              ))}
            </div>
            <p className="relative mt-2 text-[11px] font-semibold tracking-[0.16em] text-on-dark-muted uppercase">
              {labels.passageLabel}
            </p>
          </div>
        )}
      </div>

      {lesson.objective && (
        <div className="flex gap-3 border-t border-gold-200 bg-gold-50 px-5 py-4 lg:px-6.5">
          <Target
            className="mt-0.5 size-5 shrink-0 text-gold-600"
            strokeWidth={1.7}
          />
          <p className="text-[15px] leading-[1.6] text-text">
            <span className="font-semibold text-gold-600">
              {labels.objective}
            </span>{" "}
            <TextWithArabic text={lesson.objective[locale]} locale={locale} />
          </p>
        </div>
      )}

      <footer className="flex justify-end border-t border-hairline px-5 py-3.5 lg:px-6.5">
        {action}
      </footer>
    </article>
  );
}

export { VideoProgramme };
