import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { aminata, type LearnerProfile } from "@/mocks/learner";

export async function getProfile(): Promise<LearnerProfile> {
  if (USE_MOCKS) {
    await sleep(400);
    return aminata;
  }

  return apiFetch<LearnerProfile>("/api/me/profile");
}
