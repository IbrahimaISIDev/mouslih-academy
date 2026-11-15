import { ApiError } from "@/lib/api-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** Étiquette commune des données publiques (formations, témoignages, compteurs) : l'admin la
 *  périme dès qu'il modifie quelque chose (voir revalidate-catalog.ts). */
export const CATALOG_TAG = "catalog";

/** Au-delà, la page est de toute façon reconstruite en arrière-plan à la visite suivante. */
const REVALIDATE_SECONDS = 300;

/**
 * Lecture des données PUBLIQUES de l'API, sans cookie ni jeton : la réponse est identique pour
 * tous les visiteurs, donc mise en cache par Next.js (pages servies instantanément au lieu
 * d'être reconstruites — et d'appeler l'API — à chaque visite). Ne jamais l'utiliser pour une
 * donnée propre à un compte.
 */
export async function publicApiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS, tags: [CATALOG_TAG] },
  });
  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} → ${response.status}`);
  }
  return (await response.json()) as T;
}
