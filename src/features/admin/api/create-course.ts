import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { Course } from "@/lib/types";

/** `POST /api/admin/courses` — persistance non implémentée côté démo. */
export async function createCourse(title: string): Promise<Course> {
  if (!USE_MOCKS) {
    return clientApiFetch<Course>("/api/admin/courses", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  }

  await sleep(400);
  throw new Error("Création indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).");
}
