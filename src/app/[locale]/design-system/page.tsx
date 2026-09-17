import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, Home, LayoutGrid, User } from "lucide-react";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/types";
import { formatDuration, formatPrice } from "@/lib/format";
import { courses } from "@/mocks/courses";
import { aminataEnrollments } from "@/mocks/enrollments";
import { getLessonState } from "@/features/learning/get-lesson-state";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LevelBadge } from "@/components/patterns/level-badge";
import {
  StatusBadge,
  type StatusBadgeStatus,
} from "@/components/patterns/status-badge";
import { ProgressBar } from "@/components/patterns/progress-bar";
import { SectionEyebrow } from "@/components/patterns/section-eyebrow";
import { StatCard } from "@/components/patterns/stat-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { Alert } from "@/components/patterns/alert";
import { WhatsAppButton } from "@/components/patterns/whatsapp-button";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { CourseCard } from "@/components/patterns/course-card";
import {
  CurriculumAccordion,
  type CurriculumModule,
} from "@/components/patterns/curriculum-accordion";
import { StickyCta } from "@/components/patterns/sticky-cta";

import { PublicHeader } from "@/components/layout/public-header";
import { LearnerHeader } from "@/components/layout/learner-header";
import { logout } from "@/features/auth/api/logout";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = { title: "Design system — Mouslih Academy" };

