import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { Enrollment } from "@/lib/types";
import { aminataEnrollments } from "@/mocks/enrollments";

export async function getEnrollments(): Promise<Enrollment[]> {
  if (USE_MOCKS) {
    await sleep(400);
    return aminataEnrollments;
  }

  return apiFetch<Enrollment[]>("/api/me/enrollments");
}
