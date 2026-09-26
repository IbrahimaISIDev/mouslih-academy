"use server";

import { sleep } from "@/lib/sleep";
import { apiFetch, ApiError, USE_MOCKS } from "@/lib/api-client";
import { setSession } from "@/lib/session";
import type { SignupFormValues } from "@/features/auth/schemas";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string };
}

export type SignupResult =
  { success: true; userId: string } | { success: false; message: string };

/**
 * Ne lève jamais d'exception : un throw depuis une Server Action perd son message précis une
 * fois sérialisé vers le client en production (Next.js masque le détail par sécurité). Le
 * formulaire d'inscription a besoin du vrai message ("compte déjà existant"...), donc on
 * l'attrape ici et on le renvoie comme donnée normale.
 */
export async function signup(values: SignupFormValues): Promise<SignupResult> {
  if (!USE_MOCKS) {
    try {
      const data = await apiFetch<AuthTokens>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
      });
      await setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.user.id,
      });
      return { success: true, userId: data.user.id };
    } catch (error) {
      return {
        success: false,
        message: error instanceof ApiError ? error.message : "unknown",
      };
    }
  }

  await sleep(400);

  const userId = `u-${values.email.toLowerCase()}`;
  await setSession({ accessToken: "mock", refreshToken: "mock", userId });
  return { success: true, userId };
}