const SAMPLES = {
  fr: {
    levels: {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
    },
    status: {
      paid: "Payé",
      pending: "En attente",
      failed: "Échoué",
      refunded: "Remboursé",
      draft: "Brouillon",
      premium: "Premium",
    },
    discover: "Découvrir",
    freePreview: "Aperçu gratuit",
    notPurchased: "Non acheté",
    unlock: "Débloquer",
    eyebrow: "Formation vedette",
    statLabel: "Chiffre d'affaires 30 jours",
    statValue: "1 285 000 F",
    statChange: "+18 % (+195 000 F)",
    emptyTitle: "Aucun résultat",
    emptyDesc: "Essayez d'élargir vos filtres de recherche.",
    alertSuccessTitle: "Paiement confirmé",
    alertSuccessDesc: "Votre accès à la formation est activé.",
    alertPendingTitle: "Paiement en attente",
    alertPendingDesc: "Nous confirmons votre transaction Wave.",
    alertFailedTitle: "Paiement échoué",
    alertFailedDesc: "Veuillez réessayer ou contacter le support.",
    navHome: "Accueil",
    navCatalog: "Catalogue",
    navTestimonials: "Témoignages",
    login: "Se connecter",
    signup: "Créer un compte",
    dashboard: "Tableau de bord",
    myCourses: "Mes formations",
    account: "Mon compte",
    profile: "Profil",
    logout: "Déconnexion",
    whatsapp: "Discuter sur WhatsApp",
    footerCols: ["Formations", "Académie", "Légal"],
    copyright: "© 2026 Mouslih Academy · Dakar, Sénégal",
    paymentNote: "Paiement sécurisé par Wave",
    freeLessonLabel: "Aperçu gratuit",
    ctaPriceLabel: "À partir de",
    ctaAction: "S'inscrire",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.sn",
    messageLabel: "Message",
    subscribeLabel: "Recevoir la newsletter",
    notifLabel: "Notifications par e-mail",
    levelSelectLabel: "Niveau",
  },
  en: {
    levels: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    },
    status: {
      paid: "Paid",
      pending: "Pending",
      failed: "Failed",
      refunded: "Refunded",
      draft: "Draft",
      premium: "Premium",
    },
    discover: "Discover",
    freePreview: "Free preview",
    notPurchased: "Not purchased",
    unlock: "Unlock",
    eyebrow: "Featured course",
    statLabel: "30-day revenue",
    statValue: "1,285,000 F",
    statChange: "+18% (+195,000 F)",
    emptyTitle: "No results",
    emptyDesc: "Try widening your search filters.",
    alertSuccessTitle: "Payment confirmed",
    alertSuccessDesc: "Your course access is now active.",
    alertPendingTitle: "Payment pending",
    alertPendingDesc: "We're confirming your Wave transaction.",
    alertFailedTitle: "Payment failed",
    alertFailedDesc: "Please try again or contact support.",
    navHome: "Home",
    navCatalog: "Catalog",
    navTestimonials: "Testimonials",
    login: "Log in",
    signup: "Sign up",
    dashboard: "Dashboard",
    myCourses: "My courses",
    account: "My account",
    profile: "Profile",
    logout: "Log out",
    whatsapp: "Chat on WhatsApp",
    footerCols: ["Courses", "Academy", "Legal"],
    copyright: "© 2026 Mouslih Academy · Dakar, Senegal",
    paymentNote: "Secure payment by Wave",
    freeLessonLabel: "Free preview",
    ctaPriceLabel: "Starting at",
    ctaAction: "Enroll",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message",
    subscribeLabel: "Subscribe to the newsletter",
    notifLabel: "Email notifications",
    levelSelectLabel: "Level",
  },
  ar: {
    levels: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم" },
    status: {
      paid: "مدفوع",
      pending: "قيد الانتظار",
      failed: "فشل",
      refunded: "مسترد",
      draft: "مسودة",
      premium: "مميز",
    },
    discover: "اكتشف",
    freePreview: "معاينة مجانية",
    notPurchased: "غير مُشترى",
    unlock: "فتح",
    eyebrow: "الأكثر متابعة",
    statLabel: "الإيرادات خلال 30 يومًا",
    statValue: "١٢٨٥٠٠٠ فرنك",
    statChange: "+١٨٪",
    emptyTitle: "لا توجد نتائج",
    emptyDesc: "حاول توسيع نطاق التصفية.",
    alertSuccessTitle: "تم تأكيد الدفع",
    alertSuccessDesc: "تم تفعيل وصولك إلى الدورة.",
    alertPendingTitle: "الدفع قيد الانتظار",
    alertPendingDesc: "نقوم بتأكيد معاملتك عبر Wave.",
    alertFailedTitle: "فشل الدفع",
    alertFailedDesc: "يرجى المحاولة مرة أخرى أو التواصل مع الدعم.",
    navHome: "الرئيسية",
    navCatalog: "الدورات",
    navTestimonials: "الشهادات",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    dashboard: "لوحة التحكم",
    myCourses: "دوراتي",
    account: "حسابي",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",
    whatsapp: "تواصل عبر واتساب",
    footerCols: ["الدورات", "الأكاديمية", "قانوني"],
    copyright: "© 2026 مسلح أكاديمي · دكار، السنغال",
    paymentNote: "دفع آمن عبر Wave",
    freeLessonLabel: "معاينة مجانية",
    ctaPriceLabel: "ابتداءً من",
    ctaAction: "اشترك",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "anta@amthila.sn",
    messageLabel: "الرسالة",
    subscribeLabel: "الاشتراك في النشرة الإخبارية",
    notifLabel: "إشعارات البريد الإلكتروني",
    levelSelectLabel: "المستوى",
  },
} satisfies Record<Locale, Record<string, unknown>>;

