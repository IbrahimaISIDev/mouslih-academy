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
        "inline-flex items-center overflow-hidden rounded-sm border",
        tone === "onDark" ? "border-white/20" : "border-border-subtle",
        className,
      )}
    >
      {routing.locales.map((loc) => (
        <span key={loc} className={cn("px-3 py-1.5 text-[13px] font-semibold", LOCALE_LABELS[loc].fontClassName)}>
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

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-sm border",
        tone === "onDark" ? "border-white/20" : "border-border-subtle",
        className,
      )}
    >
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={href}
          locale={loc}
          className={cn(
            "px-3 py-1.5 text-[13px] font-semibold transition-colors",
            LOCALE_LABELS[loc].fontClassName,
            loc === locale
              ? "bg-green-700 text-green-ink"
              : tone === "onDark"
                ? "text-on-dark-muted hover:bg-white/10"
                : "text-text-muted hover:bg-hairline",
          )}
        >
          {LOCALE_LABELS[loc].short}
        </Link>
      ))}
    </div>
  );
}

export { LanguageSwitcher };
