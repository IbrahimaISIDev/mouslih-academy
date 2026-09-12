"use server";

import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { setSession } from "@/lib/session";
import { aminata } from "@/mocks/learner";
import type { LoginFormValues } from "@/features/auth/schemas";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string };
}

/**
 * Server Action (appelée depuis le composant client LoginForm) : pose le cookie de session
 * httpOnly côté frontend une fois l'API authentifiée — voir lib/session.ts. Signature et forme
 * de retour inchangées pour le composant, qu'on soit branché sur l'API réelle ou sur les
 * fixtures.
 */
export async function login(
  values: LoginFormValues,
): Promise<{ userId: string }> {
  if (!USE_MOCKS) {
    const data = await apiFetch<AuthTokens>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });
    await setSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      userId: data.user.id,
    });
    return { userId: data.user.id };
  }

  await sleep(400);

  if (
    values.email.toLowerCase() !== aminata.email.toLowerCase() ||
    values.password.length < 8
  ) {
    throw new Error("E-mail ou mot de passe incorrect");
  }

  await setSession({ accessToken: "mock", refreshToken: "mock", userId: aminata.id });
  return { userId: aminata.id };
}
