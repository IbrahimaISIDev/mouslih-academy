import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Enrollment } from "@/lib/types";
import { completeLesson } from "@/features/learning/api/complete-lesson";

export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => completeLesson(lessonId),
    onMutate: async (lessonId: string) => {
      await queryClient.cancelQueries({ queryKey: ["enrollments"] });
      const previous = queryClient.getQueryData<Enrollment[]>(["enrollments"]);

      queryClient.setQueryData<Enrollment[]>(["enrollments"], (enrollments) =>
        enrollments?.map((enrollment) =>
          enrollment.completedLessonIds.includes(lessonId) ||
          enrollment.currentLessonId !== lessonId
            ? enrollment
            : {
                ...enrollment,
                completedLessonIds: [
                  ...enrollment.completedLessonIds,
                  lessonId,
                ],
              },
        ),
      );

      return { previous };
    },
    onError: (_error, _lessonId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["enrollments"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}
