import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildFooterColumns } from "@/lib/footer-columns";
import { LegalPageLayout, type LegalSection } from "@/features/legal/components/legal-page-layout";

const WHATSAPP_URL = "https://wa.me/221770000000";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.terms");
  return { title: t("metaTitle") };
}

export default async function TermsPage() {
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations("legal.terms"),
    getTranslations("nav"),
    getTranslations("common"),
  ]);

  const navItems = [
    { label: tNav("home"), href: "/" },
    { label: tNav("formations"), href: "/formations" },
    { label: tNav("testimonials"), href: "/temoignages" },
    { label: tNav("contact"), href: "/contact" },
  ];

  const footerColumns = buildFooterColumns(
    tCommon.raw("footer.columns") as { title: string; items: string[] }[],
  );

  return (
    <LegalPageLayout
      navItems={navItems}
      loginLabel={tNav("login")}
      signupLabel={tNav("signup")}
      footerColumns={footerColumns}
      whatsappHref={WHATSAPP_URL}
      whatsappLabel={tCommon("footer.whatsappNumber")}
      copyright={tCommon("footer.copyright")}
      paymentNote={tCommon("footer.paymentNote")}
      eyebrow={t("eyebrow")}
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      sections={t.raw("sections") as LegalSection[]}
    />
  );
}
