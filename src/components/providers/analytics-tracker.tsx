"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

/** Compte un affichage de page à chaque changement d'URL (navigation côté client comprise). */
function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) track("page_view", { path: pathname });
  }, [pathname]);
  return null;
}

export { AnalyticsTracker };
