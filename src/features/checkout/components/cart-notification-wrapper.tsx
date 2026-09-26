"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/use-cart";
import { CartNotification } from "./cart-notification";
import { useRouter } from "@/i18n/navigation";

export function CartNotificationWrapper({ currentSlug }: { currentSlug: string }) {
  const { cartItem, showNotification, dismissNotification } = useCart();
  const router = useRouter();
  const isSameCourse = cartItem?.courseSlug === currentSlug;

  // Un changement d'état pendant le rendu (plutôt que dans un effet) est interdit par React —
  // provoque un avertissement, potentiellement une boucle de rendu.
  useEffect(() => {
    if (showNotification && isSameCourse) {
      dismissNotification();
    }
  }, [showNotification, isSameCourse, dismissNotification]);

  if (!showNotification || !cartItem || isSameCourse) return null;

  const handleContinue = () => {
    router.push(`/commande/${cartItem.courseSlug}`);
  };

  return (
    <CartNotification
      courseTitle={cartItem.courseTitle}
      onDismiss={dismissNotification}
      onContinue={handleContinue}
    />
  );
}
