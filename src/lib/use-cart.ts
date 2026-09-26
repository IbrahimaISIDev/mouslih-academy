"use client";

import { useCallback, useEffect, useState } from "react";

const CART_STORAGE_KEY = "mouslih_cart";

interface CartItem {
  courseSlug: string;
  courseTitle: string;
  timestamp: number;
}

export function useCart() {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        const item = JSON.parse(saved) as CartItem;
        // Check if the cart is less than 24 hours old
        const isRecent = Date.now() - item.timestamp < 24 * 60 * 60 * 1000;
        if (isRecent) {
          setCartItem(item);
          setShowNotification(true);
        } else {
          // Remove old cart items
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
  }, []);

  // Références stables (useCallback) : sinon chaque render de useCart() renvoie de nouvelles
  // fonctions, et un useEffect qui les liste en dépendance (CartSaver, CartNotificationWrapper)
  // se redéclenche à l'infini — "Maximum update depth exceeded" observé sur la page de commande.
  const saveToCart = useCallback((courseSlug: string, courseTitle: string) => {
    const item: CartItem = {
      courseSlug,
      courseTitle,
      timestamp: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(item));
    setCartItem(item);
  }, []);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCartItem(null);
    setShowNotification(false);
  }, []);

  const dismissNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  return {
    cartItem,
    showNotification,
    saveToCart,
    clearCart,
    dismissNotification,
  };
}
