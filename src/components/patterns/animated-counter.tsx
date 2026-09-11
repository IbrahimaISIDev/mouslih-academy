"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/types";
import { localizeDigits } from "@/lib/format";

export interface AnimatedCounterProps {
  value: number;
  locale: Locale;
  durationMs?: number;
  className?: string;
}

function formatCount(n: number, locale: Locale): string {
  return localizeDigits(new Intl.NumberFormat("fr-FR").format(Math.round(n)), locale);
}

/**
 * Compte de 0 à `value` une fois la section visible dans le viewport (IntersectionObserver,
 * déclenché une seule fois). Respecte prefers-reduced-motion en affichant directement la
 * valeur finale, sans requestAnimationFrame.
 */
function AnimatedCounter({ value, locale, durationMs = 1200, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne doit s'armer qu'au montage
  }, []);

  useEffect(() => {
    if (!started) return;

    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {formatCount(display, locale)}
    </span>
  );
}

export { AnimatedCounter };
