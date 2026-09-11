import { useQuery } from "@tanstack/react-query";
import { getEnrollments } from "@/features/learning/api/get-enrollments";

export function useEnrollment(courseId: string) {
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollments,
    select: (enrollments) =>
      enrollments.find((enrollment) => enrollment.courseId === courseId) ??
      null,
  });
}
