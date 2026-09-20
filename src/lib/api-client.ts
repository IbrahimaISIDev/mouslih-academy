/**
 * Point de bascule unique entre fixtures et backend réel. Chaque fonction de
 * `features/.../api` a la même signature dans les deux modes ; brancher le vrai
 * backend ne touche donc aucun composant, seulement ces fichiers.
 *
 * Isomorphe : côté serveur (la grande majorité des appels, Server Components), on parle à
 * l'API directement avec le jeton de session (voir backend-fetch.ts, server-only). Côté
 * navigateur (le lecteur de paiement, seul consommateur client aujourd'hui), l'appel passe par
 * notre propre route /api/backend — le cookie de session httpOnly (1re partie) y voyage tout
 * seul, `backend-fetch.ts` y relaie le Bearer vers l'API sur son propre domaine.
 */
import { redirect } from "next/navigation";
export { USE_MOCKS } from "@/lib/use-mocks";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function toResult<T>(response: Response, method: string, path: string): Promise<T> {
  if (!response.ok) {
    throw new ApiError(response.status, `${method} ${path} → ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? "GET";

  if (typeof window === "undefined") {
    const { backendFetch } = await import("@/lib/backend-fetch");
    const response = await backendFetch(path, init);
    // backendFetch a déjà tenté un rafraîchissement transparent sur 401 (voir backend-fetch.ts) :
    // un 401 qui survit à cette tentative signifie une session définitivement morte (jeton de
    // rafraîchissement expiré ou révoqué par une connexion sur un autre appareil, voir
    // AuthService.revokeAllSessions). On renvoie l'utilisateur se reconnecter plutôt que de
    // planter la page — voir la note « connu, à améliorer » dans middleware.ts.
    if (response.status === 401) {
      redirect("/connexion");
    }
    return toResult<T>(response, method, path);
  }

  const response = await fetch(`/api/backend${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return toResult<T>(response, method, path);
}
