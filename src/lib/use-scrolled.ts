"use client";

import { useEffect, useState } from "react";

/** true dès que la page a défilé au-delà de `threshold` — pour distinguer un header sticky
 *  du contenu qui glisse dessous (filet plus marqué), sans jamais utiliser d'ombre. */
export function useScrolled(threshold = 4): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > threshold);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
