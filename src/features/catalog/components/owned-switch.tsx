"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Formations possédées par le visiteur, demandées une fois pour toute la page (plusieurs
 *  boutons l'utilisent) puis gardées quelques secondes. */
let cache: { at: number; promise: Promise<Set<string>> } | null = null;
const CACHE_MS = 10_000;

function ownedCourseIds(): Promise<Set<string>> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.promise;
  const promise = fetch("/api/owned-courses", { credentials: "same-origin" })
    .then((response) => (response.ok ? response.json() : []))
    .then((ids: unknown) => new Set(Array.isArray(ids) ? ids.map(String) : []))
    .catch(() => new Set<string>());
  cache = { at: Date.now(), promise };
  return promise;
}

/**
 * Affiche `owned` si le visiteur connecté a acheté la formation, `notOwned` sinon.
 * Vérifié dans le navigateur (et non au rendu serveur) pour que la page formation reste la même
 * pour tous — donc mise en cache et servie instantanément. Avant la réponse : `notOwned`.
 */
function OwnedSwitch({
  courseId,
  owned,
  notOwned,
}: {
  courseId: string;
  owned: ReactNode;
  notOwned: ReactNode;
}) {
  const [isOwned, setIsOwned] = useState(false);
  useEffect(() => {
    let cancelled = false;
    void ownedCourseIds().then((ids) => {
      if (!cancelled) setIsOwned(ids.has(courseId));
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);
  return <>{isOwned ? owned : notOwned}</>;
}

export { OwnedSwitch };
