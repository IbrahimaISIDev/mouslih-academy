import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildFooterColumns } from "@/lib/footer-columns";
import {
  LegalPageLayout,
  type LegalSection,
} from "@/features/legal/components/legal-page-layout";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.privacy");
  return { title: t("metaTitle") };
}

export default async function PrivacyPolicyPage() {
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations("legal.privacy"),
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
      whatsappLabel={WHATSAPP_DISPLAY}
      copyright={tCommon("footer.copyright")}
      paymentNote={tCommon("footer.paymentNote")}
      eyebrow={t("eyebrow")}
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      sections={t.raw("sections") as LegalSection[]}
    />
  );
}
