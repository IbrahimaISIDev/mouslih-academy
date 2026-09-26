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

/** NestJS renvoie { statusCode, message, error } sur les erreurs métier (ConflictException,
 *  BadRequestException...) — message est parfois un tableau (plusieurs violations
 *  class-validator). On le remonte tel quel plutôt qu'un générique "POST /x → 409", pour
 *  qu'un formulaire puisse l'afficher directement (voir client-fetch.ts, même logique côté
 *  navigateur). */
function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message) && message.every((m) => typeof m === "string")) {
      return message.join(" ");
    }
  }
  return fallback;
}

async function toResult<T>(
  response: Response,
  method: string,
  path: string,
): Promise<T> {
  if (!response.ok) {
    const fallback = `${method} ${path} → ${response.status}`;
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, extractErrorMessage(body, fallback));
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const method = init?.method ?? "GET";

  if (typeof window === "undefined") {
    const { backendFetch } = await import("@/lib/backend-fetch");
    const { getSession } = await import("@/lib/session");
    // Un 401 ne signifie une session morte QUE s'il y avait une session à la base : un appel
    // anonyme (login, signup — pas encore de cookie) qui reçoit un 401 pour de mauvais
    // identifiants est une réponse métier normale, pas une session à faire expirer. Sans cette
    // distinction, se tromper de mot de passe déclenchait un redirect("/connexion") DEPUIS la
    // Server Action login() elle-même — déjà sur cette page, la redirection ne menait nulle
    // part et laissait le formulaire bloqué en soumission indéfiniment.
    const hadSession = (await getSession()) !== null;
    const response = await backendFetch(path, init);
    // backendFetch a déjà tenté un rafraîchissement transparent sur 401 (voir backend-fetch.ts) :
    // un 401 qui survit à cette tentative signifie une session définitivement morte (jeton de
    // rafraîchissement expiré ou révoqué par une connexion sur un autre appareil, voir
    // AuthService.revokeAllSessions). On renvoie l'utilisateur se reconnecter plutôt que de
    // planter la page — voir la note « connu, à améliorer » dans middleware.ts.
    if (response.status === 401 && hadSession) {
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