interface DesignSystemPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DesignSystemPage({
  params,
}: DesignSystemPageProps) {
  // Vitrine interne des composants (QA/dev) : jamais destinée aux visiteurs.
  if (process.env.NODE_ENV === "production") notFound();

  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;
  const t = SAMPLES[locale];

  const fatiha = courses[0];
  const nourania = courses[1];
  const enrollment = aminataEnrollments[0];

  const curriculumModules: CurriculumModule[] = fatiha.modules.map(
    (module, i) => ({
      id: module.id,
      number: String(i + 1).padStart(2, "0"),
      title: module.title[locale],
      meta: `${module.subModules.reduce((n, s) => n + s.lessons.length, 0)} leçons`,
      subModules: module.subModules.map((sub) => ({
        id: sub.id,
        title: sub.title ? sub.title[locale] : null,
        lessons: sub.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title[locale],
          duration: formatDuration(lesson.durationSeconds),
          state: getLessonState(lesson, enrollment, true),
          freeLabel: t.freeLessonLabel,
        })),
      })),
    }),
  );

  const statuses: StatusBadgeStatus[] = [
    "paid",
    "pending",
    "failed",
    "refunded",
    "draft",
    "premium",
  ];

  const navItems = [
    { label: t.navHome, href: "/", active: true },
    { label: t.navCatalog, href: "/formations" },
    { label: t.navTestimonials, href: "/temoignages" },
  ];

  const learnerNavItems = [
    { label: t.dashboard, href: "/tableau-de-bord", active: true },
    { label: t.myCourses, href: "/tableau-de-bord" },
    { label: t.navCatalog, href: "/formations" },
  ];

  const adminNavItems = [
    { label: t.dashboard, href: "/admin", icon: LayoutGrid, active: true },
    { label: t.myCourses, href: "/admin/formations", icon: BookOpen, count: 6 },
    { label: t.account, href: "/admin/utilisateurs", icon: User },
  ];

  const tabItems = [
    { label: t.navHome, href: "/", icon: Home, active: true },
    { label: t.myCourses, href: "/tableau-de-bord", icon: BookOpen },
    { label: t.navCatalog, href: "/formations", icon: LayoutGrid },
    { label: t.account, href: "/profil", icon: User },
  ];

  return (
    <div className="space-y-20 pb-32">
      <section>
        <PublicHeader
          navItems={navItems}
          loginLabel={t.login}
          loginHref="/connexion"
          signupLabel={t.signup}
          signupHref="/inscription"
        />
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-6">
        <section className="space-y-4">
          <SectionEyebrow>Buttons</SectionEyebrow>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="gold">Gold</Button>
            <Button variant="whatsapp">WhatsApp</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" loading>
              Loading
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Form fields</SectionEyebrow>
          <div className="grid max-w-md gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ds-email">{t.emailLabel}</Label>
              <Input
                id="ds-email"
                type="email"
                placeholder={t.emailPlaceholder}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-email-error">{t.emailLabel}</Label>
              <Input id="ds-email-error" aria-invalid defaultValue="invalide" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-message">{t.messageLabel}</Label>
              <Textarea id="ds-message" placeholder={t.messageLabel} />
            </div>
            <div className="space-y-1.5">
              <Label>{t.levelSelectLabel}</Label>
              <Select defaultValue="beginner">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t.levels.beginner}</SelectItem>
                  <SelectItem value="intermediate">
                    {t.levels.intermediate}
                  </SelectItem>
                  <SelectItem value="advanced">{t.levels.advanced}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm text-text-soft">
              <Checkbox defaultChecked />
              {t.subscribeLabel}
            </label>
            <label className="flex items-center gap-2 text-sm text-text-soft">
              <Switch defaultChecked />
              {t.notifLabel}
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Level badge</SectionEyebrow>
          <div className="flex flex-wrap gap-3">
            <LevelBadge level="beginner" label={t.levels.beginner} />
            <LevelBadge level="intermediate" label={t.levels.intermediate} />
            <LevelBadge level="advanced" label={t.levels.advanced} />
          </div>
          <div className="flex flex-wrap gap-3 rounded-sm bg-green-900 p-4">
            <LevelBadge
              level="advanced"
              label={t.levels.advanced}
              variant="overlay"
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Status badge</SectionEyebrow>
          <div className="flex flex-wrap gap-3">
            {statuses.map((status) => (
              <StatusBadge
                key={status}
                status={status}
                label={t.status[status]}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Progress bar</SectionEyebrow>
          <div className="max-w-sm space-y-4">
            <ProgressBar percent={45} label="5 / 11 · 45 %" />
            <ProgressBar percent={100} label="12 / 12 · 100 %" />
            <ProgressBar percent={45} variant="circular" />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Stat card</SectionEyebrow>
          <div className="max-w-xs">
            <StatCard
              label={t.statLabel}
              value={t.statValue}
              change={{ direction: "up", label: t.statChange }}
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Alert</SectionEyebrow>
          <div className="space-y-3">
            <Alert
              variant="success"
              title={t.alertSuccessTitle}
              description={t.alertSuccessDesc}
            />
            <Alert
              variant="pending"
              title={t.alertPendingTitle}
              description={t.alertPendingDesc}
            />
            <Alert
              variant="failed"
              title={t.alertFailedTitle}
              description={t.alertFailedDesc}
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Empty state</SectionEyebrow>
          <EmptyState
            icon={BookOpen}
            title={t.emptyTitle}
            description={t.emptyDesc}
          />
        </section>

        <section className="space-y-4">
          <SectionEyebrow>WhatsApp button</SectionEyebrow>
          <WhatsAppButton
            href="https://wa.me/221000000000"
            label={t.whatsapp}
          />
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Geometric patterns</SectionEyebrow>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative h-28 overflow-hidden rounded-sm bg-green-900">
              <GeometricPattern variant="khatam" opacity={0.5} />
            </div>
            <div className="relative h-28 overflow-hidden rounded-sm bg-green-800">
              <GeometricPattern variant="treillis" opacity={0.5} />
            </div>
            <div className="relative h-28 overflow-hidden rounded-sm bg-bg">
              <GeometricPattern variant="chevrons" opacity={0.6} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Course card</SectionEyebrow>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CourseCard
              href={`/formations/${fatiha.slug}`}
              title={fatiha.title[locale]}
              meta="11 leçons · 3 h"
              price={formatPrice(fatiha.priceXof, locale)}
              level={fatiha.level}
              levelLabel={t.levels[fatiha.level]}
              coverUrl={fatiha.coverUrl}
              discoverLabel={t.discover}
              promoLabel={t.eyebrow}
            />
            <CourseCard
              href={`/formations/${nourania.slug}`}
              title={nourania.title[locale]}
              meta="14 leçons · 6 h 20"
              price={formatPrice(nourania.priceXof, locale)}
              level={nourania.level}
              levelLabel={t.levels[nourania.level]}
              coverUrl={nourania.coverUrl}
              discoverLabel={t.discover}
              locked
              lockedLabel={t.notPurchased}
              unlockLabel={t.unlock}
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Curriculum accordion</SectionEyebrow>
          <div className="rounded-sm border border-border-subtle bg-surface p-2">
            <CurriculumAccordion
              modules={curriculumModules}
              defaultOpen={[curriculumModules[0]?.id]}
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Learner header</SectionEyebrow>
          <div className="overflow-hidden rounded-sm border border-border-subtle">
            <LearnerHeader
              navItems={learnerNavItems}
              userName="Aminata Diallo"
              userMenuItems={[{ label: t.profile, href: "/profil" }]}
              logoutLabel={t.logout}
              onLogout={logout.bind(null, locale)}
            />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Admin sidebar</SectionEyebrow>
          <div className="h-[360px] overflow-hidden rounded-sm">
            <AdminSidebar navItems={adminNavItems} userName="Admin" />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Mobile tab bar</SectionEyebrow>
          <div className="relative h-16 overflow-hidden rounded-sm border border-border-subtle">
            <MobileTabBar items={tabItems} className="static flex" />
          </div>
        </section>

        <section className="space-y-4">
          <SectionEyebrow>Sticky CTA</SectionEyebrow>
          <div className="relative overflow-hidden rounded-sm border border-border-subtle bg-bg">
            <StickyCta
              priceLabel={t.ctaPriceLabel}
              price={formatPrice(fatiha.priceXof, locale)}
              action={<Button className="w-full">{t.ctaAction}</Button>}
              className="static flex lg:flex"
            />
          </div>
        </section>
      </div>

      <section>
        <Footer
          columns={t.footerCols.map((title, i) => ({
            title,
            links: [
              {
                label: navItems[i % navItems.length]?.label ?? title,
                href: "/",
              },
            ],
          }))}
          whatsappHref="https://wa.me/221000000000"
          whatsappLabel={t.whatsapp}
          copyright={t.copyright}
          paymentNote={t.paymentNote}
        />
      </section>
    </div>
  );
}
