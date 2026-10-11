import type { LessonMistake, Locale } from "@/lib/types";
import { localizeDigits } from "@/lib/format";
import { TextWithArabic } from "@/components/patterns/text-with-arabic";

export interface MistakeCardProps {
  mistake: LessonMistake;
  /** Numéro de l'erreur sur l'ensemble de la formation (1 à 10). */
  number: number;
  locale: Locale;
  labels: { mistake: string; correction: string; rule: string };
}

/** Fiche détaillée d'une erreur : ce qu'on entend, ce qu'il faut faire, la règle. */
function MistakeCard({ mistake, number, locale, labels }: MistakeCardProps) {
  const rows = [
    {
      label: labels.mistake,
      text: mistake.mistake[locale],
      tone: "text-error",
    },
    {
      label: labels.correction,
      text: mistake.correction[locale],
      tone: "text-success",
    },
    { label: labels.rule, text: mistake.rule[locale], tone: "text-gold-600" },
  ];

  return (
    <article className="border border-border-subtle bg-surface">
      <header className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-[22px] leading-none text-gold-600 tabular-nums">
            {localizeDigits(String(number).padStart(2, "0"), locale)}
          </span>
          <h3 className="text-[15px] font-semibold lg:text-base">
            <TextWithArabic text={mistake.title[locale]} locale={locale} />
          </h3>
        </div>
        <p
          dir="rtl"
          lang="ar"
          className="shrink-0 font-arabic-serif text-[22px] leading-[1.4] text-green-ink"
        >
          {mistake.passage}
        </p>
      </header>
      <dl className="divide-y divide-hairline">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 px-5 py-3 sm:grid-cols-[130px_1fr] sm:gap-4"
          >
            <dt
              className={`text-xs font-semibold tracking-[0.1em] uppercase ${row.tone}`}
            >
              {row.label}
            </dt>
            <dd className="text-[15px] leading-[1.65] text-text-soft">
              <TextWithArabic text={row.text} locale={locale} />
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export { MistakeCard };
