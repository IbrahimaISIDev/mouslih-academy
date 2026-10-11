import type { Lesson, Locale } from "@/lib/types";
import { localizeDigits } from "@/lib/format";
import { TextWithArabic } from "@/components/patterns/text-with-arabic";

export interface MistakesOverviewProps {
  lessons: Lesson[];
  locale: Locale;
  /** Gabarit contenant `{number}`, ex. « Vidéo {number} ». */
  videoLabel: string;
}

/** Grille des erreurs corrigées par la formation, numérotées 01 → 10 dans l'ordre de la sourate. */
function MistakesOverview({
  lessons,
  locale,
  videoLabel,
}: MistakesOverviewProps) {
  const items = lessons.flatMap((lesson, lessonIndex) =>
    lesson.mistakes.map((mistake) => ({ mistake, lessonIndex })),
  );

  return (
    <ol className="grid gap-px border border-border-subtle bg-border-subtle sm:grid-cols-2">
      {items.map(({ mistake, lessonIndex }, index) => (
        <li
          key={mistake.id}
          className="flex items-start gap-4 bg-surface px-5 py-4.5"
        >
          <span className="w-7 shrink-0 font-serif text-xl leading-tight text-gold-600 tabular-nums">
            {localizeDigits(String(index + 1).padStart(2, "0"), locale)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] leading-snug font-semibold">
              <TextWithArabic text={mistake.title[locale]} locale={locale} />
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {localizeDigits(
                videoLabel.replace(
                  "{number}",
                  String(lessonIndex + 1).padStart(2, "0"),
                ),
                locale,
              )}
            </p>
          </div>
          <p
            dir="rtl"
            lang="ar"
            className="shrink-0 font-arabic-serif text-xl leading-[1.5] text-green-ink"
          >
            {mistake.passage}
          </p>
        </li>
      ))}
    </ol>
  );
}

export { MistakesOverview };
