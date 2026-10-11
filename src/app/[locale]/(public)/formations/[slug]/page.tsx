import type { Metadata } from "next";
import {
  Check,
  Clock,
  GraduationCap,
  ListChecks,
  MessageCircle,
  Plus,
  Video,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { formatPrice, formatTotalDuration, localizeDigits } from "@/lib/format";
import { parseYouTubeVideoId } from "@/lib/youtube";
import { getCourse } from "@/features/catalog/api/get-course";
import { getSession } from "@/lib/session";
import { backendFetch } from "@/lib/backend-fetch";
import { USE_MOCKS } from "@/lib/use-mocks";
import { WHATSAPP_URL } from "@/lib/contact";
import { VideoProgramme } from "@/features/catalog/components/video-programme";
import { MistakesOverview } from "@/features/catalog/components/mistakes-overview";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PublicHeader } from "@/components/layout/public-header";
import { LevelBadge } from "@/components/patterns/level-badge";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { StickyCta } from "@/components/patterns/sticky-cta";
import { YouTubeFacade } from "@/components/patterns/youtube-facade";

/**
 * Vérification d'appartenance "douce" : cette page reste publique (visiteurs anonymes inclus),
 * donc on ne peut pas passer par apiFetch (qui redirige vers /connexion sur un 401 — correct
 * pour une page protégée, mais pas ici). On parle directement à backendFetch et on retombe sur
 * "non possédée" au moindre souci (pas de session, jeton mort, erreur réseau...).
 */
async function isCourseOwnedByCurrentUser(courseId: string): Promise<boolean> {
  if (USE_MOCKS) return false;

  const session = await getSession();
  if (!session) return false;

  try {
    const response = await backendFetch("/api/me/enrollments");
    if (!response.ok) return false;
    const enrollments = (await response.json()) as { courseId: string }[];
    return enrollments.some((e) => e.courseId === courseId);
  } catch {
    return false;
  }
}

function firstLessonSlug(course: {
  modules: { subModules: { lessons: { slug: string }[] }[] }[];
}): string | null {
  for (const courseModule of course.modules) {
    for (const subModule of courseModule.subModules) {
      const lesson = subModule.lessons[0];
      if (lesson) return lesson.slug;
    }
  }
  return null;
}

