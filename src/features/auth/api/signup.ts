"use server";

import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { setSession } from "@/lib/session";
import type { SignupFormValues } from "@/features/auth/schemas";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: { id: string };
}

export async function signup(
  values: SignupFormValues,
): Promise<{ userId: string }> {
  if (!USE_MOCKS) {
    const data = await apiFetch<AuthTokens>("/api/auth/signup", {
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

  const userId = `u-${values.email.toLowerCase()}`;
  await setSession({ accessToken: "mock", refreshToken: "mock", userId });
  return { userId };
}
