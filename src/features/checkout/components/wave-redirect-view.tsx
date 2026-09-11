"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { createOrder } from "@/features/checkout/api/create-order";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

const REDIRECT_DELAY_MS = 1800;
const RETRY_LINK_DELAY_MS = 8000;

export interface WaveRedirectViewProps {
  locale: string;
  courseId: string;
  courseSlug: string;
  userId: string;
  amountXof: number;
  amountLabel: string;
}

function WaveRedirectView({ locale, courseId, courseSlug, userId, amountXof, amountLabel }: WaveRedirectViewProps) {
  const t = useTranslations("checkout.redirect");
  const [ref, setRef] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    let cancelled = false;

    createOrder(courseId, userId, amountXof).then((data) => {
      if (cancelled) return;
      setRef(data.ref);
      setTimeout(() => {
        if (!cancelled) window.location.assign(`/${locale}${data.waveCheckoutUrl}`);
      }, REDIRECT_DELAY_MS);
    });

    return () => {
      cancelled = true;
    };
    // Volontairement vide : la commande ne doit être créée qu'une seule fois au montage,
    // jamais rejouée si les props se re-référencent sans changer de valeur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setShowRetry(true), RETRY_LINK_DELAY_MS);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative grid min-h-screen place-items-center bg-surface px-6 text-center">
      <GeometricPattern variant="chevrons" opacity={0.07} className="pointer-events-none" />

      <div className="relative w-full max-w-[420px]">
        <div className="mx-auto mb-7 size-14 rounded-full border-[3px] border-border-subtle border-t-green-700 [animation:spin_0.9s_linear_infinite]" />

        <h1 className="mb-3 font-serif text-2xl font-medium lg:text-[26px]">{t("title")}</h1>
        <p className="mb-7.5 text-[15px] leading-[1.65] text-text-muted">
          {t("body", { amount: amountLabel })}
        </p>

        <div className="border border-border-subtle bg-bg p-4 text-start">
          <p className="mb-2.5 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">
            {t("transactionLabel")}
          </p>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-text-muted">{t("reference")}</span>
            <span dir="ltr" className="tabular-nums">
              {ref ?? "…"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t("amount")}</span>
            <span className="font-semibold tabular-nums">{amountLabel}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.location.assign(`/${locale}/commande/${courseSlug}`)}
          className="mt-6 text-sm font-semibold text-text-muted"
        >
          {t("cancelPayment")}
        </button>

        {showRetry && ref && (
          <button
            type="button"
            onClick={() => window.location.assign(`/${locale}/commande/${ref}/confirmation`)}
            className="mt-3 block text-sm font-semibold text-green-ink"
          >
            {t("retryLink")}
          </button>
        )}
      </div>
    </div>
  );
}

export { WaveRedirectView };
