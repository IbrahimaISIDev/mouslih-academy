import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";

export interface PublicStats {
  learnersCount: number;
  coursesCount: number;
}

/** Compteurs réels (accueil, panneau d'inscription) — remplace les chiffres marketing codés en
 *  dur (voir HERO_LEARNERS_COUNT / statLine, corrigés le même jour que ce fichier). */
export async function getPublicStats(): Promise<PublicStats> {
  if (USE_MOCKS) {
    await sleep(200);
    return { learnersCount: 1240, coursesCount: 6 };
  }

  return apiFetch<PublicStats>("/api/courses/stats");
}
