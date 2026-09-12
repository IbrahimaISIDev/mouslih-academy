import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { Enrollment } from "@/lib/types";
import { aminataEnrollments } from "@/mocks/enrollments";

/**
 * Variante client-safe de get-enrollments.ts, pour useEnrollment (hook TanStack Query utilisé
 * par le lecteur de leçon, un composant client). get-enrollments.ts importe apiFetch, qui
 * touche `next/headers` côté serveur — voir lib/client-fetch.ts pour le détail de la contrainte.
 */
export async function getEnrollmentsClient(): Promise<Enrollment[]> {
  if (USE_MOCKS) {
    await sleep(400);
    return aminataEnrollments;
  }

  return clientApiFetch<Enrollment[]>("/api/me/enrollments");
}
