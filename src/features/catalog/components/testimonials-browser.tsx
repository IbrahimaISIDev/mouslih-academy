"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Course, Locale, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TestimonialCard } from "@/components/patterns/testimonial-card";
import { TikTokShowcase } from "@/features/catalog/components/tiktok-showcase";
import { Button } from "@/components/ui/button";

export interface TestimonialsBrowserProps {
  testimonials: Testimonial[];
  courses: Course[];
  locale: Locale;
}

function TestimonialsBrowser({
  testimonials,
  courses,
  locale,
}: TestimonialsBrowserProps) {
  const t = useTranslations("testimonials");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // La page est mise en cache (identique pour tous) et générée à la compilation : le filtre de
  // l'URL (?filter=…) est lu et écrit directement dans le navigateur, après l'affichage — sans
  // useSearchParams, qui empêcherait la génération statique de la page.
  const [filter, setFilterLocal] = useState("all");
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("filter");
    if (fromUrl) setFilterLocal(fromUrl);
  }, []);

  function setFilter(value: string) {
    setFilterLocal(value);
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", value);
    window.history.replaceState(window.history.state, "", url);
  }

  const filtered = testimonials.filter((testimonial) => {
    if (filter === "all") return true;
    if (filter === "video")
      return testimonial.kind === "video" || testimonial.kind === "tiktok";
    if (filter === "text") return testimonial.kind === "text";
    return testimonial.courseId === filter;
  });

  const courseIds = Array.from(
    new Set(testimonials.map((testimonial) => testimonial.courseId)),
  );
  const courseFilters = courseIds
    .map((id) => courses.find((course) => course.id === id))
    .filter((course): course is Course => !!course);

  // Vidéos TikTok : vitrine « stories » ; témoignages écrits : mosaïque / carrousel ci-dessous.
  const videoItems = filtered.filter(
    (item) => item.kind === "tiktok" && item.tiktokId,
  );
  const otherItems = filtered.filter(
    (item) => !(item.kind === "tiktok" && item.tiktokId),
  );

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = el.scrollWidth / Math.max(1, otherItems.length);
    setActiveSlide(Math.round(el.scrollLeft / slideWidth));
  }

  return (
    <div>
      <div className="border-b border-border-subtle bg-surface px-5 pt-6 pb-7.5 sm:px-6 lg:px-11 lg:pt-11 lg:pb-7.5">
        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.18em] text-gold-700 uppercase lg:mb-3.5 lg:text-xs">
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

      {videoItems.length > 0 && (
        <div className="bg-bg px-5 pt-6 pb-8 sm:px-6 lg:px-11 lg:pt-8.5 lg:pb-10">
          <TikTokShowcase items={videoItems} locale={locale} variant="grid" />
        </div>
      )}

      {otherItems.length > 0 && (
        <>
          {/* Mosaïque desktop */}
          <div className="hidden bg-bg px-11 py-8.5 lg:block">
            <div className="columns-3 gap-[22px]">
              {otherItems.map((testimonial) => (
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
              {otherItems.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  locale={locale}
                  className="w-[85%] shrink-0 snap-center"
                />
              ))}
            </div>
            {otherItems.length > 1 && (
              <div className="mt-4 flex justify-center gap-1.5">
                {otherItems.map((testimonial, i) => (
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
        </>
      )}
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
