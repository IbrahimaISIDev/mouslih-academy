import { sleep } from "@/lib/sleep";
import { ApiError, apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { LessonPlayback } from "@/lib/types";
import { aminataEnrollments } from "@/mocks/enrollments";
import { courses } from "@/mocks/courses";
import { fatihaLessonVideoStatus } from "@/mocks/admin-course-editor";

/**
 * Source vidéo d'une leçon, après vérification d'accès côté API (`GET /me/lessons/:id/playback`).
 * Renvoie `null` quand la leçon n'est pas accessible à l'utilisateur courant (leçon payante d'une
 * formation non achetée) : l'API répond 404 dans ce cas, sans distinguer « inexistante ».
 */
export async function getLessonPlayback(
  lessonId: string,
): Promise<LessonPlayback | null> {
  if (USE_MOCKS) {
    await sleep(200);

    const course = courses.find((c) =>
      c.modules.some((m) =>
        m.subModules.some((s) => s.lessons.some((l) => l.id === lessonId)),
      ),
    );
    const lesson = course?.modules
      .flatMap((m) => m.subModules.flatMap((s) => s.lessons))
      .find((l) => l.id === lessonId);
    if (!course || !lesson) return null;

    const isEnrolled = aminataEnrollments.some((e) => e.courseId === course.id);
    if (!lesson.isFreePreview && !isEnrolled) return null;

    const youtubeId = fatihaLessonVideoStatus[lessonId]?.youtubeId;
    return youtubeId
      ? { provider: "youtube", videoId: youtubeId }
      : { provider: null };
  }

  try {
    return await apiFetch<LessonPlayback>(
      `/api/me/lessons/${lessonId}/playback`,
    );
  } catch (error) {
    // Laisse remonter tout ce qui n'est pas une réponse métier attendue — en particulier la
    // redirection interne déclenchée par apiFetch sur une session expirée.
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
