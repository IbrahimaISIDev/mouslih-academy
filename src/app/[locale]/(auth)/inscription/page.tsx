import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthSidePanel } from "@/features/auth/components/auth-side-panel";
import { AuthHelpLine } from "@/features/auth/components/auth-help-line";
import { SignupForm } from "@/features/auth/components/signup-form";
import { LanguageSwitcher } from "@/components/patterns/language-switcher";
import { WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Créer un compte — Mouslih Academy",
};

interface InscriptionPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function InscriptionPage({
  searchParams,
}: InscriptionPageProps) {
  const [{ redirect }, t, tSide] = await Promise.all([
    searchParams,
    getTranslations("auth.signup"),
    getTranslations("auth.sidePanel"),
  ]);
  const loginHref = redirect
    ? `/connexion?redirect=${encodeURIComponent(redirect)}`
    : "/connexion";

  return (
    <div className="lg:grid lg:min-h-[720px] lg:grid-cols-2">
      <AuthSidePanel
        mobileTitle={t("mobileTitle")}
        sideTitle={t("sideTitle")}
        sideBody={t("sideBody")}
        bullets={tSide.raw("bullets")}
        statLine={tSide("statLine")}
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
            <Link href={loginHref} className="font-semibold text-green-ink">
              {t("formSwitchLabel")}
            </Link>
          </p>

          <SignupForm redirectTo={redirect} />
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
