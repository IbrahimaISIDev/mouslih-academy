import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthSidePanel } from "@/features/auth/components/auth-side-panel";
import { AuthHelpLine } from "@/features/auth/components/auth-help-line";
import { LoginForm } from "@/features/auth/components/login-form";
import { LanguageSwitcher } from "@/components/patterns/language-switcher";

export const metadata: Metadata = { title: "Connexion — Mouslih Academy" };

const WHATSAPP_URL = "https://wa.me/221770000000";

export default async function ConnexionPage() {
  const [t, tSide] = await Promise.all([
    getTranslations("auth.login"),
    getTranslations("auth.sidePanel"),
  ]);

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
            <Link href="/inscription" className="font-semibold text-green-ink">
              {t("formSwitchLabel")}
            </Link>
          </p>

          <LoginForm />
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
