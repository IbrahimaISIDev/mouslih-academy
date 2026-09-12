import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/types";
import { getProfile } from "@/features/account/api/get-profile";
import { getPurchaseHistory } from "@/features/account/api/get-purchase-history";
import { logout } from "@/features/auth/api/logout";
import { getCourses } from "@/features/catalog/api/get-courses";

import { LearnerHeader } from "@/components/layout/learner-header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { getLearnerTabItems } from "@/features/account/mobile-tabs";
import { ProfileForm } from "@/features/account/components/profile-form";
import { SecurityForm } from "@/features/account/components/security-form";
import { PurchaseHistory } from "@/features/account/components/purchase-history";
import { LanguagePreference } from "@/features/account/components/language-preference";

export const metadata: Metadata = { title: "Mon profil — Mouslih Academy" };

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;

  const [t, tNav, tCommon, profile, orders, courses] = await Promise.all([
    getTranslations("profile"),
    getTranslations("nav"),
    getTranslations("common"),
    getProfile(),
    getPurchaseHistory(),
    getCourses(),
  ]);

  const learnerNavItems = [
    { label: tNav("dashboard"), href: "/tableau-de-bord" },
    { label: tNav("myCourses"), href: "/tableau-de-bord" },
    { label: tNav("catalog"), href: "/formations" },
  ];

  const tabItems = getLearnerTabItems("profile", {
    home: tNav("home"),
    courses: tNav("myCourses"),
    catalog: tNav("catalog"),
    profile: tNav("profile"),
  });

  const sections = [
    { id: "informations-personnelles", label: t("nav.personal") },
    { id: "securite", label: t("nav.security") },
    { id: "historique-achats", label: t("nav.purchases") },
    { id: "preferences-langue", label: t("nav.language") },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <LearnerHeader
        navItems={learnerNavItems}
        userName={profile.firstName}
        userMenuItems={[{ label: tNav("profile"), href: "/profil" }]}
        logoutLabel={tNav("logout")}
        onLogout={logout.bind(null, locale)}
      />

      <div className="px-5 py-6 sm:px-6 lg:px-11 lg:py-10">
        <h1 className="mb-6 font-serif text-[28px] font-medium lg:mb-7.5 lg:text-[36px]">
          {t("title")}
        </h1>

        <nav className="mb-6 flex gap-1 overflow-x-auto [scrollbar-width:none] lg:hidden">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 snap-start border-b-2 border-transparent px-3 py-2 text-sm text-text-soft"
            >
              {section.label}
            </a>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          <nav className="hidden flex-col lg:sticky lg:top-5 lg:flex">
            {sections.map((section, i) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={
                  i === 0
                    ? "border-s-2 border-green-700 bg-green-100 px-4 py-2.5 text-[15px] font-semibold text-green-ink"
                    : "border-s-2 border-border-subtle px-4 py-2.5 text-[15px] text-text-soft"
                }
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-6">
            <div id="informations-personnelles">
              <ProfileForm profile={profile} />
            </div>
            <div id="securite">
              <SecurityForm
                passwordChangedAt={profile.passwordChangedAt}
                locale={locale}
              />
            </div>
            <div id="historique-achats">
              <PurchaseHistory
                orders={orders}
                courses={courses}
                locale={locale}
                title={t("purchases.title")}
                statusLabels={{
                  paid: tCommon("orderStatus.paid"),
                  pending: tCommon("orderStatus.pending"),
                  failed: tCommon("orderStatus.failed"),
                  refunded: tCommon("orderStatus.refunded"),
                  draft: tCommon("orderStatus.draft"),
                  premium: tCommon("orderStatus.premium"),
                }}
                columns={{
                  reference: t("purchases.columns.reference"),
                  course: t("purchases.columns.course"),
                  amount: t("purchases.columns.amount"),
                  status: t("purchases.columns.status"),
                  date: t("purchases.columns.date"),
                  receipt: t("purchases.columns.receipt"),
                }}
                downloadLabel={t("purchases.download")}
                downloadReceiptLabel={t("purchases.downloadReceipt")}
                noneLabel={t("purchases.none")}
              />
            </div>
            <div id="preferences-langue">
              <LanguagePreference currentLocale={locale} />
            </div>
          </div>
        </div>
      </div>

      <MobileTabBar items={tabItems} className="lg:hidden" />
    </div>
  );
}
