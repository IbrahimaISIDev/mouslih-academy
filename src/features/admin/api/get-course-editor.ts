import { sleep } from "@/lib/sleep";
import { ApiError, apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { AdminLessonVideoState, Course } from "@/lib/types";
import { courses } from "@/mocks/courses";
import { fatihaLessonVideoStatus } from "@/mocks/admin-course-editor";

export interface CourseEditorData {
  course: Course;
  videoStatus: Record<string, AdminLessonVideoState>;
}

export async function getCourseEditor(courseId: string): Promise<CourseEditorData | null> {
  if (!USE_MOCKS) {
    try {
      return await apiFetch<CourseEditorData>(`/api/admin/courses/${courseId}/editor`);
    } catch (error) {
      // Laisse remonter tout ce qui n'est pas une erreur métier attendue (404 introuvable,
      // notamment) — en particulier la redirection interne déclenchée par apiFetch sur un 401.
      if (error instanceof ApiError) return null;
      throw error;
    }
  }

  await sleep(400);

  const course = courses.find((c) => c.id === courseId);
  if (!course) return null;

  const videoStatus =
    course.id === "c-rectification-fatiha" ? fatihaLessonVideoStatus : {};

  return { course, videoStatus };
}
