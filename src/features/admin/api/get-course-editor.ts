import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
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
    } catch {
      return null;
    }
  }

  await sleep(400);

  const course = courses.find((c) => c.id === courseId);
  if (!course) return null;

  const videoStatus =
    course.id === "c-rectification-fatiha" ? fatihaLessonVideoStatus : {};

  return { course, videoStatus };
}
