import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { getCourses } from "@/features/catalog/api/get-courses";
import { buildFooterColumns } from "@/lib/footer-columns";
import { CatalogBrowser } from "@/features/catalog/components/catalog-browser";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";

const WHATSAPP_URL = "https://wa.me/221771542311";

interface CataloguePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; level?: string }>;
}

export async function generateMetadata({ params }: CataloguePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return { title: `${t("title")} — Mouslih Academy`, description: t("description") };
}

const LEVEL_VALUES = ["all", "beginner", "intermediate", "advanced"] as const;

export default async function CataloguePage({
  params,
  searchParams,
}: CataloguePageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const { q, level } = await searchParams;
  const initialQuery = q ?? "";
  const initialLevel = LEVEL_VALUES.includes(
    level as (typeof LEVEL_VALUES)[number],
  )
    ? (level as (typeof LEVEL_VALUES)[number])
    : "all";

  const [tNav, tCommon, tCatalog, courses] = await Promise.all([
    getTranslations("nav"),
    getTranslations("common"),
    getTranslations("catalog"),
    getCourses(),
  ]);

  const navItems = [
    { label: tNav("home"), href: "/" },
    { label: tNav("formations"), href: "/formations", active: true },
    { label: tNav("testimonials"), href: "/temoignages" },
    { label: tNav("contact"), href: "/contact" },
  ];

  const footerColumns = buildFooterColumns(
    tCommon.raw("footer.columns") as { title: string; items: string[] }[],
  );

  return (
    <div className="pb-20 lg:pb-0">
      <PublicHeader
        navItems={navItems}
        loginLabel={tNav("login")}
        loginHref="/connexion"
        signupLabel={tNav("signup")}
        signupHref="/inscription"
      />

      <CatalogBrowser
        courses={courses}
        locale={locale}
        initialQuery={initialQuery}
        initialLevel={initialLevel}
      />

      <Footer
        columns={footerColumns}
        whatsappHref={WHATSAPP_URL}
        whatsappLabel={tCommon("footer.whatsappNumber")}
        copyright={tCommon("footer.copyright")}
        paymentNote={tCommon("footer.paymentNote")}
      />

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2.5 border-t border-border-subtle bg-whatsapp px-4 py-4 text-[15px] font-semibold text-white backdrop-blur-md lg:hidden"
      >
        <MessageCircle className="size-[17px]" strokeWidth={1.8} />
        {tCatalog("stickyCta")}
      </a>
    </div>
  );
}
