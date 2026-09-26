import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/types";
import { formatPrice, formatTotalDuration } from "@/lib/format";
import { getCourse } from "@/features/catalog/api/get-course";
import { getProfileOptional } from "@/features/account/api/get-profile";

import { CheckoutHeader } from "@/features/checkout/components/checkout-header";
import { WaveAccountCard } from "@/features/checkout/components/wave-account-card";
import { HowItWorksCard } from "@/features/checkout/components/how-it-works-card";
import { OrderSummaryCard } from "@/features/checkout/components/order-summary-card";
import { CheckoutStickyCta } from "@/features/checkout/components/checkout-sticky-cta";
import { CountdownTimer } from "@/features/checkout/components/countdown-timer";
import { CheckoutFaq } from "@/features/checkout/components/checkout-faq";
import { CartNotificationWrapper } from "@/features/checkout/components/cart-notification-wrapper";
import { CartSaver } from "@/features/checkout/components/cart-saver";
import { LevelBadge } from "@/components/patterns/level-badge";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { Button } from "@/components/ui/button";
import { User, LogOut, Shield } from "lucide-react";
import { logout } from "@/features/auth/api/logout";
import { WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Vérifiez votre commande — Mouslih Academy",
};

interface OrderPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function OrderSummaryPage({ params }: OrderPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;

  const [t, tCatalog, tCourse, course, profile] = await Promise.all([
    getTranslations("checkout"),
    getTranslations("catalog"),
    getTranslations("course"),
    getCourse(slug),
    getProfileOptional(),
  ]);

  if (!course) notFound();

  const subtotalXof = course.compareAtPriceXof ?? course.priceXof;
  const discountXof = subtotalXof - course.priceXof;
  const payHref = `/commande/${course.slug}/wave`;
  const isAuthenticated = profile !== null;

  return (
    <div className="pb-28 lg:pb-0">
      <CartSaver courseSlug={course.slug} courseTitle={course.title[locale]} />
      <CartNotificationWrapper currentSlug={course.slug} />
      <CheckoutHeader
        steps={[
          { label: t("steps.summary"), state: "active" },
          { label: t("steps.payment"), state: "upcoming" },
          { label: t("steps.unlocked"), state: "upcoming" },
        ]}
        cancelLabel={t("cancel")}
        cancelHref={`/formations/${course.slug}`}
        userInitials={
          profile
            ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
            : undefined
        }
      />

      <div className="px-5 py-6 sm:px-6 lg:px-11 lg:py-11">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
            <span>{t("steps.summary")}</span>
            <span className="text-green-700">1/3</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-subtle">
            <div className="h-full w-1/3 rounded-full bg-green-700 transition-all duration-500" />
          </div>
        </div>

        <h1 className="mb-2 font-serif text-[26px] font-medium tracking-[-0.01em] lg:text-[38px]">
          {t("summary.title")}
        </h1>
        <p className="mb-4 text-sm text-text-muted lg:mb-6 lg:text-base">
          {t("summary.subtitle")}
        </p>

        {/* Countdown timer for urgency */}
        <div className="mb-6">
          <CountdownTimer
            hours={23}
            minutes={59}
            label={t("countdown.label")}
          />
        </div>

        {/* Continue as section for logged-in users */}
        {isAuthenticated && profile && (
          <div className="mb-6 flex items-center justify-between rounded-sm border border-border-subtle bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-800 text-white">
                <User className="size-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xs text-text-muted">
                  {t("summary.loggedInAs")}
                </p>
                <p className="text-sm font-semibold text-text-soft">
                  {profile.firstName} {profile.lastName}
                </p>
              </div>
            </div>
            <form action={logout.bind(null, locale)}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-text-muted hover:text-text-soft"
              >
                <LogOut className="me-1.5 size-3.5" strokeWidth={2} />
                {t("summary.changeAccount")}
              </Button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] lg:gap-8.5">
          <div className="flex flex-col gap-5.5">
            <div className="border border-border-subtle bg-surface p-6.5 lg:p-7">
              <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
                {t("summary.courseCardTitle")}
              </p>
              <div className="flex gap-5">
                <div className="relative hidden aspect-16/11 w-37.5 shrink-0 overflow-hidden bg-green-800 sm:block">
                  {course.coverUrl ? (
                    <Image
                      src={course.coverUrl}
                      alt=""
                      fill
                      sizes="150px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <GeometricPattern variant="treillis" opacity={0.5} />
                  )}
                </div>
                <div className="flex-1">
                  <LevelBadge
                    level={course.level}
                    label={tCatalog(`levels.${course.level}`)}
                    className="mb-2.5"
                  />
                  <h2 className="mb-2 font-serif text-xl font-semibold lg:text-2xl">
                    {course.title[locale]}
                  </h2>
                  <p className="mb-3.5 text-sm text-text-muted">
                    {tCourse("meta.lessonsVideo", {
                      count: course.lessonCount,
                    })}{" "}
                    · {formatTotalDuration(course.totalDurationSeconds)}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1.5 text-[13px] text-text-soft">
                      <Check
                        className="size-4 text-success"
                        strokeWidth={1.8}
                      />
                      {t("summary.lifetimeAccess")}
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] text-text-soft">
                      <Check
                        className="size-4 text-success"
                        strokeWidth={1.8}
                      />
                      {t("summary.pdfIncluded")}
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] text-text-soft">
                      <Check
                        className="size-4 text-success"
                        strokeWidth={1.8}
                      />
                      {t("summary.finalCertificate")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <WaveAccountCard
              title={t("summary.accountCardTitle")}
              phoneLabel={t("summary.phoneLabel")}
              initialPhone={profile?.phone ?? ""}
              useOtherNumberLabel={t("summary.useOtherNumber")}
              helpText={t("summary.phoneHelp")}
            />

            <HowItWorksCard
              title={t("summary.howItWorksTitle")}
              steps={[
                t("summary.step1"),
                t("summary.step2", {
                  amount: formatPrice(course.priceXof, locale),
                }),
                t("summary.step3"),
                t("summary.step4"),
              ]}
            />

            <CheckoutFaq
              title={t("faq.title")}
              items={
                t.raw("faq.items") as { question: string; answer: string }[]
              }
            />
          </div>

          <OrderSummaryCard
            summaryTitle={t("summary.summaryTitle")}
            subtotalLabel={t("summary.subtotal")}
            subtotal={formatPrice(subtotalXof, locale)}
            discountLabel={t("summary.discount")}
            discount={discountXof > 0 ? formatPrice(discountXof, locale) : null}
            waveFeeLabel={t("summary.waveFee")}
            waveFee={formatPrice(0, locale)}
            totalLabel={t("summary.total")}
            total={formatPrice(course.priceXof, locale)}
            paymentUniqueLabel={t("summary.paymentUnique")}
            payButtonLabel={t("summary.payButton")}
            payHref={payHref}
            secureTransactionLabel={t("summary.secureTransaction")}
            refundNoteLabel={t("summary.refundNote")}
            questionLabel={t("summary.questionBeforePaying")}
            whatsappHref={WHATSAPP_URL}
          />

          {/* Preuve sociale — uniquement affichée si des ventes réelles existent (voir
              CoursesService.findBySlug) : pas de chiffre inventé. */}
          {!!course.recentPurchasesCount && course.recentPurchasesCount > 0 && (
            <div className="rounded-sm border border-border-subtle bg-surface p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                {t("socialProof.trending")}
              </div>
              <p className="text-sm text-text-soft">
                {t("socialProof.purchases", {
                  count: course.recentPurchasesCount,
                })}
              </p>
            </div>
          )}

          {/* Guarantee badge — même politique (7 jours) que refundNote ci-dessus et la page
              légale /politique-remboursement, pour ne pas afficher deux durées différentes. */}
          <div className="rounded-sm border border-success-border bg-success-bg p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-800 text-white">
                <Shield className="size-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-whatsapp-hover">
                  {t("guarantee.title")}
                </p>
                <p className="text-xs text-whatsapp-muted">
                  {t("guarantee.body")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutStickyCta
        payHref={payHref}
        totalLabel={t("summary.totalMobile")}
        total={formatPrice(course.priceXof, locale)}
        payButtonLabel={t("summary.payButton")}
      />
    </div>
  );
}
