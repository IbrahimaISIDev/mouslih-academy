import type { Metadata } from "next";
import { AlertCircle, BookOpen, Receipt, RefreshCcw, Search, ShieldAlert, WifiOff } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/patterns/empty-state";
import { SectionErrorDemo } from "@/features/etats/section-error-demo";
import { BlockError } from "@/components/patterns/block-error";
import { CourseCardSkeleton } from "@/components/skeletons/course-card-skeleton";
import { CourseGridSkeleton } from "@/components/skeletons/course-grid-skeleton";
import { PlayerSkeleton } from "@/components/skeletons/player-skeleton";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { StatCardSkeleton } from "@/components/skeletons/stat-card-skeleton";
import { ThrowErrorButton } from "@/features/etats/throw-error-button";

export const metadata: Metadata = { title: "États transverses — référence interne" };

function SectionTitle({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="mt-16 mb-5 flex items-baseline gap-3 border-b border-border-subtle pb-3 first:mt-0">
      <span className="font-serif text-lg text-gold-600">{letter}</span>
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
    </div>
  );
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-border-strong bg-surface p-5">
      <p className="mb-4 text-xs font-semibold text-text-muted">{label}</p>
      {children}
    </div>
  );
}

export default async function EtatsPage() {
  const [tCatalog, tError] = await Promise.all([
    getTranslations("catalog"),
    getTranslations("states"),
  ]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-11">
      <p className="mb-1 text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase">
        Référence interne — non liée dans la navigation
      </p>
      <h1 className="mb-8 font-serif text-3xl font-medium">États transverses</h1>

      <SectionTitle letter="A" title="États de chargement" />
      <div className="flex flex-col gap-8">
        <Frame label="Grille catalogue">
          <CourseGridSkeleton />
        </Frame>
        <Frame label="Card seule — squelette de référence">
          <div className="max-w-[280px]">
            <CourseCardSkeleton />
          </div>
        </Frame>
        <Frame label="Lecteur de cours — vidéo + sidebar">
          <div className="border border-border-subtle">
            <PlayerSkeleton />
          </div>
        </Frame>
        <Frame label="Tableau de bord — bandeau + carte « Continuer »">
          <div className="border border-border-subtle">
            <DashboardSkeleton />
          </div>
        </Frame>
        <Frame label="Table admin — commandes">
          <TableSkeleton
            columns={[
              { width: "1.1fr" },
              { width: "1.4fr", kind: "avatar" },
              { width: "1.6fr" },
              { width: "1fr" },
              { width: "1fr", kind: "badge" },
              { width: "110px" },
            ]}
            rows={5}
          />
        </Frame>
        <Frame label="4 StatCard">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </Frame>
      </div>

      <SectionTitle letter="B" title="États vides" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Frame label="Aucune formation achetée — dashboard">
          <div className="border border-dashed border-border-strong px-6 py-11 text-center">
            <EmptyState
              icon={BookOpen}
              title="Votre bibliothèque est vide"
              description="Choisissez une première formation — la Fatiha se termine en trois heures et pose les bases de tout le reste."
              action={<Button variant="primary">Parcourir le catalogue</Button>}
            />
          </div>
        </Frame>

        <Frame label="Aucun résultat de recherche — catalogue">
          <div className="border border-dashed border-border-strong px-6 py-11 text-center">
            <EmptyState
              icon={Search}
              title={tCatalog("empty.title", { query: "arabe littéraire" })}
              description={tCatalog("empty.description")}
              action={
                <div className="flex justify-center gap-2.5">
                  <Button variant="primary">{tCatalog("empty.reset")}</Button>
                  <Button variant="secondary">{tCatalog("empty.suggest")}</Button>
                </div>
              }
            />
          </div>
        </Frame>

        <Frame label="Aucune commande — admin">
          <div className="border border-dashed border-border-strong px-6 py-11 text-center">
            <EmptyState
              icon={Receipt}
              title="Aucune commande sur cette période"
              description="Essayez d'élargir la plage de dates ou de retirer le filtre de statut."
              action={<Button variant="secondary">Voir les 30 derniers jours</Button>}
            />
          </div>
        </Frame>

        <Frame label="Aucune question — Q&R leçon">
          <div className="border border-dashed border-border-strong px-6 py-8 text-center">
            <EmptyState
              icon={AlertCircle}
              title="Aucune question sur cette leçon"
              description="Soyez le premier à demander une précision."
              action={
                <Button variant="primary" className="w-full">
                  Poser une question
                </Button>
              }
            />
          </div>
        </Frame>
      </div>

      <SectionTitle letter="C" title="États d'erreur" />
      <div className="flex flex-col gap-8">
        <Frame label="Erreur de section (inline, TanStack Query)">
          <div className="max-w-[560px]">
            <SectionErrorDemo
              title={tError("sectionError.title")}
              body={tError("sectionError.body")}
              retryLabel={tError("sectionError.retry")}
            />
          </div>
        </Frame>

        <Frame label="Échec de chargement — réseau">
          <BlockError
            icon={WifiOff}
            title={tError("networkError.title")}
            body={tError("networkError.body")}
            variant="neutral"
            actions={
              <>
                <Button>
                  <RefreshCcw className="size-4" strokeWidth={1.8} />
                  {tError("networkError.retry")}
                </Button>
                <Button variant="secondary">{tError("networkError.offlineContent")}</Button>
              </>
            }
          />
        </Frame>

        <Frame label="Erreur serveur — lecture vidéo">
          <BlockError
            icon={ShieldAlert}
            title={tError("videoError.title")}
            body={tError("videoError.body")}
            incidentRef={tError("videoError.incidentRef")}
            variant="danger"
            actions={
              <>
                <Button>{tError("videoError.reload")}</Button>
                <Button variant="whatsapp">{tError("videoError.report")}</Button>
              </>
            }
          />
        </Frame>

        <Frame label="Bandeau hors ligne (aperçu statique — le vrai bandeau se déclenche via navigator.onLine)">
          <div className="flex items-center justify-center gap-2.5 border border-warning-border bg-warning-bg px-4 py-2.5 text-sm text-warning">
            <WifiOff className="size-4 shrink-0" strokeWidth={1.8} />
            {tError("offline.message")}
          </div>
        </Frame>

        <Frame label="Erreur de page — app/[locale]/error.tsx (déclenchement réel)">
          <p className="mb-3 text-sm text-text-muted">
            Ce bouton lève une vraie exception : la page /etats entière doit basculer sur
            l&apos;écran d&apos;erreur stylé, jamais l&apos;écran par défaut de Next.
          </p>
          <ThrowErrorButton label="Déclencher une erreur" />
        </Frame>

        <Frame label="404 — not-found.tsx (déclenchement réel)">
          <p className="mb-3 text-sm text-text-muted">Ce lien pointe vers une route inexistante.</p>
          <Link
            href="/formations/ce-cours-nexiste-pas"
            className="inline-block rounded-sm border border-border-strong px-4 py-2 text-sm font-semibold text-text-soft"
          >
            Voir la page 404
          </Link>
        </Frame>
      </div>
    </div>
  );
}
