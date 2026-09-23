"use client";

import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartNotificationProps {
  courseTitle: string;
  courseSlug: string;
  onDismiss: () => void;
  onContinue: () => void;
}

export function CartNotification({
  courseTitle,
  courseSlug,
  onDismiss,
  onContinue,
}: CartNotificationProps) {
  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 rounded-sm border-2 border-green-700 bg-green-50 p-4 shadow-lg sm:left-auto sm:right-4 sm:w-96">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-800 text-white">
          <ShoppingCart className="size-5" strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <p className="mb-1 text-sm font-semibold text-green-900">
            Commande en cours
          </p>
          <p className="mb-3 text-xs text-green-700">
            Vous avez une commande en cours pour "{courseTitle}"
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8 bg-green-800 hover:bg-green-900"
              onClick={onContinue}
            >
              Continuer
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-green-700 hover:bg-green-100"
              onClick={onDismiss}
            >
              Ignorer
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
