"use client";

import { Suspense } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { isRtl } from "@/lib/rtl";

const LOCALE_LABELS: Record<
  (typeof routing.locales)[number],
  { short: string; full: string; fontClassName: string }
> = {
  fr: { short: "FR", full: "Français", fontClassName: "font-sans" },
  en: { short: "EN", full: "English", fontClassName: "font-sans" },
  ar: { short: "ع", full: "العربية", fontClassName: "font-arabic-sans" },
};

export interface LanguageSwitcherProps {
  variant?: "segmented" | "compact";
  /** "onDark" : bordures et texte adaptés à un fond sombre (sidebar admin green-900). */
  tone?: "default" | "onDark";
  className?: string;
}

/**
 * `useSearchParams` force Next.js à traiter tout consommateur comme suspendu pendant le
 * rendu statique ; on isole donc la logique dans un enfant, avec un repli de même gabarit
 * pour que la frontière Suspense ne provoque aucun saut de mise en page.
 */
function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense fallback={<LanguageSwitcherFallback {...props} />}>
      <LanguageSwitcherContent {...props} />
    </Suspense>
  );
}

function LanguageSwitcherFallback({
  variant = "segmented",
  tone = "default",
  className,
}: LanguageSwitcherProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm text-text-soft",
          className,
        )}
      >
        <Globe className="size-[18px]" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-full border p-0.5",
        tone === "onDark" ? "border-white/20" : "border-border-subtle",
        className,
      )}
    >
      {routing.locales.map((loc) => (
        <span
          key={loc}
          className={cn("rounded-full px-3 py-1.5 text-[13px] font-semibold", LOCALE_LABELS[loc].fontClassName)}
        >
          {LOCALE_LABELS[loc].short}
        </span>
      ))}
    </div>
  );
}

function LanguageSwitcherContent({
  variant = "segmented",
  tone = "default",
  className,
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Le sélecteur change la locale sans perdre ni le chemin, ni les paramètres d'URL en cours
  // (filtre catalogue, page admin, etc.) : `usePathname` de next-intl ignore la query string.
  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm text-text-soft outline-none",
            className,
          )}
        >
          <Globe className="size-[18px]" strokeWidth={1.5} />
          <span className={LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS].fontClassName}>
            {LOCALE_LABELS[locale as keyof typeof LOCALE_LABELS].short}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {routing.locales.map((loc) => (
            <DropdownMenuItem key={loc} asChild data-active={loc === locale}>
              <Link href={href} locale={loc} className={LOCALE_LABELS[loc].fontClassName}>
                {LOCALE_LABELS[loc].full}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const activeIndex = routing.locales.indexOf(locale as (typeof routing.locales)[number]);
  // translateX(n * 100%) déplace la pastille de n fois SA PROPRE largeur (donc directement de
  // 1/nombre-de-langues du conteneur), quel que soit le nombre de langues. En RTL, "start" (où
  // la pastille est ancrée) correspond au bord physique droit : avancer vers la langue suivante
  // doit donc translater vers la gauche, d'où le signe inversé.
  const direction = isRtl(locale) ? -1 : 1;

  return (
    <div
      className={cn(
        "relative inline-grid items-center overflow-hidden rounded-full border p-0.5",
        tone === "onDark" ? "border-white/20" : "border-border-subtle",
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${routing.locales.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0.5 start-0.5 rounded-full bg-green-700 shadow-sm motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out"
        style={{
          width: `calc((100% - 4px) / ${routing.locales.length})`,
          transform: `translateX(${direction * activeIndex * 100}%)`,
        }}
      />
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={href}
          locale={loc}
          className={cn(
            "relative z-10 rounded-full px-3 py-1.5 text-center text-[13px] font-semibold transition-colors motion-safe:active:scale-95",
            LOCALE_LABELS[loc].fontClassName,
            loc === locale
              ? "text-green-ink"
              : tone === "onDark"
                ? "text-on-dark-muted hover:text-on-dark"
                : "text-text-muted hover:text-text",
          )}
        >
          {LOCALE_LABELS[loc].short}
        </Link>
      ))}
    </div>
  );
}

export { LanguageSwitcher };
