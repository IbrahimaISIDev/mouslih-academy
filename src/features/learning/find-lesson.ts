import type { Course, Lesson, Module } from "@/lib/types";

export interface LessonLocation {
  lesson: Lesson;
  module: Module;
  moduleIndex: number;
  lessonIndex: number;
  totalLessons: number;
}

/** Localise une leçon dans le programme d'une formation, avec sa position globale (1-indexée). */
export function findLessonLocation(
  course: Course,
  lessonId: string,
): LessonLocation | null {
  const flat = course.modules.flatMap((module, moduleIndex) =>
    module.subModules.flatMap((sub) =>
      sub.lessons.map((lesson) => ({ lesson, module, moduleIndex })),
    ),
  );

  const position = flat.findIndex((entry) => entry.lesson.id === lessonId);
  if (position === -1) return null;

  const { lesson, module, moduleIndex } = flat[position];

  return {
    lesson,
    module,
    moduleIndex,
    lessonIndex: position + 1,
    totalLessons: flat.length,
  };
}
