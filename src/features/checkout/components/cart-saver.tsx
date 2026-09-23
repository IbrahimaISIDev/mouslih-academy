"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/use-cart";

interface CartSaverProps {
  courseSlug: string;
  courseTitle: string;
}

export function CartSaver({ courseSlug, courseTitle }: CartSaverProps) {
  const { saveToCart } = useCart();

  useEffect(() => {
    saveToCart(courseSlug, courseTitle);
  }, [courseSlug, courseTitle, saveToCart]);

  return null;
}
