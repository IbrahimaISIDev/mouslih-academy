import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";

/** `DELETE /api/admin/courses/:id` — persistance non implémentée côté démo. */
export async function deleteCourse(courseId: string): Promise<void> {
  if (!USE_MOCKS) {
    await clientApiFetch<void>(`/api/admin/courses/${courseId}`, { method: "DELETE" });
    return;
  }

  await sleep(400);
  throw new Error("Suppression indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).");
}
