import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/types";
import { formatCount } from "@/lib/format";
import { getPublicStats } from "@/features/catalog/api/get-public-stats";
import { AuthSidePanel } from "@/features/auth/components/auth-side-panel";
import { AuthHelpLine } from "@/features/auth/components/auth-help-line";
import { LoginForm } from "@/features/auth/components/login-form";
import { LanguageSwitcher } from "@/components/patterns/language-switcher";
import { WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = { title: "Connexion — Mouslih Academy" };

// Page pré-rendue statiquement : sans revalidation, le nombre réel d'apprenants (statLine)
// resterait figé à sa valeur au moment du build.
export const revalidate = 3600;

interface ConnexionPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
}

export default async function ConnexionPage({
  params,
  searchParams,
}: ConnexionPageProps) {
  const [{ locale: rawLocale }, { redirect }, t, tSide, publicStats] =
    await Promise.all([
      params,
      searchParams,
      getTranslations("auth.login"),
      getTranslations("auth.sidePanel"),
      getPublicStats(),
    ]);
  const locale = rawLocale as Locale;
  const signupHref = redirect
    ? `/inscription?redirect=${encodeURIComponent(redirect)}`
    : "/inscription";

  return (
    <div className="lg:grid lg:min-h-[720px] lg:grid-cols-2">
      <AuthSidePanel
        mobileTitle={t("mobileTitle")}
        sideTitle={t("sideTitle")}
        sideBody={t("sideBody")}
        bullets={tSide.raw("bullets")}
        statLine={tSide("statLine", {
          count: formatCount(publicStats.learnersCount, locale),
        })}
      />

      <div className="flex flex-col px-5 py-7 lg:h-full lg:px-15 lg:py-10">
        <div className="hidden justify-end lg:flex">
          <LanguageSwitcher variant="segmented" />
        </div>

        <div className="mx-auto w-full max-w-[420px] lg:my-auto">
          <h1 className="mb-2 hidden font-serif text-[34px] font-medium tracking-[-0.01em] lg:block">
            {t("mobileTitle")}
          </h1>
          <p className="mb-6 text-[15px] text-text-muted lg:mb-7 lg:text-base">
            {t("formSubPrefix")}{" "}
            <Link href={signupHref} className="font-semibold text-green-ink">
              {t("formSwitchLabel")}
            </Link>
          </p>

          <LoginForm redirectTo={redirect} />
        </div>

        <AuthHelpLine
          text={t("helpText")}
          linkLabel={t("helpLink")}
          href={WHATSAPP_URL}
        />
      </div>
    </div>
  );
}
