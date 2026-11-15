import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { UnsubscribeCard } from "@/features/account/components/unsubscribe-card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("unsubscribe");
  // Page personnelle (lien signé) : jamais indexée.
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

interface UnsubscribePageProps {
  searchParams: Promise<{ u?: string; t?: string }>;
}

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { u, t } = await searchParams;
  return (
    <div className="relative grid min-h-screen place-items-center bg-bg px-5 py-12">
      <GeometricPattern
        variant="chevrons"
        opacity={0.08}
        className="pointer-events-none"
      />
      <UnsubscribeCard userId={u ?? ""} token={t ?? ""} />
    </div>
  );
}
