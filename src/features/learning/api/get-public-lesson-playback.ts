import { ApiError, USE_MOCKS } from "@/lib/api-client";
import { publicApiFetch } from "@/lib/public-fetch";
import type { LessonPlayback } from "@/lib/types";

/**
 * Source vidéo d'une leçon en accès libre, sans compte (`GET /lessons/:id/playback`) : couvre
 * aussi les vidéos hébergées (Cloudinary), dont le catalogue public n'expose pas d'URL.
 * `null` si la leçon n'est pas (ou plus) en accès libre.
 * Mise en cache (identique pour tous, URL signée sans expiration) : passer d'une vidéo à
 * l'autre n'attend plus l'API ; le cache est vidé dès qu'une vidéo change dans l'admin.
 */
export async function getPublicLessonPlayback(
  lessonId: string,
): Promise<LessonPlayback | null> {
  if (USE_MOCKS) return null;
  try {
    return await publicApiFetch<LessonPlayback>(
      `/api/lessons/${lessonId}/playback`,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
