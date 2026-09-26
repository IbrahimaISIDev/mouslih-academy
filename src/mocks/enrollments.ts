import type { Enrollment } from "@/lib/types";

/** Inscriptions de l'apprenante de démo, Aminata Diallo. */
export const aminataEnrollments: Enrollment[] = [
  {
    courseId: "c-rectification-fatiha",
    completedLessonIds: ["l1", "l2", "l3", "l4", "l5"],
    currentLessonId: "l6",
    resumeAtSeconds: 252,
    completedAt: null,
    lastActivityAt: "2026-08-29",
  },
  {
    courseId: "c-initiation-nourania",
    completedLessonIds: [],
    currentLessonId: "",
    resumeAtSeconds: 0,
    completedAt: null,
    lastActivityAt: null,
  },
  {
    courseId: "c-fiqh-priere",
    completedLessonIds: [
      "fiqh-l1",
      "fiqh-l2",
      "fiqh-l3",
      "fiqh-l4",
      "fiqh-l5",
      "fiqh-l6",
      "fiqh-l7",
      "fiqh-l8",
      "fiqh-l9",
      "fiqh-l10",
      "fiqh-l11",
      "fiqh-l12",
    ],
    currentLessonId: "fiqh-l12",
    resumeAtSeconds: 0,
    completedAt: "2026-07-12",
    lastActivityAt: "2026-07-12",
  },
];
