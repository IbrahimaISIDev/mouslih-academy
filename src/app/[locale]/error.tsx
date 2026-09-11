"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("states.pageError");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative grid min-h-screen place-items-center bg-bg px-6 text-center">
      <GeometricPattern variant="chevrons" opacity={0.08} className="pointer-events-none" />
      <div className="relative max-w-[420px]">
        <AlertTriangle className="mx-auto mb-5 size-[34px] text-error" strokeWidth={1.4} />
        <h1 className="mb-3 font-serif text-[30px] font-medium">{t("title")}</h1>
        <p className="mb-7 text-[15px] leading-[1.65] text-text-muted">{t("body")}</p>
        <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
          <Button onClick={reset}>
            <RefreshCcw className="size-4" strokeWidth={1.8} />
            {t("retryButton")}
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">
              <Home className="size-4" strokeWidth={1.8} />
              {t("homeButton")}
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-start text-xs text-text-faint">
            <summary className="cursor-pointer text-text-muted">{t("detailsLabel")}</summary>
            <pre className="mt-2 overflow-x-auto rounded-sm border border-border-subtle bg-surface p-3 whitespace-pre-wrap">
              {error.message}
              {error.digest ? `\n\ndigest: ${error.digest}` : ""}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
