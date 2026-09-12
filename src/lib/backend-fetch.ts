/**
 * Appel serveur-only vers l'API réelle, avec relais du jeton d'accès et rafraîchissement
 * transparent sur un 401 (rotation du refresh token, voir AuthService côté API). Utilisé à la
 * fois par apiFetch (Server Components) et par le proxy /api/backend (appels client, voir
 * app/api/backend/[...path]/route.ts) — les deux ont accès à `next/headers`.
 *
 * Pas de `import "server-only"` ici volontairement : voir la note dans lib/session.ts.
 */
import { clearSession, getSession, setSession, type Session } from "@/lib/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function refreshSession(refreshToken: string): Promise<Session | null> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) return null;

  const data = (await response.json()) as { accessToken: string; refreshToken: string; user: { id: string } };
  return { accessToken: data.accessToken, refreshToken: data.refreshToken, userId: data.user.id };
}

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  const session = await getSession();

  const withAuth = (accessToken?: string): RequestInit => ({
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...init?.headers,
    },
  });

  let response = await fetch(`${API_BASE_URL}${path}`, withAuth(session?.accessToken));

  if (response.status === 401 && session) {
    const refreshed = await refreshSession(session.refreshToken);
    if (refreshed) {
      await setSession(refreshed);
      response = await fetch(`${API_BASE_URL}${path}`, withAuth(refreshed.accessToken));
    } else {
      await clearSession();
    }
  }

  return response;
}
