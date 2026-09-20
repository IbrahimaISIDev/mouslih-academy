import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/layout/logo";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Connexion administration — Mouslih Academy",
  // Page interne, réservée à l'équipe : ne doit pas apparaître dans les résultats de recherche
  // à côté des pages marketing.
  robots: { index: false, follow: false },
};

interface AdminConnexionPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

/**
 * Connexion dédiée à l'espace admin — délibérément sans rapport visuel ou éditorial avec
 * /connexion (pas de panneau marketing, pas de lien d'inscription) : deux parcours distincts,
 * voir middleware.ts (ADMIN_LOGIN_PATTERN) pour la redirection automatique depuis /admin/*.
 */
export default async function AdminConnexionPage({ searchParams }: AdminConnexionPageProps) {
  const [{ redirect }, t] = await Promise.all([searchParams, getTranslations("admin.login")]);

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-5 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Logo />
          <p className="text-xs font-semibold tracking-[0.1em] text-text-muted uppercase">
            {t("badge")}
          </p>
        </div>

        <div className="border border-border-subtle bg-surface p-7">
          <h1 className="mb-1 font-serif text-2xl font-medium">{t("heading")}</h1>
          <p className="mb-6 text-[15px] text-text-muted">{t("description")}</p>
          <LoginForm redirectTo={redirect} />
        </div>
      </div>
    </div>
  );
}
