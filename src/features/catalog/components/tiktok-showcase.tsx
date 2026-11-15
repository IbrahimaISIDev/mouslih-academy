"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Play, Quote, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type { Locale, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { isRtl } from "@/lib/rtl";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export interface TikTokShowcaseProps {
  /** Témoignages TikTok (avec `tiktokId`), du plus récent au plus ancien. */
  items: Testimonial[];
  locale: Locale;
  /** `carousel` : défilement horizontal (accueil) ; `grid` : mosaïque (page Témoignages). */
  variant: "carousel" | "grid";
}

/**
 * Vitrine des témoignages vidéo : vignettes verticales façon « stories », puis lecteur plein
 * écran avec précédent / suivant. Rien n'est chargé depuis TikTok avant le clic (vignettes
 * hébergées chez nous, lecteur officiel inséré seulement à l'ouverture).
 */
function TikTokShowcase({ items, locale, variant }: TikTokShowcaseProps) {
  const t = useTranslations("testimonials.showcase");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const rtl = isRtl(locale);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const scrolled = Math.abs(el.scrollLeft);
    setEdges({
      start: scrolled < 8,
      end: scrolled + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges, items.length]);

  function scrollByCards(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 240) + 16;
    el.scrollBy({
      left: direction * step * 2 * (rtl ? -1 : 1),
      behavior: "smooth",
    });
  }

  const cards = items.map((item, index) => (
    <ShowcaseCard
      key={item.id}
      item={item}
      locale={locale}
      label={t("play", { name: item.authorName })}
      onOpen={() => setOpenIndex(index)}
      className={
        variant === "carousel"
          ? "w-[62vw] max-w-[250px] shrink-0 snap-start sm:w-[230px]"
          : undefined
      }
    />
  ));

  return (
    <>
      {variant === "carousel" ? (
        <div className="relative">
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-11 lg:px-11 [&::-webkit-scrollbar]:hidden"
          >
            {cards}
          </div>
          {items.length > 3 && (
            <div className="mt-5 hidden justify-end gap-2 lg:flex">
              <ArrowButton
                label={t("previous")}
                disabled={edges.start}
                onClick={() => scrollByCards(-1)}
                icon={rtl ? ChevronRight : ChevronLeft}
              />
              <ArrowButton
                label={t("next")}
                disabled={edges.end}
                onClick={() => scrollByCards(1)}
                icon={rtl ? ChevronLeft : ChevronRight}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {cards}
        </div>
      )}

      <Lightbox
        items={items}
        locale={locale}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}

function ShowcaseCard({
  item,
  locale,
  label,
  onOpen,
  className,
}: {
  item: Testimonial;
  locale: Locale;
  label: string;
  onOpen: () => void;
  className?: string;
}) {
  const quote = item.quote[locale];
  return (
    <button
      type="button"
      data-card
      onClick={onOpen}
      aria-label={label}
      className={cn(
        "group relative aspect-9/16 overflow-hidden rounded-md bg-green-900 text-start text-white shadow-[0_10px_30px_-12px_rgba(11,35,14,0.45)] outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]",
        className,
      )}
    >
      {item.thumbnailUrl ? (
        <Image
          src={item.thumbnailUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 250px, (min-width: 640px) 33vw, 62vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      ) : (
        // Sans image : visuel aux couleurs du site, la phrase marquante en grand.
        <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-green-800),var(--color-green-900)_60%,var(--color-green-ink))]">
          <GeometricPattern variant="khatam" opacity={0.18} />
          <Quote
            className="absolute start-4 top-12 size-10 text-gold-200/70"
            strokeWidth={1.2}
          />
          {quote && (
            <p className="absolute inset-x-4 top-24 line-clamp-6 font-serif text-lg leading-snug text-on-dark">
              {quote}
            </p>
          )}
        </div>
      )}

      {/* Lisibilité du texte posé sur l'image */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_30%,rgba(0,0,0,0.35)_52%,transparent_70%)]" />

      <span className="absolute start-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm">
        TikTok
      </span>

      <span className="absolute inset-0 m-auto grid size-14 place-items-center rounded-full border border-white/50 bg-white/15 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">
        <Play className="ms-0.5 size-5" fill="currentColor" strokeWidth={0} />
      </span>

      <span className="absolute inset-x-0 bottom-0 p-3.5 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)] sm:p-4">
        {item.thumbnailUrl && quote && (
          <span className="mb-2 line-clamp-3 block font-serif text-[15px] leading-snug">
            « {quote} »
          </span>
        )}
        <span className="block text-sm font-semibold">{item.authorName}</span>
        {item.authorCity && (
          <span className="block text-xs text-white/75">{item.authorCity}</span>
        )}
      </span>
    </button>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  icon: Icon,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  icon: typeof ChevronLeft;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-border-strong bg-surface text-text-soft transition-colors hover:bg-row-hover disabled:opacity-35"
    >
      <Icon className="size-5" strokeWidth={1.7} />
    </button>
  );
}

