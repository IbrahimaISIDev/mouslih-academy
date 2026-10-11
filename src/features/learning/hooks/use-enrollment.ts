import { useQuery } from "@tanstack/react-query";
import { getEnrollmentsClient } from "@/features/learning/api/get-enrollments-client";

/** `enabled: false` pour un visiteur sans compte : aucune requête (elle répondrait 401). */
export function useEnrollment(courseId: string, enabled = true) {
  return useQuery({
    queryKey: ["enrollments"],
    enabled,
    queryFn: getEnrollmentsClient,
    select: (enrollments) =>
      enrollments.find((enrollment) => enrollment.courseId === courseId) ??
      null,
  });
}
