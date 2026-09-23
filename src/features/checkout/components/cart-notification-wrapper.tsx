"use client";

import { useCart } from "@/lib/use-cart";
import { CartNotification } from "./cart-notification";
import { useRouter } from "@/i18n/navigation";

export function CartNotificationWrapper({ currentSlug }: { currentSlug: string }) {
  const { cartItem, showNotification, dismissNotification, clearCart } = useCart();
  const router = useRouter();

  if (!showNotification || !cartItem) return null;

  // Don't show notification if already on the same course page
  if (cartItem.courseSlug === currentSlug) {
    dismissNotification();
    return null;
  }

  const handleContinue = () => {
    router.push(`/commande/${cartItem.courseSlug}`);
  };

  const handleDismiss = () => {
    dismissNotification();
  };

  return (
    <CartNotification
      courseTitle={cartItem.courseTitle}
      courseSlug={cartItem.courseSlug}
      onDismiss={handleDismiss}
      onContinue={handleContinue}
    />
  );
}
