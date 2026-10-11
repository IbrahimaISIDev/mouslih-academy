import {
  ArrowRight,
  Dumbbell,
  GraduationCap,
  MessageCircle,
  Play,
  Shield,
  Video,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { formatPrice, formatTotalDuration, localizeDigits } from "@/lib/format";
import { buildFooterColumns } from "@/lib/footer-columns";
import { getCourses } from "@/features/catalog/api/get-courses";
import { getPublicStats } from "@/features/catalog/api/get-public-stats";
import { getTestimonials } from "@/features/catalog/api/get-testimonials";

import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { YouTubeFacade } from "@/components/patterns/youtube-facade";
import { StickyCta } from "@/components/patterns/sticky-cta";
import { TestimonialCard } from "@/components/patterns/testimonial-card";
import { DirectionalIcon } from "@/components/patterns/directional-icon";
import { AnimatedCounter } from "@/components/patterns/animated-counter";
import { VideoProgramme } from "@/features/catalog/components/video-programme";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

// Page pré-rendue statiquement (generateStaticParams) : sans revalidation, le nombre réel
// d'apprenants et de formations resterait figé à sa valeur au moment du build.
export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const HOME_TESTIMONIAL_IDS = [
    "t-aminata-diallo",
    "t-ibrahima-sarr",
    "t-fatou-ndiaye",
  ];

  const [t, tNav, tCommon, tCourse, featured, allTestimonials, publicStats] =
    await Promise.all([
      getTranslations("home"),
      getTranslations("nav"),
      getTranslations("common"),
      getTranslations("course"),
      getCourses({ featured: true }),
      getTestimonials(),
      getPublicStats(),
    ]);

  // Formation mise en avant : « Rectifiez votre Fâtiḥah » (seule formation publiée depuis le
  // 2026-10-10). Toute la page s'articule autour d'elle.
  const course = featured[0];
  const courseHref = course ? `/formations/${course.slug}` : "/formations";
  const programmeHref = `${courseHref}#programme`;
  const lessons =
    course?.modules.flatMap((m) => m.subModules.flatMap((sm) => sm.lessons)) ??
    [];
  const mistakeCount = lessons.reduce((n, l) => n + l.mistakes.length, 0);

  const testimonials = HOME_TESTIMONIAL_IDS.map((id) =>
    allTestimonials.find((testimonial) => testimonial.id === id),
  ).filter(
    (testimonial): testimonial is (typeof allTestimonials)[number] =>
      !!testimonial,
  );

  const navItems = [
    { label: tNav("home"), href: "/", active: true },
    { label: tNav("formations"), href: "/formations" },
    { label: tNav("testimonials"), href: "/temoignages" },
    { label: tNav("contact"), href: "/contact" },
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-green-900 text-on-dark">
        <GeometricPattern variant="khatam" opacity={0.42} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-green-900)_30%,rgba(12,36,29,0.55)_100%)]" />
        <div className="relative grid gap-10 px-5 py-9 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:px-11 lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-gold-600/50 px-3 py-1.5 text-xs tracking-[0.12em] text-gold-200 uppercase lg:mb-6">
              <Shield className="size-[13px]" strokeWidth={1.8} />
              {t("hero.badge")}
            </div>
            <h1 className="mb-3.5 font-serif text-[32px] leading-[1.12] font-medium lg:mb-5 lg:text-[54px] lg:leading-[1.08] lg:tracking-[-0.015em]">
              {t("hero.title")}
            </h1>
            <p className="mb-6 max-w-[46ch] text-[15px] leading-[1.65] text-on-dark-muted lg:mb-8 lg:text-[18px]">
              <span className="lg:hidden">{t("hero.descriptionMobile")}</span>
              <span className="hidden lg:inline">{t("hero.description")}</span>
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <Button
                variant="gold"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href={courseHref}>{t("hero.ctaPrimary")}</Link>
              </Button>
              <Link
                href={programmeHref}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-on-dark/40 px-6 py-4 text-[16px] font-semibold transition-colors hover:bg-white/8 sm:w-auto"
              >
                <Play
                  className="size-4"
                  strokeWidth={1.6}
                  fill="currentColor"
                />
                {t("hero.ctaSecondary")}
              </Link>
            </div>
            <div className="mt-8 flex gap-6 border-t border-green-300/25 pt-4.5 lg:mt-11 lg:gap-10 lg:border-t-0 lg:pt-0">
              <div>
                <AnimatedCounter
                  value={publicStats.learnersCount}
                  locale={locale}
                  className="font-serif text-xl lg:text-[27px]"
                />
                <div className="mt-0.5 text-[11px] text-green-300 lg:text-[13px]">
                  <span className="lg:hidden">
                    {t("hero.statLearnersLabelMobile")}
                  </span>
                  <span className="hidden lg:inline">
                    {t("hero.statLearnersLabel")}
                  </span>
                </div>
              </div>
              <div>
                <AnimatedCounter
                  value={mistakeCount}
                  locale={locale}
                  className="font-serif text-xl lg:text-[27px]"
                />
                <div className="mt-0.5 text-[11px] text-green-300 lg:text-[13px]">
                  <span className="lg:hidden">
                    {t("hero.statMistakesLabelMobile")}
                  </span>
                  <span className="hidden lg:inline">
                    {t("hero.statMistakesLabel")}
                  </span>
                </div>
              </div>
              <div>
                <div className="font-serif text-xl lg:text-[27px]">
                  {t("hero.statPaymentValue")}
                </div>
                <div className="mt-0.5 text-[11px] text-green-300 lg:text-[13px]">
                  <span className="lg:hidden">
                    {t("hero.statPaymentLabelMobile")}
                  </span>
                  <span className="hidden lg:inline">
                    {t("hero.statPaymentLabel")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden border border-gold-600/35 bg-white/4 p-5.5 lg:block">
            <div className="relative aspect-2/3 overflow-hidden border border-green-300/25 bg-green-800">
              <Image
                src="/images/team/teacher-portrait.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 420px, 0px"
                className="object-cover object-top"
              />
            </div>
            <div className="mt-4.5 font-serif text-lg">
              {t("hero.teacherName")}
            </div>
            <div className="mt-1 text-[13px] text-green-300">
              {t("hero.teacherCredentials")}
            </div>
          </div>
        </div>
      </section>

      {/* Vidéo de présentation, puis présentation de la formation juste en dessous */}
      <section className="border-b border-border-subtle bg-bg px-5 py-9 sm:px-6 lg:px-11 lg:py-18">
        <div className="mx-auto max-w-[960px]">
          <p className="mb-4 text-center text-[11px] font-semibold tracking-[0.18em] text-gold-600 uppercase lg:mb-5 lg:text-xs">
            {t("video.eyebrow")}
          </p>
          <YouTubeFacade
            videoId="ku1romHwGCM"
            title={t("video.title")}
            caption={t("video.caption")}
            className="group relative grid aspect-video w-full place-items-center overflow-hidden border border-border-strong bg-green-800"
          />

          <div className="mx-auto mt-8 max-w-[720px] text-center lg:mt-11">
            <h2 className="font-serif text-[30px] leading-[1.15] font-medium tracking-[-0.01em] lg:text-[44px]">
              {course?.title[locale] ?? t("video.title")}
            </h2>
            <p className="mt-2.5 font-serif text-lg text-green-ink lg:mt-3 lg:text-[22px]">
              {localizeDigits(t("video.subtitle"), locale)}
            </p>
            <p className="mx-auto mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-text-soft lg:mt-5 lg:text-[17px]">
              {t("video.description")}
            </p>

            <ul className="mt-6 flex flex-wrap justify-center gap-2.5 lg:mt-7">
              {[
                { icon: Video, label: t("video.features.recorded") },
                { icon: Dumbbell, label: t("video.features.exercises") },
                { icon: GraduationCap, label: t("video.features.beginners") },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-sm border border-border-subtle bg-surface px-3.5 py-2 text-sm text-text-soft"
                >
                  <Icon
                    className="size-4 shrink-0 text-green-ink"
                    strokeWidth={1.7}
                  />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row lg:mt-8">
              <Button size="lg" asChild>
                <Link href={courseHref}>{t("video.ctaPrimary")}</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href={programmeHref}>
                  <Play
                    className="size-4"
                    strokeWidth={1.6}
                    fill="currentColor"
                  />
                  {t("video.ctaSecondary")}
                </Link>
              </Button>
            </div>
            {course && (
              <p className="mt-3.5 text-[13px] text-text-muted">
                {localizeDigits(
                  t("video.priceNote", {
                    price: formatPrice(course.priceXof, locale),
                  }),
                  locale,
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Le programme : les 5 vidéos */}
      {course && lessons.length > 0 && (
        <section className="bg-surface px-5 py-9 sm:px-6 lg:px-11 lg:py-16">
          <div className="mx-auto max-w-[960px]">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 lg:mb-7">
              <div>
                <p className="mb-2.5 text-[11px] font-semibold tracking-[0.18em] text-gold-600 uppercase lg:mb-3 lg:text-xs">
                  {t("programme.eyebrow")}
                </p>
                <h2 className="font-serif text-2xl font-medium lg:text-[34px]">
                  {localizeDigits(
                    t("programme.title", {
                      videos: lessons.length,
                      mistakes: mistakeCount,
                    }),
                    locale,
                  )}
                </h2>
              </div>
              <span className="text-sm text-text-muted">
                {localizeDigits(
                  t("programme.meta", {
                    duration: formatTotalDuration(course.totalDurationSeconds, locale),
                  }),
                  locale,
                )}
              </span>
            </div>
            <VideoProgramme
              lessons={lessons}
              courseSlug={course.slug}
              locale={locale}
              isPurchased={false}
              variant="compact"
              labels={{
                videoNumber: tCourse.raw("programme.videoNumber") as string,
                free: tCourse("programme.free"),
                watchFree: tCourse("programme.watchFree"),
                watch: tCourse("programme.watch"),
                locked: tCourse("programme.locked"),
                objective: tCourse("programme.objective"),
                previewCaption: tCourse("purchaseCard.previewCaption"),
                learnTitle: tCourse("programme.learnTitle"),
                passageLabel: tCourse("programme.passageLabel"),
              }}
            />
            <div className="mt-6 text-center">
              <Link
                href={courseHref}
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-green-ink hover:underline"
              >
                {t("programme.seeDetails")}
                <DirectionalIcon
                  icon={ArrowRight}
                  className="size-4"
                  strokeWidth={1.9}
                />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Témoignages */}
      <section className="border-t border-border-subtle bg-bg px-5 py-8 sm:px-6 lg:px-11 lg:py-16">
        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.18em] text-gold-600 uppercase lg:mb-3 lg:text-xs">
          {t("testimonials.eyebrow")}
        </p>
        <h2 className="mb-5 font-serif text-2xl font-medium lg:mb-8 lg:text-[34px]">
          <span className="lg:hidden">{t("testimonials.titleMobile")}</span>
          <span className="hidden lg:inline">{t("testimonials.title")}</span>
        </h2>

        <div className="hidden grid-cols-3 gap-[26px] lg:grid">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              locale={locale}
            />
          ))}
        </div>

        <div className="lg:hidden">
          {testimonials
            .filter((testimonial) => testimonial.kind === "text")
            .slice(0, 1)
            .map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                locale={locale}
              />
            ))}
        </div>
      </section>

      {/* CTA permanent */}
      <section className="relative overflow-hidden bg-green-800 px-5 py-8 text-on-dark sm:px-6 lg:px-11 lg:py-12">
        <Image
          src="/images/marketing/hadj-cles.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_25%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(9,32,18,0.95)_0%,rgba(9,32,18,0.9)_50%,rgba(9,32,18,0.82)_100%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="mb-2 font-serif text-[26px] font-medium lg:text-[32px]">
              {t("cta.title")}
            </h2>
            <p className="text-[15px] text-on-dark-muted lg:text-base">
              {t("cta.description")}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button variant="gold" size="lg" asChild>
              <Link href={courseHref}>{t("cta.ctaPrimary")}</Link>
            </Button>
            <Button variant="whatsapp" size="lg" asChild>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" strokeWidth={1.8} />
                {t("cta.ctaWhatsapp")}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer
        columns={footerColumns}
        whatsappHref={WHATSAPP_URL}
        whatsappLabel={WHATSAPP_DISPLAY}
        copyright={tCommon("footer.copyright", {
          year: new Date().getFullYear(),
        })}
        paymentNote={tCommon("footer.paymentNote")}
      />

      <StickyCta
        priceLabel={t("stickyCta.priceLabel")}
        price={formatPrice(course?.priceXof ?? 0, locale)}
        action={
          <Button className="w-full" asChild>
            <Link href={courseHref}>{t("stickyCta.action")}</Link>
          </Button>
        }
      />
    </div>
  );
}
