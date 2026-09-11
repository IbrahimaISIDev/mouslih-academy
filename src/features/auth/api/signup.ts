import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { SignupFormValues } from "@/features/auth/schemas";

export async function signup(
  values: SignupFormValues,
): Promise<{ userId: string }> {
  if (!USE_MOCKS) {
    return apiFetch<{ userId: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(values),
    });
  }

  await sleep(400);

  return { userId: `u-${values.email.toLowerCase()}` };
}
