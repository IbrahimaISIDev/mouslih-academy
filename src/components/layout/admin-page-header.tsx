import type { ReactNode } from "react";
import { ChevronRight, ExternalLink, LogOut } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { logout } from "@/features/auth/api/logout";
import type { Locale } from "@/lib/types";

export interface AdminPageHeaderProps {
  locale: Locale;
  title: string;
  subtitle?: ReactNode;
  /** Boutons d'action de la page (export, nouveau…), alignés à droite du titre. */
  actions?: ReactNode;
  /** Étape intermédiaire du fil d'Ariane (ex. « Formations » sur l'éditeur d'une formation). */
  parent?: { label: string; href: string };
}

/**
 * En-tête commun à toutes les pages de l'admin : barre supérieure collante (fil d'Ariane, date,
 * accès au site, déconnexion) puis titre, sous-titre et actions de la page.
 */
async function AdminPageHeader({
  locale,
  title,
  subtitle,
  actions,
  parent,
}: AdminPageHeaderProps) {
  const t = await getTranslations({ locale, namespace: "admin.header" });
  const today = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <>
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between gap-6 border-b border-border-subtle bg-surface/92 px-8.5 backdrop-blur-md">
        <nav
          aria-label={t("breadcrumb")}
          className="flex min-w-0 items-center gap-1.5 text-sm"
        >
          <Link href="/admin" className="text-text-muted hover:text-text">
            {t("root")}
          </Link>
          {parent && (
            <>
              <ChevronRight className="size-3.5 shrink-0 text-text-faint rtl:scale-x-[-1]" />
              <Link
                href={parent.href}
                className="text-text-muted hover:text-text"
              >
                {parent.label}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5 shrink-0 text-text-faint rtl:scale-x-[-1]" />
          <span
            aria-current="page"
            className="truncate font-semibold text-text"
          >
            {title}
          </span>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <span className="me-2 hidden text-sm text-text-muted first-letter:uppercase xl:inline">
            {today}
          </span>
          <a
            href={`/${locale}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border-strong px-3 py-2 text-[13px] font-semibold text-text-soft transition-colors hover:bg-row-hover"
          >
            <ExternalLink className="size-3.5" strokeWidth={1.8} />
            {t("viewSite")}
          </a>
          <form action={logout.bind(null, locale, "admin/connexion")}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-[13px] font-semibold text-text-muted transition-colors hover:bg-row-hover hover:text-error"
            >
              <LogOut className="size-3.5 rtl:scale-x-[-1]" strokeWidth={1.8} />
              {t("logout")}
            </button>
          </form>
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 px-8.5 pt-7 pb-6">
        <div className="min-w-0">
          <h1 className="font-serif text-[30px] leading-tight font-medium">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-[15px] text-text-muted">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2.5">{actions}</div>
        )}
      </div>
    </>
  );
}

export { AdminPageHeader };
