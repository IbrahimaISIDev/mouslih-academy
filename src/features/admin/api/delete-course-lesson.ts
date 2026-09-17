import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { CourseEditorData } from "./get-course-editor";

/**
 * `DELETE /api/admin/courses/:id/modules/:moduleId/submodules/:subModuleId/lessons/:lessonId` —
 * persistance non implémentée côté démo.
 */
export async function deleteCourseLesson(
  courseId: string,
  moduleId: string,
  subModuleId: string,
  lessonId: string,
): Promise<CourseEditorData> {
  if (!USE_MOCKS) {
    return clientApiFetch<CourseEditorData>(
      `/api/admin/courses/${courseId}/modules/${moduleId}/submodules/${subModuleId}/lessons/${lessonId}`,
      { method: "DELETE" },
    );
  }

  await sleep(400);
  throw new Error("Suppression indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).");
}
