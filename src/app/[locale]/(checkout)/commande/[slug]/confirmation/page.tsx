import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/types";
import { getOrder } from "@/features/checkout/api/get-order";
import { getCourseById } from "@/features/catalog/api/get-course";
import { getProfile } from "@/features/account/api/get-profile";
import { PaymentResult } from "@/features/checkout/components/payment-result";

export const metadata: Metadata = { title: "Confirmation de paiement — Mouslih Academy" };

interface ConfirmationPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ status?: string }>;
}

function isStatusOverride(value: string | undefined): value is "success" | "pending" | "failed" {
  return value === "success" || value === "pending" || value === "failed";
}

export default async function ConfirmationPage({ params, searchParams }: ConfirmationPageProps) {
  const [{ locale: rawLocale, slug: ref }, { status }] = await Promise.all([params, searchParams]);
  const locale = rawLocale as Locale;

  const order = await getOrder(ref);
  if (!order) notFound();

  const [course, profile] = await Promise.all([getCourseById(order.courseId), getProfile()]);
  if (!course) notFound();

  return (
    <PaymentResult
      locale={locale}
      course={course}
      profile={profile}
      initialOrder={order}
      statusOverride={isStatusOverride(status) ? status : undefined}
    />
  );
}
