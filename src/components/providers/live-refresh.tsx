"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Rafraîchissement régulier tant que la page est visible. */
const INTERVAL_MS = 30_000;
/** Au retour sur l'onglet, seulement s'il est resté caché un moment. */
const MIN_HIDDEN_MS = 15_000;

/**
 * Garde les pages publiques à jour pour un visiteur resté dessus : une modification faite dans
 * l'admin (témoignage, texte, prix, vidéo…) apparaît au plus tard en 30 secondes, et dès le retour
 * sur l'onglet. `router.refresh()` relit la page (servie depuis le cache, donc légère) et met à
 * jour l'affichage sans recharger ni perdre la position, les vidéos en cours ou les saisies.
 */
function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    let hiddenAt = 0;
    const refresh = () => {
      if (document.visibilityState === "visible" && navigator.onLine) router.refresh();
    };
    const timer = window.setInterval(refresh, INTERVAL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
      } else if (hiddenAt && Date.now() - hiddenAt > MIN_HIDDEN_MS) {
        refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router]);

  return null;
}

export { LiveRefresh };
