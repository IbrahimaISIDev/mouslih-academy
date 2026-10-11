import type { AdminLessonVideoState } from "@/lib/types";
import { FATIHA_PLACEHOLDER_YOUTUBE_ID } from "@/mocks/curriculum-fatiha";

/**
 * État vidéo par leçon, pour la démo de l'éditeur de programme admin : les 5 vidéos de la
 * Fâtiḥah pointent vers la vidéo YouTube provisoire.
 */
export const fatihaLessonVideoStatus: Record<string, AdminLessonVideoState> =
  Object.fromEntries(
    ["fatiha-v01", "fatiha-v02", "fatiha-v03", "fatiha-v04", "fatiha-v05"].map(
      (id) => [
        id,
        { status: "ready", youtubeId: FATIHA_PLACEHOLDER_YOUTUBE_ID },
      ],
    ),
  );
