/**
 * Session posée par le frontend lui-même (cookie httpOnly, 1re partie) — pas par l'API, qui vit
 * sur un autre domaine. Les Server Components et Route Handlers lisent ce cookie et relaient le
 * jeton d'accès en `Authorization: Bearer` vers l'API ; voir BACKEND.md § authentification.
 *
 * Server-only (utilise `next/headers`), mais SANS le paquet `server-only` : ce module est
 * atteint par un import dynamique depuis lib/api-client.ts (isomorphe, utilisé aussi par des
 * composants client comme PaymentResult) — l'assertion stricte de `server-only` casserait le
 * build même derrière un import dynamique. La garde `typeof window === "undefined"` dans
 * api-client.ts suffit : ces fonctions ne sont jamais réellement appelées côté navigateur.
 */
import { cookies } from "next/headers";

const SESSION_COOKIE = "mouslih_session";

export interface Session {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed.accessToken || !parsed.refreshToken || !parsed.userId) return null;
    return parsed as Session;
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Aligné sur la durée du refresh token côté API (JWT_REFRESH_EXPIRES_IN, 30 j par défaut) :
    // au-delà, le refresh échouerait de toute façon.
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
