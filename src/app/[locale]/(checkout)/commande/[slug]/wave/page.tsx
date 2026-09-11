import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { getCourse } from "@/features/catalog/api/get-course";
import { getProfile } from "@/features/account/api/get-profile";
import { WaveRedirectView } from "@/features/checkout/components/wave-redirect-view";

export const metadata: Metadata = { title: "Redirection vers Wave — Mouslih Academy" };

interface WaveRedirectPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function WaveRedirectPage({ params }: WaveRedirectPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;

  const [course, profile] = await Promise.all([getCourse(slug), getProfile()]);
  if (!course) notFound();

  return (
    <WaveRedirectView
      locale={locale}
      courseId={course.id}
      courseSlug={course.slug}
      userId={profile.id}
      amountXof={course.priceXof}
      amountLabel={formatPrice(course.priceXof, locale)}
    />
  );
}
