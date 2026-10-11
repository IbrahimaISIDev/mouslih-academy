import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SocialNetwork } from "@/lib/social";
import { SocialIcon } from "@/components/layout/social-icon";
import { Logo } from "@/components/layout/logo";
import { WhatsAppButton } from "@/components/patterns/whatsapp-button";

export interface FooterColumn {
  title: string;
  links: {
    label: string;
    href: string;
    /** Lien vers un site tiers (réseau social) : nouvel onglet, avec son pictogramme. */
    social?: SocialNetwork;
  }[];
}

export interface FooterProps {
  columns: FooterColumn[];
  whatsappHref: string;
  whatsappLabel: string;
  copyright: string;
  paymentNote: string;
  wordmark?: string;
}

const LEGAL_HREFS = [
  "/conditions-utilisation",
  "/politique-remboursement",
  "/confidentialite",
];

function Footer({
  columns,
  whatsappHref,
  whatsappLabel,
  copyright,
  paymentNote,
  wordmark,
}: FooterProps) {
  const t = useTranslations("common.footer");
  const legalLinks = (t.raw("legalLinks") as string[]).map((label, i) => ({
    label,
    href: LEGAL_HREFS[i] ?? "/",
  }));

  return (
    <footer className="bg-green-900 text-on-dark-muted">
      <div className="grid grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4 lg:px-11">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
          <Logo wordmark={wordmark} variant="dark" />
          <WhatsAppButton
            href={whatsappHref}
            label={whatsappLabel}
            size="sm"
            className="w-fit"
          />
        </div>

        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-[0.06em] text-on-dark uppercase">
              {column.title}
            </p>
            {column.links.map((link) =>
              link.social ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2.5 rounded-sm text-sm outline-none text-on-dark-muted transition-colors hover:text-on-dark focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring-on-dark)]"
                >
                  <SocialIcon
                    network={link.social}
                    className="size-4 shrink-0"
                  />
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit rounded-sm text-sm outline-none text-on-dark-muted transition-colors hover:text-on-dark focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring-on-dark)]"
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 px-6 py-5 text-xs sm:flex-row lg:px-11">
        <p>{copyright}</p>
        {/* Pages légales : retirées des colonnes, mais toujours accessibles depuis chaque page. */}
        <nav
          aria-label={t("legalNavLabel")}
          className="flex flex-wrap justify-center gap-x-4 gap-y-1"
        >
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm outline-none text-on-dark-muted transition-colors hover:text-on-dark focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring-on-dark)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p>{paymentNote}</p>
      </div>
    </footer>
  );
}

export { Footer };
