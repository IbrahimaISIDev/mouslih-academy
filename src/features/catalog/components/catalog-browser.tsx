"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import { formatPrice, formatTotalDuration } from "@/lib/format";
import type { Course, Level, Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CourseCard } from "@/components/patterns/course-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { Button } from "@/components/ui/button";

const LEVEL_VALUES = ["all", "beginner", "intermediate", "advanced"] as const;
type LevelFilter = (typeof LEVEL_VALUES)[number];

export interface CatalogBrowserProps {
  courses: Course[];
  locale: Locale;
  initialQuery: string;
  initialLevel: LevelFilter;
}

function CatalogBrowser({
  courses,
  locale,
  initialQuery,
  initialLevel,
}: CatalogBrowserProps) {
  const t = useTranslations("catalog");

  // nuqs ne résout pas l'URL réelle pendant le rendu serveur : la valeur affichée vient de
  // l'état local (initialisé depuis les searchParams lus côté serveur, donc fidèle au
  // rechargement de page) ; les setters nuqs servent uniquement à synchroniser l'URL.
  const [q, setQLocal] = useState(initialQuery);
  const [level, setLevelLocal] = useState<LevelFilter>(initialLevel);

  const [, setQUrl] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ history: "replace" }),
  );
  const [, setLevelUrl] = useQueryState(
    "level",
    parseAsStringEnum<LevelFilter>([...LEVEL_VALUES])
      .withDefault("all")
      .withOptions({ history: "replace" }),
  );

  function setQ(value: string) {
    setQLocal(value);
    setQUrl(value || null);
  }

  function setLevel(value: LevelFilter) {
    setLevelLocal(value);
    setLevelUrl(value === "all" ? null : value);
  }

  const query = q.trim().toLowerCase();
  const results = courses.filter((course) => {
    if (level !== "all" && course.level !== level) return false;
    if (!query) return true;
    return (
      course.title[locale].toLowerCase().includes(query) ||
      course.cardDescription[locale].toLowerCase().includes(query)
    );
  });

  function reset() {
    setQ("");
    setLevel("all");
  }

  return (
    <div>
      <div className="border-b border-border-subtle px-5 pt-6 pb-6 sm:px-6 lg:px-11 lg:pt-11 lg:pb-7.5">
        <h1 className="mb-3.5 font-serif text-[28px] font-medium tracking-[-0.01em] lg:mb-2.5 lg:text-[40px]">
          {t("title")}
        </h1>
        <p className="mb-3.5 max-w-[60ch] text-base text-text-muted lg:mb-7.5">
          {t("description")}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex w-full items-center gap-2.5 rounded-sm border border-border-strong bg-surface px-3.5 py-3 lg:w-[340px]">
            <Search
              className="size-[17px] shrink-0 text-text-muted"
              strokeWidth={1.7}
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholderMobile")}
              className="w-full flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-faint lg:hidden"
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="hidden w-full flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-faint lg:block"
            />
          </div>

          <div className="flex flex-wrap gap-2 lg:gap-2.5">
            {LEVEL_VALUES.map((value) => {
              const active = value === level;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLevel(value)}
                  className={cn(
                    "rounded-sm border px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap lg:px-[17px] lg:text-sm",
                    active
                      ? "border-green-700 bg-green-700 text-green-ink"
                      : "border-border-strong bg-transparent text-text-soft",
                  )}
                >
                  {t(`levels.${value}`)}
                </button>
              );
            })}
          </div>

          <div className="ms-auto hidden text-sm text-text-muted lg:block">
            {t("count", { count: results.length })}
          </div>
        </div>
      </div>

      <div className="min-h-[420px] bg-bg px-5 pt-5 pb-24 sm:px-6 lg:px-11 lg:pt-9 lg:pb-14 lg:pb-24">
        <div className="mb-4 text-[13px] text-text-muted lg:hidden">
          {t("count", { count: results.length })}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-[26px]">
            {results.map((course) => (
              <CourseCard
                key={course.id}
                href={`/formations/${course.slug}`}
                title={course.title[locale]}
                meta={`${course.lessonCount} leçons · ${formatTotalDuration(course.totalDurationSeconds)}`}
                price={formatPrice(course.priceXof, locale)}
                level={course.level}
                levelLabel={t(`levels.${course.level}` as `levels.${Level}`)}
                coverUrl={course.coverUrl}
                discoverLabel={t("discover")}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border-strong bg-surface px-6 py-11 text-center lg:px-10 lg:py-16">
            <EmptyState
              icon={Search}
              title={
                <>
                  <span className="lg:hidden">
                    {t("empty.titleMobile", { query: q })}
                  </span>
                  <span className="hidden lg:inline">
                    {t("empty.title", { query: q })}
                  </span>
                </>
              }
              description={
                <>
                  <span className="lg:hidden">
                    {t("empty.descriptionMobile")}
                  </span>
                  <span className="hidden lg:inline">
                    {t("empty.description")}
                  </span>
                </>
              }
            />
            <div className="mt-6.5 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="primary"
                onClick={reset}
                className="lg:hidden w-full"
              >
                {t("empty.resetMobile")}
              </Button>
              <Button
                variant="primary"
                onClick={reset}
                className="hidden lg:inline-flex"
              >
                {t("empty.reset")}
              </Button>
              <Button variant="secondary" className="hidden lg:inline-flex">
                {t("empty.suggest")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { CatalogBrowser };
