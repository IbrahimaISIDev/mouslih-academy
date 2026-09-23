"use client";

import { useState, useEffect } from "react";

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

  const saveToCart = (courseSlug: string, courseTitle: string) => {
    const item: CartItem = {
      courseSlug,
      courseTitle,
      timestamp: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(item));
    setCartItem(item);
  };

  const clearCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setCartItem(null);
    setShowNotification(false);
  };

  const dismissNotification = () => {
    setShowNotification(false);
  };

  return {
    cartItem,
    showNotification,
    saveToCart,
    clearCart,
    dismissNotification,
  };
}
