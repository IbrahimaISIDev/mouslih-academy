import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/api-client";
import { publicApiFetch } from "@/lib/public-fetch";
import type { LessonQuestion } from "@/lib/types";
import { lessonQuestions } from "@/mocks/lesson-questions";

export async function getLessonQuestions(
  lessonId: string,
): Promise<LessonQuestion[]> {
  if (USE_MOCKS) {
    await sleep(400);
    return lessonQuestions.filter((question) => question.lessonId === lessonId);
  }

  // Questions publiques (lecture seule sur le site) : mises en cache comme le catalogue.
  return publicApiFetch<LessonQuestion[]>(`/api/lessons/${lessonId}/questions`);
}
