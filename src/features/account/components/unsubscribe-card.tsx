"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, MailX } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { clientApiFetch } from "@/lib/client-fetch";
import { Button } from "@/components/ui/button";

export interface UnsubscribeCardProps {
  userId: string;
  token: string;
}

/**
 * Désinscription en un clic de confirmation (pas automatique à l'ouverture : certaines
 * messageries ouvrent les liens pour les analyser, ce qui désinscrirait à tort).
 */
function UnsubscribeCard({ userId, token }: UnsubscribeCardProps) {
  const t = useTranslations("unsubscribe");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    userId && token ? "idle" : "error",
  );

  async function confirm() {
    setState("loading");
    try {
      await clientApiFetch<void>(
        `/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${encodeURIComponent(token)}`,
        { method: "POST" },
      );
      setState("done");
    } catch {
      setState("error");
    }
  }

  const done = state === "done";
  const Icon = done ? CheckCircle2 : MailX;

  return (
    <div className="relative w-full max-w-[440px] rounded-sm border border-border-subtle bg-surface p-7 text-center">
      <Icon
        className={
          done
            ? "mx-auto mb-4 size-9 text-success"
            : "mx-auto mb-4 size-9 text-text-faint"
        }
        strokeWidth={1.5}
      />
      <h1 className="mb-2.5 font-serif text-2xl font-medium">
        {done
          ? t("doneTitle")
          : state === "error"
            ? t("errorTitle")
            : t("title")}
      </h1>
      <p className="mb-6 text-[15px] leading-[1.6] text-text-muted">
        {done ? t("doneBody") : state === "error" ? t("errorBody") : t("body")}
      </p>
      {done || state === "error" ? (
        <Button variant="secondary" asChild>
          <Link href="/">{t("home")}</Link>
        </Button>
      ) : (
        <Button
          className="w-full"
          loading={state === "loading"}
          loadingLabel={t("loading")}
          onClick={confirm}
        >
          {t("confirm")}
        </Button>
      )}
    </div>
  );
}

export { UnsubscribeCard };
