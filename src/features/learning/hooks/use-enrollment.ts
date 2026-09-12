import { useQuery } from "@tanstack/react-query";
import { getEnrollmentsClient } from "@/features/learning/api/get-enrollments-client";

export function useEnrollment(courseId: string) {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollmentsClient,
    select: (enrollments) =>
      enrollments.find((enrollment) => enrollment.courseId === courseId) ??
      null,
  });
}
