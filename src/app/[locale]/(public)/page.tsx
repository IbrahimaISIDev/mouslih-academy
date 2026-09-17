import { ArrowRight, CheckCircle, MessageCircle, Play, Shield } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { formatPrice, formatTotalDuration } from "@/lib/format";
import { getCourses } from "@/features/catalog/api/get-courses";
import { getTestimonials } from "@/features/catalog/api/get-testimonials";

import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { CourseCard } from "@/components/patterns/course-card";
import { StickyCta } from "@/components/patterns/sticky-cta";
import { TestimonialCard } from "@/components/patterns/testimonial-card";
import { DirectionalIcon } from "@/components/patterns/directional-icon";
import { AnimatedCounter } from "@/components/patterns/animated-counter";

const WHATSAPP_URL = "https://wa.me/221770000000";
const HERO_LEARNERS_COUNT = 1240;
const HERO_COURSES_COUNT = 6;

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

  const [t, tNav, tCommon, tCatalog, featured, allTestimonials] =
    await Promise.all([
      getTranslations("home"),
      getTranslations("nav"),
      getTranslations("common"),
      getTranslations("catalog"),
      getCourses({ featured: true }),
      getTestimonials(),
    ]);

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

  const footerColumns = (
    tCommon.raw("footer.columns") as { title: string; items: string[] }[]
  ).map((column) => ({
    title: column.title,
    links: column.items.map((label) => ({ label, href: "/" })),
  }));

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
                <Link href="/formations">{t("hero.ctaPrimary")}</Link>
              </Button>
              <Link
                href="/formations"
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
                  value={HERO_LEARNERS_COUNT}
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
                  value={HERO_COURSES_COUNT}
                  locale={locale}
                  className="font-serif text-xl lg:text-[27px]"
                />
                <div className="mt-0.5 text-[11px] text-green-300 lg:text-[13px]">
                  <span className="lg:hidden">
                    {t("hero.statCoursesLabelMobile")}
                  </span>
                  <span className="hidden lg:inline">
                    {t("hero.statCoursesLabel")}
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
            <div className="relative aspect-4/3 overflow-hidden border border-green-300/25 bg-green-800">
              <Image
                src="/images/team/teacher-portrait.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 420px, 0px"
                className="object-cover"
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

      {/* Vidéo de présentation */}
      <section className="border-b border-border-subtle bg-bg px-5 py-8 sm:px-6 lg:px-11 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
          <div>
            <p className="mb-2.5 text-[11px] font-semibold tracking-[0.18em] text-gold-600 uppercase lg:mb-3.5 lg:text-xs">
              {t("video.eyebrow")}
            </p>
            <h2 className="mb-4 font-serif text-2xl font-medium lg:text-[34px] lg:leading-[1.2]">
              {t("video.title")}
            </h2>
            <p className="mb-0 text-[15px] leading-[1.7] text-text-soft lg:mb-5.5 lg:text-base">
              {t("video.description")}
            </p>
            <ul className="hidden flex-col gap-2.5 lg:flex">
              {t.raw("video.bullets").map((bullet: string) => (
                <li
                  key={bullet}
                  className="flex gap-2.5 text-[15px] text-text-soft"
                >
                  <CheckCircle
                    className="mt-0.5 size-[18px] shrink-0 text-green-ink"
                    strokeWidth={1.7}
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mt-4 grid aspect-video place-items-center overflow-hidden border border-border-strong bg-green-800 lg:mt-0">
            <GeometricPattern variant="khatam" opacity={0.3} />
            <div className="relative grid size-13 place-items-center rounded-full border border-gold-200 bg-green-900/55 lg:size-17">
              <Play
                className="size-5 text-gold-200"
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
            <span className="absolute bottom-2.5 start-3 text-[11px] text-on-dark-muted lg:bottom-3.5 lg:start-4">
              <span className="lg:hidden">{t("video.captionMobile")}</span>
              <span className="hidden lg:inline">
                {t("video.captionDesktop")}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Formations en vedette */}
      <section className="bg-surface px-5 py-8 sm:px-6 lg:px-11 lg:py-16">
        <div className="mb-5 flex items-end justify-between lg:mb-8">
          <div>
            <p className="mb-2.5 text-[11px] font-semibold tracking-[0.18em] text-gold-600 uppercase lg:mb-3 lg:text-xs">
              {t("featured.eyebrow")}
            </p>
            <h2 className="font-serif text-2xl font-medium lg:text-[34px]">
              <span className="lg:hidden">{t("featured.titleMobile")}</span>
              <span className="hidden lg:inline">{t("featured.title")}</span>
            </h2>
          </div>
          <Link
            href="/formations"
            className="hidden items-center gap-1.5 text-[15px] font-semibold text-green-ink lg:flex"
          >
            {t("featured.seeCatalog")}
            <DirectionalIcon icon={ArrowRight} className="size-4" strokeWidth={1.9} />
          </Link>
          <Link
            href="/formations"
            className="text-[13px] font-semibold text-green-ink lg:hidden"
          >
            {t("featured.seeAllMobile")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[26px]">
          {featured.slice(0, 3).map((course) => (
            <CourseCard
              key={course.id}
              href={`/formations/${course.slug}`}
              title={course.title[locale]}
              meta={`${course.lessonCount} leçons · ${formatTotalDuration(course.totalDurationSeconds)}`}
              price={formatPrice(course.priceXof, locale)}
              level={course.level}
              levelLabel={tCatalog(`levels.${course.level}`)}
              coverUrl={course.coverUrl}
              discoverLabel={t("featured.discover")}
              promoLabel={
                course.id === "c-rectification-fatiha"
                  ? t("featured.badgeFeatured")
                  : undefined
              }
            />
          ))}
        </div>
      </section>

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
        <GeometricPattern variant="treillis" opacity={0.35} />
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
              <Link href="/formations">{t("cta.ctaPrimary")}</Link>
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
        whatsappLabel={tCommon("footer.whatsappNumber")}
        copyright={tCommon("footer.copyright")}
        paymentNote={tCommon("footer.paymentNote")}
      />

      <StickyCta
        priceLabel={t("stickyCta.priceLabel")}
        price={formatPrice(featured[0]?.priceXof ?? 0, locale)}
        action={
          <Button className="w-full" asChild>
            <Link href="/formations">{t("stickyCta.action")}</Link>
          </Button>
        }
      />
    </div>
  );
}
