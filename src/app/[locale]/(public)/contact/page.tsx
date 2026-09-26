import type { Metadata } from "next";
import {
  BookOpen,
  Clock,
  MapPin,
  MessageCircle,
  MessageCircleQuestion,
  Mic,
  Smartphone,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { buildFooterColumns } from "@/lib/footer-columns";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { SectionEyebrow } from "@/components/patterns/section-eyebrow";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = { title: "Contact — Mouslih Academy" };

const REASON_KEYS = ["course", "payment", "correction", "other"] as const;
const REASON_ICONS = {
  course: BookOpen,
  payment: Smartphone,
  correction: Mic,
  other: MessageCircleQuestion,
};

export default async function ContactPage() {
  const [t, tNav, tCommon] = await Promise.all([
    getTranslations("contact"),
    getTranslations("nav"),
    getTranslations("common"),
  ]);

  const navItems = [
    { label: tNav("home"), href: "/" },
    { label: tNav("formations"), href: "/formations" },
    { label: tNav("testimonials"), href: "/temoignages" },
    { label: tNav("contact"), href: "/contact", active: true },
  ];

  const footerColumns = buildFooterColumns(
    tCommon.raw("footer.columns") as { title: string; items: string[] }[],
  );

  return (
    <div className="pb-24 lg:pb-0">
      <PublicHeader
        navItems={navItems}
        loginLabel={tNav("login")}
        loginHref="/connexion"
        signupLabel={tNav("signup")}
        signupHref="/inscription"
      />

      <section className="relative overflow-hidden bg-green-900 text-on-dark">
        <GeometricPattern variant="khatam" opacity={0.32} />
        <div className="relative mx-auto max-w-[720px] px-5 py-14 text-center sm:px-6 lg:px-11 lg:py-20">
          <SectionEyebrow className="mb-3.5 lg:mb-4">
            {t("eyebrow")}
          </SectionEyebrow>
          <h1 className="mb-4 font-serif text-[28px] leading-[1.2] font-medium tracking-[-0.01em] lg:text-[42px] lg:leading-[1.15]">
            {t("title")}
          </h1>
          <p className="mx-auto mb-8 max-w-[54ch] text-[15px] leading-[1.65] text-on-dark-muted lg:text-lg">
            {t("description")}
          </p>
          <Button variant="whatsapp" size="lg" asChild>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-[18px]" strokeWidth={1.8} />
              {t("primaryCta")}
            </a>
          </Button>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-11 lg:py-16">
        <h2 className="mb-6 text-center font-serif text-2xl font-medium lg:mb-8 lg:text-[30px]">
          {t("reasonsTitle")}
        </h2>
        <div className="mx-auto grid max-w-[920px] grid-cols-1 gap-4 sm:grid-cols-2">
          {REASON_KEYS.map((key) => {
            const Icon = REASON_ICONS[key];
            const message = t(`reasons.${key}.message`);
            const href = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-sm border border-border-subtle bg-surface p-5 transition-colors hover:border-green-700"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-sm bg-green-100 text-green-ink">
                  <Icon className="size-5" strokeWidth={1.6} />
                </div>
                <span className="flex-1 text-[15px] font-medium text-text">
                  {t(`reasons.${key}.label`)}
                </span>
                <MessageCircle
                  className="size-[18px] shrink-0 text-text-faint transition-colors group-hover:text-green-ink"
                  strokeWidth={1.6}
                />
              </a>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border-subtle bg-bg px-5 py-10 sm:px-6 lg:px-11">
        <div className="mx-auto flex max-w-[720px] flex-col gap-5 sm:flex-row sm:gap-10">
          <p className="text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase sm:hidden">
            {t("infoTitle")}
          </p>
          <div className="flex flex-1 gap-3">
            <Clock
              className="mt-0.5 size-[18px] shrink-0 text-green-ink"
              strokeWidth={1.6}
            />
            <p className="text-[15px] leading-[1.6] text-text-soft">
              {t("infoHours")}
            </p>
          </div>
          <div className="flex flex-1 gap-3">
            <MapPin
              className="mt-0.5 size-[18px] shrink-0 text-green-ink"
              strokeWidth={1.6}
            />
            <p className="text-[15px] leading-[1.6] text-text-soft">
              {t("infoLocation")}
            </p>
          </div>
        </div>
      </section>

      <Footer
        columns={footerColumns}
        whatsappHref={WHATSAPP_URL}
        whatsappLabel={WHATSAPP_DISPLAY}
        copyright={tCommon("footer.copyright")}
        paymentNote={tCommon("footer.paymentNote")}
      />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-bg/82 px-4 py-3 backdrop-blur-md lg:hidden">
        <Button variant="whatsapp" className="w-full" asChild>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" strokeWidth={1.8} />
            {t("mobileCta")}
          </a>
        </Button>
      </div>
    </div>
  );
}
