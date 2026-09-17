"use client";

/**
 * Fetch strictement navigateur, pour les deux composants client qui parlent à l'API en dehors
 * du rendu serveur (création de commande au montage de WaveRedirectView, polling du statut de
 * commande dans PaymentResult). Ne doit RIEN importer qui touche `next/headers`, même par un
 * import dynamique : Next.js refuse de bundler ce module pour le client si c'est le cas, quel
 * que soit le chemin d'import — d'où ce fichier séparé et volontairement minimal.
 *
 * Passe par /api/backend (voir app/api/backend/[...path]/route.ts) : le cookie de session
 * httpOnly voyage tout seul (même origine), la route relaie le Bearer vers l'API réelle.
 */

export class ClientApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ClientApiError";
  }
}

export async function clientApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/backend${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    // NestJS renvoie { statusCode, message, error } sur les erreurs métier (ConflictException,
    // BadRequestException...) : on remonte ce message quand il existe, pour l'afficher tel quel
    // côté admin plutôt qu'un générique "PATCH /x → 409".
    const fallback = `${init?.method ?? "GET"} ${path} → ${response.status}`;
    const body = await response.json().catch(() => null);
    const message = body && typeof body.message === "string" ? body.message : fallback;
    throw new ClientApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
