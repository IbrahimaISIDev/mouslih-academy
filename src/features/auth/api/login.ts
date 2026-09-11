import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { aminata } from "@/mocks/learner";
import type { LoginFormValues } from "@/features/auth/schemas";

export async function login(
  values: LoginFormValues,
): Promise<{ userId: string }> {
  if (!USE_MOCKS) {
    return apiFetch<{ userId: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });
  }

  await sleep(400);

  if (
    values.email.toLowerCase() !== aminata.email.toLowerCase() ||
    values.password.length < 8
  ) {
    throw new Error("E-mail ou mot de passe incorrect");
  }

  return { userId: aminata.id };
}