function Lightbox({
  items,
  locale,
  index,
  onIndexChange,
}: {
  items: Testimonial[];
  locale: Locale;
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const t = useTranslations("testimonials.showcase");
  const rtl = isRtl(locale);
  const item = index !== null ? items[index] : null;
  const hasPrev = index !== null && index > 0;
  const hasNext = index !== null && index < items.length - 1;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      const next = index + delta;
      if (next >= 0 && next < items.length) onIndexChange(next);
    },
    [index, items.length, onIndexChange],
  );

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") go(rtl ? -1 : 1);
    if (event.key === "ArrowLeft") go(rtl ? 1 : -1);
  }

  // Glisser du doigt (hors du lecteur, qui capte ses propres gestes).
  const touchX = useRef<number | null>(null);

  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    description: "0",
    music_info: "0",
  });

  return (
    <DialogPrimitive.Root
      open={item !== null}
      onOpenChange={(open) => !open && onIndexChange(null)}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/88 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX;
            touchX.current = null;
            if (
              start === null ||
              end === undefined ||
              Math.abs(end - start) < 50
            )
              return;
            const towardNext = end < start ? 1 : -1;
            go(rtl ? -towardNext : towardNext);
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 text-white outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 lg:flex-row lg:gap-10"
        >
          {item && (
            <>
              <DialogPrimitive.Title className="sr-only">
                {t("dialogTitle", { name: item.authorName })}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                {t("counter", {
                  current: (index ?? 0) + 1,
                  total: items.length,
                })}
              </DialogPrimitive.Description>

              <div className="relative aspect-9/16 h-[min(74vh,720px)] max-w-full overflow-hidden rounded-md bg-black shadow-2xl lg:h-[min(86vh,760px)]">
                {item.tiktokId && (
                  <iframe
                    key={item.id}
                    src={`https://www.tiktok.com/player/v1/${encodeURIComponent(item.tiktokId)}?${params}`}
                    title={t("dialogTitle", { name: item.authorName })}
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="size-full"
                  />
                )}
              </div>

              <div className="w-full max-w-[420px] text-center lg:max-w-[340px] lg:text-start">
                <p className="mb-1 text-xs tracking-[0.16em] text-white/60 uppercase tabular-nums">
                  {t("counter", {
                    current: (index ?? 0) + 1,
                    total: items.length,
                  })}
                </p>
                <p className="font-serif text-xl">{item.authorName}</p>
                {item.authorCity && (
                  <p className="text-sm text-white/70">{item.authorCity}</p>
                )}
                {item.quote[locale] && (
                  <p className="mt-3 hidden font-serif text-lg leading-relaxed text-white/90 lg:block">
                    « {item.quote[locale]} »
                  </p>
                )}
                <div className="mt-4 flex items-center justify-center gap-3 lg:mt-6 lg:justify-start">
                  <LightboxButton
                    label={t("previous")}
                    disabled={!hasPrev}
                    onClick={() => go(-1)}
                    icon={rtl ? ChevronRight : ChevronLeft}
                  />
                  <LightboxButton
                    label={t("next")}
                    disabled={!hasNext}
                    onClick={() => go(1)}
                    icon={rtl ? ChevronLeft : ChevronRight}
                  />
                </div>
              </div>

              <DialogPrimitive.Close
                aria-label={t("close")}
                className="absolute end-4 top-4 grid size-11 place-items-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/25"
              >
                <X className="size-5" strokeWidth={1.8} />
              </DialogPrimitive.Close>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function LightboxButton({
  label,
  disabled,
  onClick,
  icon: Icon,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  icon: typeof ChevronLeft;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-full border border-white/25 bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30"
    >
      <Icon className="size-5" strokeWidth={1.8} />
    </button>
  );
}

export { TikTokShowcase };
