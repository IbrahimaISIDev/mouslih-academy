import type { Enrollment, Lesson, LessonState } from "@/lib/types";

/** Cœur de la logique de verrouillage : jamais une leçon n'est masquée, seulement verrouillée. */
export function getLessonState(
  lesson: Lesson,
  enrollment: Enrollment | null,
  isPurchased: boolean,
): LessonState {
  if (!isPurchased) {
    return lesson.isFreePreview ? "free" : "locked";
  }

  if (!enrollment) {
    return "upcoming";
  }

  if (enrollment.completedLessonIds.includes(lesson.id)) {
    return "completed";
  }

  if (enrollment.currentLessonId === lesson.id) {
    return "current";
  }

  return "upcoming";
}
