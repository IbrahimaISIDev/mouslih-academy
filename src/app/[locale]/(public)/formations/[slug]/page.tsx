import {
  Check,
  Clock,
  Globe,
  MessageCircle,
  Play,
  Shield,
  Video,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { formatDuration, formatPrice, formatTotalDuration } from "@/lib/format";
import { getCourse } from "@/features/catalog/api/get-course";
import { getLessonState } from "@/features/learning/get-lesson-state";
import type { CurriculumModule } from "@/components/patterns/curriculum-accordion";
import { CourseCurriculum } from "@/features/catalog/components/course-curriculum";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PublicHeader } from "@/components/layout/public-header";
import { LevelBadge } from "@/components/patterns/level-badge";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { StickyCta } from "@/components/patterns/sticky-cta";

const WHATSAPP_URL = "https://wa.me/221770000000";

interface CourseDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ module?: string }>;
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: CourseDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const { module: sharedModuleId } = await searchParams;
  const locale = rawLocale as Locale;

  const course = await getCourse(slug);
  if (!course) notFound();

  // Non achetée par défaut ; l'authentification (PROMPT-03) déterminera cette valeur.
  const isPurchased = false;

  const [t, tNav, tCommon, tCatalog] = await Promise.all([
    getTranslations("course"),
    getTranslations("nav"),
    getTranslations("common"),
    getTranslations("catalog"),
  ]);

  const navItems = [
    { label: tNav("home"), href: "/" },
    { label: tNav("formations"), href: "/formations" },
    { label: tNav("testimonials"), href: "/temoignages" },
    { label: tNav("contact"), href: "/contact" },
  ];

  const lessonCount = course.modules.reduce(
    (n, m) => n + m.subModules.reduce((s, sm) => s + sm.lessons.length, 0),
    0,
  );
  const freeLessonCount = course.modules.reduce(
    (n, m) =>
      n +
      m.subModules.reduce(
        (s, sm) => s + sm.lessons.filter((l) => l.isFreePreview).length,
        0,
      ),
    0,
  );

  function moduleDurationLabel(totalSeconds: number): string {
    if (totalSeconds >= 3600) return formatTotalDuration(totalSeconds);
    return t("curriculum.minutesShort", {
      count: Math.round(totalSeconds / 60),
    });
  }

  const curriculumModules: CurriculumModule[] = course.modules.map(
    (module, index) => {
      const lessons = module.subModules.flatMap((s) => s.lessons);
      const totalSeconds = lessons.reduce((s, l) => s + l.durationSeconds, 0);
      const duration = moduleDurationLabel(totalSeconds);
      const hasNamedSubs = module.subModules.length > 1;
      let meta = hasNamedSubs
        ? t("curriculum.moduleMetaWithSub", {
            subCount: module.subModules.length,
            lessons: lessons.length,
            duration,
          })
        : t("curriculum.moduleMeta", { lessons: lessons.length, duration });
      if (index === course.modules.length - 1) {
        meta += t("curriculum.moduleMetaCertificateSuffix");
      }

      return {
        id: module.id,
        number: String(index + 1).padStart(2, "0"),
        title: module.title[locale],
        meta,
        subModules: module.subModules.map((sub) => ({
          id: sub.id,
          title: sub.title ? sub.title[locale] : null,
          lessons: sub.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title[locale],
            duration: formatDuration(lesson.durationSeconds),
            state: getLessonState(lesson, null, isPurchased),
            freeLabel: t("curriculum.freeLabel"),
          })),
        })),
      };
    },
  );

  const defaultOpen = [curriculumModules[0]?.id, sharedModuleId].filter(
    (id): id is string => !!id && curriculumModules.some((m) => m.id === id),
  );

  return (
    <div className="pb-32 lg:pb-0">
      <PublicHeader
        navItems={navItems}
        loginLabel={tNav("login")}
        loginHref="/connexion"
        signupLabel={tNav("signup")}
        signupHref="/inscription"
      />

      {/* En-tête sombre */}
      <section className="relative overflow-hidden bg-green-900 text-on-dark">
        <GeometricPattern variant="khatam" opacity={0.32} />
        <div className="relative px-5 py-8 sm:px-6 lg:px-11 lg:py-11">
          <div className="mb-5 text-[13px] text-green-300 lg:mb-6.5">
            {t("breadcrumb.formations")} <span className="mx-2 inline-block rtl:scale-x-[-1]">›</span>
            {t("breadcrumb.category")} <span className="mx-2 inline-block rtl:scale-x-[-1]">›</span>
            <span className="text-on-dark-muted">{course.title[locale]}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
            <div>
              <div className="mb-3.5 flex flex-wrap gap-2 lg:mb-5">
                <LevelBadge
                  level={course.level}
                  label={tCatalog(`levels.${course.level}`)}
                />
                {course.isFeatured && (
                  <span className="rounded-sm bg-gold-200 px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.06em] text-green-ink uppercase">
                    {t("badgeFeatured")}
                  </span>
                )}
              </div>
              <h1 className="mb-3 font-serif text-[30px] leading-[1.14] font-medium lg:mb-4.5 lg:text-[46px] lg:leading-[1.1] lg:tracking-[-0.015em]">
                {course.title[locale]}
              </h1>
              <p className="mb-4.5 max-w-[54ch] text-[15px] leading-[1.65] text-on-dark-muted lg:mb-7 lg:text-[18px]">
                <span className="lg:hidden">
                  {course.heroTaglineMobile?.[locale] ??
                    course.cardDescription[locale]}
                </span>
                <span className="hidden lg:inline">
                  {course.heroTagline?.[locale] ??
                    course.cardDescription[locale]}
                </span>
              </p>

              <div className="grid grid-cols-2 gap-2.5 lg:flex lg:flex-wrap lg:gap-8.5">
                <div className="flex items-center gap-2 text-[13px] text-text-soft lg:gap-2.5 lg:text-[15px] lg:text-on-dark-soft">
                  <Video
                    className="size-4 text-green-300 lg:size-[18px]"
                    strokeWidth={1.5}
                  />
                  <span className="lg:hidden">
                    {t("meta.lessonsShort", { count: lessonCount })}
                  </span>
                  <span className="hidden lg:inline">
                    {t("meta.lessonsVideo", { count: lessonCount })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-text-soft lg:gap-2.5 lg:text-[15px] lg:text-on-dark-soft">
                  <Clock
                    className="size-4 text-green-300 lg:size-[18px]"
                    strokeWidth={1.5}
                  />
                  <span className="lg:hidden">
                    {t("meta.hoursShort", {
                      hours: formatTotalDuration(course.totalDurationSeconds),
                    })}
                  </span>
                  <span className="hidden lg:inline">
                    {t("meta.hoursContent", {
                      hours: formatTotalDuration(course.totalDurationSeconds),
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-text-soft lg:gap-2.5 lg:text-[15px] lg:text-on-dark-soft">
                  <Shield
                    className="size-4 text-green-300 lg:size-[18px]"
                    strokeWidth={1.5}
                  />
                  <span className="lg:hidden">
                    {t("meta.certificateShort")}
                  </span>
                  <span className="hidden lg:inline">
                    {t("meta.certificateIncluded")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-text-soft lg:gap-2.5 lg:text-[15px] lg:text-on-dark-soft">
                  <Globe
                    className="size-4 text-green-300 lg:size-[18px]"
                    strokeWidth={1.5}
                  />
                  {t("meta.languages")}
                </div>
              </div>
            </div>

            {/* Carte d'achat */}
            <div className="border border-gold-600 bg-surface text-text">
              <div className="relative grid aspect-16/10 place-items-center overflow-hidden bg-green-800">
                <GeometricPattern variant="khatam" opacity={0.3} />
                <div className="relative grid size-14 place-items-center rounded-full border border-gold-200 bg-green-900/50">
                  <Play
                    className="size-5 text-gold-200"
                    strokeWidth={0}
                    fill="currentColor"
                  />
                </div>
                <span className="absolute bottom-2.5 start-3 text-xs text-on-dark-muted">
                  {t("purchaseCard.previewCaption")}
                </span>
              </div>
              <div className="p-5 lg:p-6">
                <div className="mb-1 flex items-baseline gap-2.5">
                  <span className="font-serif text-[28px] font-semibold lg:text-[34px]">
                    {formatPrice(course.priceXof, locale)}
                  </span>
                  {course.compareAtPriceXof && (
                    <span className="text-[15px] text-text-faint line-through">
                      {formatPrice(course.compareAtPriceXof, locale)}
                    </span>
                  )}
                </div>
                <div className="mb-5 text-sm text-text-muted">
                  {t("purchaseCard.paymentNote")}
                </div>
                <Button size="lg" className="mb-2.5 w-full" asChild>
                  <Link href={`/commande/${course.slug}`}>
                    {t("purchaseCard.buyButton")}
                  </Link>
                </Button>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-success-border px-4 py-3.5 text-[15px] font-semibold text-whatsapp-hover transition-colors hover:bg-success-bg"
                >
                  <MessageCircle className="size-[17px]" strokeWidth={1.8} />
                  {t("purchaseCard.questionButton")}
                </a>
                <div className="mt-5 flex flex-col gap-2.5 border-t border-hairline pt-4">
                  {t.raw("purchaseCard.included").map((item: string) => (
                    <div
                      key={item}
                      className="flex gap-2.5 text-sm text-text-soft"
                    >
                      <Check
                        className="mt-0.5 size-[15px] shrink-0 text-success"
                        strokeWidth={1.8}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corps */}
      <section className="grid gap-8 px-5 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-12 lg:px-11 lg:py-16">
        <div>
          <h2 className="mb-3 font-serif text-2xl font-medium lg:mb-4 lg:text-[30px]">
            <span className="lg:hidden">{t("about.titleMobile")}</span>
            <span className="hidden lg:inline">{t("about.title")}</span>
          </h2>
          {course.description[locale].split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "mb-2.5 max-w-[62ch] text-[15px] leading-[1.7] text-text-soft lg:text-[17px] lg:leading-[1.75]"
                  : "mb-4 max-w-[62ch] text-[15px] leading-[1.7] text-text-soft last:mb-0 lg:mb-8.5 lg:text-[17px] lg:leading-[1.75]"
              }
            >
              {paragraph}
            </p>
          ))}

          <div className="mb-8 border border-border-subtle bg-bg p-6 lg:mb-10">
            <p className="mb-3.5 text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase">
              {t("outcomes.eyebrow")}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-x-6.5 sm:gap-y-3">
              {t.raw("outcomes.items").map((item: string) => (
                <div
                  key={item}
                  className="flex gap-2.5 text-[15px] text-text-soft"
                >
                  <Check
                    className="mt-0.5 size-[18px] shrink-0 text-green-ink"
                    strokeWidth={1.7}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-medium lg:text-[30px]">
              <span className="lg:hidden">{t("curriculum.titleMobile")}</span>
              <span className="hidden lg:inline">{t("curriculum.title")}</span>
            </h2>
            <span className="hidden text-sm text-text-muted lg:inline">
              {t("curriculum.summary", {
                modules: course.modules.length,
                lessons: lessonCount,
                free: freeLessonCount,
              })}
            </span>
          </div>
          <div className="mb-4 text-xs text-text-muted lg:hidden">
            {t("curriculum.summaryMobile", {
              modules: course.modules.length,
              lessons: lessonCount,
            })}
          </div>

          <div className="border border-border-subtle bg-surface">
            <CourseCurriculum
              modules={curriculumModules}
              defaultOpen={defaultOpen}
            />
          </div>
        </div>

        {/* Sidebar collante */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-6">
          <div className="border border-border-subtle bg-bg p-5.5">
            <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
              {t("teacher.eyebrow")}
            </p>
            <div className="mb-3.5 flex items-center gap-3.5">
              <Avatar className="size-13.5 shrink-0">
                <AvatarFallback className="text-lg">OM</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-serif text-lg font-semibold">
                  {t("teacher.name")}
                </div>
                <div className="text-[13px] text-text-muted">
                  {t("teacher.credentials")}
                </div>
              </div>
            </div>
            <p className="text-sm leading-[1.65] text-text-soft">
              {t("teacher.bio")}
            </p>
          </div>

          <div className="border border-border-subtle p-5.5">
            <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
              {t("faq.eyebrow")}
            </p>
            <div className="flex flex-col gap-3.5">
              {t
                .raw("faq.items")
                .map((question: string, i: number, arr: string[]) => (
                  <div
                    key={question}
                    className={
                      i < arr.length - 1
                        ? "flex justify-between gap-3 border-b border-hairline pb-3.5 text-[15px]"
                        : "flex justify-between gap-3 text-[15px]"
                    }
                  >
                    <span>{question}</span>
                    <span className="text-text-muted">+</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-between bg-green-900 px-5 py-6 text-[13px] text-green-300 sm:px-6 lg:px-11">
        <span>{tCommon("footer.copyright")}</span>
        <span className="hidden sm:inline">
          {tCommon("footer.paymentNote")}
        </span>
      </div>

      <StickyCta
        priceLabel={t("stickyCta.lifetimeLabel")}
        price={formatPrice(course.priceXof, locale)}
        action={
          <Button className="w-full" asChild>
            <Link href={`/commande/${course.slug}`}>
              {t("stickyCta.buyButton")}
            </Link>
          </Button>
        }
      />
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed inset-x-0 bottom-[76px] z-40 flex items-center justify-center gap-2 bg-bg/82 py-2 text-[13px] font-semibold text-whatsapp-hover backdrop-blur-md lg:hidden"
      >
        <MessageCircle className="size-[15px]" strokeWidth={1.8} />
        {t("purchaseCard.questionButtonMobile")}
      </a>
    </div>
  );
}
