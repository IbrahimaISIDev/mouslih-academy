import { useQuery } from "@tanstack/react-query";
import { getEnrollmentsClient } from "@/features/learning/api/get-enrollments-client";
import { ClientApiError } from "@/lib/client-fetch";

/** `enabled: false` pour un visiteur sans compte : aucune requête (elle répondrait 401). */
export function useEnrollment(courseId: string, enabled = true) {
  return useQuery({
    queryKey: ["enrollments"],
    enabled,
    // Session expirée (401) : inutile de réessayer, le lecteur bascule en mode visiteur.
    retry: (failureCount, error) =>
      !(error instanceof ClientApiError && error.status === 401) &&
      failureCount < 3,
    queryFn: getEnrollmentsClient,
    select: (enrollments) =>
      enrollments.find((enrollment) => enrollment.courseId === courseId) ??
      null,
  });
}
