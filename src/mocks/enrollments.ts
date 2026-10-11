import type { Enrollment } from "@/lib/types";

/** Inscriptions de l'apprenante de démo, Aminata Diallo : vidéos 1 et 2 terminées, vidéo 3 en
 *  cours (fidèle au seed backend). */
export const aminataEnrollments: Enrollment[] = [
  {
    courseId: "c-rectification-fatiha",
    completedLessonIds: ["fatiha-v01", "fatiha-v02"],
    currentLessonId: "fatiha-v03",
    resumeAtSeconds: 252,
    completedAt: null,
    lastActivityAt: "2026-09-02",
  },
];
