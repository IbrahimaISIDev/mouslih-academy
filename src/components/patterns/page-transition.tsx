"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

export interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Fondu léger entre routes — pas de librairie d'animation (interdite par le design system),
 * juste un keyframe CSS rejoué à chaque changement de chemin grâce à `key`. Respecte
 * `prefers-reduced-motion` via `motion-safe:` : sans animation, le contenu s'affiche
 * immédiatement à pleine opacité.
 */
function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="motion-safe:[animation:page-enter_260ms_ease-out]">
      {children}
    </div>
  );
}

export { PageTransition };
