"use client";

import { useRef, useState } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import type { Course, Locale, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TestimonialCard } from "@/components/patterns/testimonial-card";
import { Button } from "@/components/ui/button";

export interface TestimonialsBrowserProps {
  testimonials: Testimonial[];
  courses: Course[];
  locale: Locale;
  initialFilter: string;
}

function TestimonialsBrowser({
  testimonials,
  courses,
  locale,
  initialFilter,
}: TestimonialsBrowserProps) {
  const t = useTranslations("testimonials");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const [filter, setFilterLocal] = useState(initialFilter);
  const [, setFilterUrl] = useQueryState(
    "filter",
    parseAsString.withDefault("all").withOptions({ history: "replace" }),
  );

  function setFilter(value: string) {
    setFilterLocal(value);
    setFilterUrl(value === "all" ? null : value);
  }

  const filtered = testimonials.filter((testimonial) => {
    if (filter === "all") return true;
    if (filter === "video" || filter === "text")
      return testimonial.kind === filter;
    return testimonial.courseId === filter;
  });

  const courseIds = Array.from(
    new Set(testimonials.map((testimonial) => testimonial.courseId)),
  );
  const courseFilters = courseIds
    .map((id) => courses.find((course) => course.id === id))
    .filter((course): course is Course => !!course);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = el.scrollWidth / filtered.length;
    setActiveSlide(Math.round(el.scrollLeft / slideWidth));
  }

  return (
    <div>
      <div className="border-b border-border-subtle bg-surface px-5 pt-6 pb-7.5 sm:px-6 lg:px-11 lg:pt-11 lg:pb-7.5">
        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.18em] text-gold-600 uppercase lg:mb-3.5 lg:text-xs">
          {t("eyebrow")}
        </p>
        <h1 className="mb-3 font-serif text-[28px] leading-[1.15] font-medium tracking-[-0.015em] lg:mb-3 lg:text-[42px]">
          {t("title")}
        </h1>
        <p className="mb-4.5 max-w-[62ch] text-[14px] leading-[1.6] text-text-muted lg:mb-7 lg:text-[17px] lg:leading-[1.65]">
          <span className="lg:hidden">{t("descriptionMobile")}</span>
          <span className="hidden lg:inline">{t("description")}</span>
        </p>

        <div className="flex flex-wrap gap-2 lg:gap-2.25">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label={t("filters.all")}
          />
          <FilterPill
            active={filter === "video"}
            onClick={() => setFilter("video")}
            label={t("filters.video")}
          />
          <FilterPill
            active={filter === "text"}
            onClick={() => setFilter("text")}
            label={t("filters.text")}
          />
          {courseFilters.map((course) => (
            <FilterPill
              key={course.id}
              active={filter === course.id}
              onClick={() => setFilter(course.id)}
              label={course.title[locale]}
              className="hidden lg:inline-flex"
            />
          ))}
        </div>
      </div>

      {/* Mosaïque desktop */}
      <div className="hidden bg-bg px-11 py-8.5 lg:block">
        <div className="columns-3 gap-[22px]">
          {filtered.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              locale={locale}
              className="mb-[22px] break-inside-avoid"
            />
          ))}
        </div>
        <div className="mt-8.5 flex justify-center">
          <Button variant="secondary">{t("seeMore")}</Button>
        </div>
      </div>

      {/* Carrousel mobile */}
      <div className="bg-bg pt-5 pb-24 lg:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none]"
        >
          {filtered.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              locale={locale}
              className="w-[85%] shrink-0 snap-center"
            />
          ))}
        </div>
        {filtered.length > 1 && (
          <div className="mt-4 flex justify-center gap-1.5">
            {filtered.map((testimonial, i) => (
              <span
                key={testimonial.id}
                className={cn(
                  "size-1.5 rounded-full",
                  i === activeSlide ? "bg-green-700" : "bg-border-strong",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  className,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-sm border px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap lg:px-4 lg:text-sm",
        active
          ? "border-green-700 bg-green-700 text-green-ink"
          : "border-border-strong bg-transparent text-text-soft",
        className,
      )}
    >
      {label}
    </button>
  );
}

export { TestimonialsBrowser };
