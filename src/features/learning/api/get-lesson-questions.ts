import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { LessonQuestion } from "@/lib/types";
import { lessonQuestions } from "@/mocks/lesson-questions";

export async function getLessonQuestions(
  lessonId: string,
): Promise<LessonQuestion[]> {
  if (USE_MOCKS) {
    await sleep(400);
    return lessonQuestions.filter((question) => question.lessonId === lessonId);
  }

  return apiFetch<LessonQuestion[]>(`/api/lessons/${lessonId}/questions`);
}
