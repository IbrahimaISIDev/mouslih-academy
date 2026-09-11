import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import { aminataEnrollments } from "@/mocks/enrollments";
import { courses } from "@/mocks/courses";

export async function saveLessonPosition(
  lessonId: string,
  positionSeconds: number,
): Promise<void> {
  if (!USE_MOCKS) {
    await apiFetch<void>(`/api/me/lessons/${lessonId}/position`, {
      method: "POST",
      body: JSON.stringify({ positionSeconds }),
    });
    return;
  }

  await sleep(400);

  const enrollment = aminataEnrollments.find((e) =>
    courses
      .find((c) => c.id === e.courseId)
      ?.modules.some((m) =>
        m.subModules.some((s) => s.lessons.some((l) => l.id === lessonId)),
      ),
  );

  if (!enrollment) return;

  enrollment.currentLessonId = lessonId;
  enrollment.resumeAtSeconds = positionSeconds;
}
