import type { AdminLessonVideoState } from "@/lib/types";
import { FATIHA_LESSON_YOUTUBE_IDS } from "@/mocks/curriculum-fatiha";

/**
 * État vidéo par leçon, pour la démo de l'éditeur de programme admin : chaque vidéo de la
 * Fâtiḥah pointe vers sa vidéo YouTube d'exemple (phase de test).
 */
export const fatihaLessonVideoStatus: Record<string, AdminLessonVideoState> =
  Object.fromEntries(
    Object.entries(FATIHA_LESSON_YOUTUBE_IDS).map(([lessonId, youtubeId]) => [
      lessonId,
      { status: "ready", youtubeId },
    ]),
  );
