import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { aminataEnrollments } from "@/mocks/enrollments";
import { courses } from "@/mocks/courses";

function countLessons(courseId: string): number {
  const course = courses.find((c) => c.id === courseId);
  if (!course) return 0;
  return course.modules.reduce(
    (total, module) =>
      total +
      module.subModules.reduce((sum, sub) => sum + sub.lessons.length, 0),
    0,
  );
}

export async function completeLesson(
  lessonId: string,
): Promise<{ progressPct: number }> {
  if (!USE_MOCKS) {
    return apiFetch<{ progressPct: number }>(`/api/me/lessons/${lessonId}/complete`, {
      method: "POST",
    });
  }

  await sleep(400);

  const enrollment = aminataEnrollments.find((e) =>
    courses
      .find((c) => c.id === e.courseId)
      ?.modules.some((m) =>
        m.subModules.some((s) => s.lessons.some((l) => l.id === lessonId)),
      ),
  );

  if (!enrollment) {
    return { progressPct: 0 };
  }

  if (!enrollment.completedLessonIds.includes(lessonId)) {
    enrollment.completedLessonIds.push(lessonId);
  }

  const totalLessons = countLessons(enrollment.courseId);
  const progressPct =
    totalLessons === 0
      ? 0
      : Math.round((enrollment.completedLessonIds.length / totalLessons) * 100);

  return { progressPct };
}
