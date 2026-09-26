"use client";

import { ShoppingCart, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface CartNotificationProps {
  courseTitle: string;
  onDismiss: () => void;
  onContinue: () => void;
}

export function CartNotification({ courseTitle, onDismiss, onContinue }: CartNotificationProps) {
  const t = useTranslations("checkout.cartNotification");

  return (
    <div className="fixed bottom-24 start-4 end-4 z-50 rounded-sm border-2 border-green-700 bg-green-50 p-4 shadow-lg sm:start-auto sm:end-4 sm:w-96">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-800 text-white">
          <ShoppingCart className="size-5" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <p className="mb-1 text-sm font-semibold text-green-900">{t("title")}</p>
          <p className="mb-3 text-xs text-green-700">{t("body", { course: courseTitle })}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 bg-green-800 hover:bg-green-900"
              onClick={onContinue}
            >
              {t("continueBtn")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-green-700 hover:bg-green-100"
              onClick={onDismiss}
            >
              {t("dismissBtn")}
            </Button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-sm p-1 text-green-700 hover:bg-green-100"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
