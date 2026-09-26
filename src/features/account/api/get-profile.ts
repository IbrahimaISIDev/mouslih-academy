import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { getSession } from "@/lib/session";
import { backendFetch } from "@/lib/backend-fetch";
import { aminata, type LearnerProfile } from "@/mocks/learner";

export async function getProfile(): Promise<LearnerProfile> {
  if (USE_MOCKS) {
    await sleep(400);
    return aminata;
  }

  return apiFetch<LearnerProfile>("/api/me/profile");
}

/**
 * Variante "douce" pour les pages accessibles sans compte (commande publique) : ne redirige
 * jamais. `apiFetch` redirige vers /connexion sur un 401 (correct pour une page qui EXIGE une
 * session) — un simple `getProfile().catch(() => null)` intercepterait cette redirection avant
 * qu'elle n'atteigne Next.js, la rendant silencieusement inopérante. On vérifie donc la présence
 * d'une session AVANT d'appeler l'API, sans jamais passer par apiFetch.
 */
export async function getProfileOptional(): Promise<LearnerProfile | null> {
  const session = await getSession();
  if (!session) return null;

  if (USE_MOCKS) {
    await sleep(400);
    return aminata;
  }

  try {
    const response = await backendFetch("/api/me/profile");
    if (!response.ok) return null;
    return (await response.json()) as LearnerProfile;
  } catch {
    return null;
  }
}