interface CourseDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const course = await getCourse(slug);
  if (!course) return {};

  const title = `${course.title[locale]} — Mouslih Academy`;
  const description = course.cardDescription[locale];
  // Partager le lien d'une formation précise (WhatsApp, Facebook) affiche sa vraie couverture au
  // lieu de l'image générique du site — remplace entièrement openGraph.images, ne s'ajoute pas.
  const images = course.coverUrl
    ? [{ url: course.coverUrl, width: 1280, height: 720 }]
    : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: {
      title,
      description,
      images: course.coverUrl ? [course.coverUrl] : undefined,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;

  const course = await getCourse(slug);
  if (!course) notFound();

  const isPurchased = await isCourseOwnedByCurrentUser(course.id);
  const ownedLessonHref = isPurchased
    ? (() => {
        const slug = firstLessonSlug(course);
        return slug
          ? `/formations/${course.slug}/lecons/${slug}`
          : `/formations/${course.slug}`;
      })()
    : null;

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

  const lessons = course.modules.flatMap((m) =>
    m.subModules.flatMap((sm) => sm.lessons),
  );
  const lessonCount = lessons.length || course.lessonCount;
  const mistakeCount = lessons.reduce((n, l) => n + l.mistakes.length, 0);
  const freeLessonCount = lessons.filter((l) => l.isFreePreview).length;
  const previewLesson = lessons.find((l) => l.isFreePreview && l.videoUrl);
  const previewVideoId = previewLesson?.videoUrl
    ? parseYouTubeVideoId(previewLesson.videoUrl)
    : null;
  const totalDuration = formatTotalDuration(course.totalDurationSeconds, locale);

  const faqItems = t.raw("faq.items") as { question: string; answer: string }[];

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
            {t("breadcrumb.formations")}{" "}
            <span className="mx-2 inline-block rtl:scale-x-[-1]">›</span>
            {t("breadcrumb.category")}{" "}
            <span className="mx-2 inline-block rtl:scale-x-[-1]">›</span>
            <span className="text-on-dark-muted">{course.title[locale]}</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
            <div>
              <div className="mb-3.5 flex flex-wrap gap-2 lg:mb-5">
                <LevelBadge
                  level={course.level}
                  label={tCatalog(`levels.${course.level}`)}
                />
                <span className="rounded-sm bg-gold-200 px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.06em] text-green-ink uppercase">
                  {t("badgeRecorded")}
                </span>
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

              <ul className="grid grid-cols-2 gap-2.5 lg:flex lg:flex-wrap lg:gap-x-8.5 lg:gap-y-3">
                {[
                  {
                    icon: Video,
                    label: t("meta.videos", { count: lessonCount }),
                  },
                  {
                    icon: Clock,
                    label: t("meta.duration", { duration: totalDuration }),
                  },
                  {
                    icon: ListChecks,
                    label: t("meta.mistakes", { count: mistakeCount }),
                  },
                  { icon: GraduationCap, label: t("meta.beginners") },
                ].map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-[13px] text-on-dark-soft lg:gap-2.5 lg:text-[15px]"
                  >
                    <Icon
                      className="size-4 shrink-0 text-green-300 lg:size-[18px]"
                      strokeWidth={1.5}
                    />
                    {localizeDigits(label, locale)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Carte d'achat */}
            <div className="border border-gold-600 bg-surface text-text">
              {previewVideoId && previewLesson ? (
                <YouTubeFacade
                  videoId={previewVideoId}
                  title={previewLesson.title[locale]}
                  caption={t("purchaseCard.previewCaption")}
                  className="group relative grid aspect-video w-full place-items-center overflow-hidden bg-green-800"
                />
              ) : (
                <div className="relative grid aspect-video place-items-center overflow-hidden bg-green-800">
                  {course.coverUrl ? (
                    <Image
                      src={course.coverUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 380px, 100vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <GeometricPattern variant="khatam" opacity={0.3} />
                  )}
                </div>
              )}
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
                {isPurchased ? (
                  <Button size="lg" className="mb-2.5 w-full" asChild>
                    <Link href={ownedLessonHref!}>
                      {t("purchaseCard.ownedButton")}
                    </Link>
                  </Button>
                ) : (
                  <Button size="lg" className="mb-2.5 w-full" asChild>
                    <Link href={`/commande/${course.slug}`}>
                      {t("purchaseCard.buyButton")}
                    </Link>
                  </Button>
                )}
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

          <section className="mb-10 lg:mb-14" aria-labelledby="erreurs">
            <p className="mb-2.5 text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase">
              {t("mistakes.eyebrow")}
            </p>
            <h2
              id="erreurs"
              className="mb-2 font-serif text-2xl font-medium lg:text-[30px]"
            >
              {localizeDigits(
                t("mistakes.title", { count: mistakeCount }),
                locale,
              )}
            </h2>
            <p className="mb-5 max-w-[62ch] text-[15px] leading-[1.7] text-text-soft">
              {t("mistakes.intro")}
            </p>
            <MistakesOverview
              lessons={lessons}
              locale={locale}
              videoLabel={t.raw("mistakes.videoLabel") as string}
            />
          </section>

          <section
            id="programme"
            className="scroll-mt-24"
            aria-labelledby="programme-titre"
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <h2
                id="programme-titre"
                className="font-serif text-2xl font-medium lg:text-[30px]"
              >
                {localizeDigits(
                  t("programme.title", { count: lessonCount }),
                  locale,
                )}
              </h2>
              <span className="text-sm text-text-muted">
                {localizeDigits(
                  t("programme.summary", {
                    videos: lessonCount,
                    duration: totalDuration,
                    free: freeLessonCount,
                  }),
                  locale,
                )}
              </span>
            </div>
            <VideoProgramme
              lessons={lessons}
              courseSlug={course.slug}
              locale={locale}
              isPurchased={isPurchased}
              variant="detailed"
              labels={{
                videoNumber: t.raw("programme.videoNumber") as string,
                free: t("programme.free"),
                watchFree: t("programme.watchFree"),
                watch: t("programme.watch"),
                locked: t("programme.locked"),
                objective: t("programme.objective"),
                previewCaption: t("purchaseCard.previewCaption"),
                learnTitle: t("programme.learnTitle"),
                passageLabel: t("programme.passageLabel"),
              }}
            />
          </section>
        </div>

        {/* Sidebar collante */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-6">
          <div className="border border-border-subtle bg-bg p-5.5">
            <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
              {t("teacher.eyebrow")}
            </p>
            <div className="mb-3.5 flex items-center gap-3.5">
              <Avatar className="size-13.5 shrink-0">
                <AvatarFallback className="text-lg">OS</AvatarFallback>
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
            <div className="flex flex-col">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group border-b border-hairline py-3.5 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <summary className="flex cursor-pointer list-none justify-between gap-3 text-[15px] [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <Plus
                      className="mt-0.5 size-4 shrink-0 text-text-muted transition-transform group-open:rotate-45"
                      strokeWidth={1.8}
                    />
                  </summary>
                  <p className="mt-2.5 text-sm leading-[1.65] text-text-soft">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-between bg-green-900 px-5 py-6 text-[13px] text-green-300 sm:px-6 lg:px-11">
        <span>
          {tCommon("footer.copyright", { year: new Date().getFullYear() })}
        </span>
        <span className="hidden sm:inline">
          {tCommon("footer.paymentNote")}
        </span>
      </div>

      <StickyCta
        priceLabel={t("stickyCta.lifetimeLabel")}
        price={formatPrice(course.priceXof, locale)}
        action={
          <Button className="w-full" asChild>
            <Link
              href={isPurchased ? ownedLessonHref! : `/commande/${course.slug}`}
            >
              {isPurchased
                ? t("stickyCta.ownedButton")
                : t("stickyCta.buyButton")}
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
