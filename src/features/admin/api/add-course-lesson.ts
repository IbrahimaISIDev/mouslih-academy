import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { CourseEditorData } from "./get-course-editor";

/**
 * `POST /api/admin/courses/:id/modules/:moduleId/submodules/:subModuleId/lessons` —
 * persistance non implémentée côté démo.
 */
export async function addCourseLesson(
  courseId: string,
  moduleId: string,
  subModuleId: string,
  title: string,
): Promise<CourseEditorData> {
  if (!USE_MOCKS) {
    return clientApiFetch<CourseEditorData>(
      `/api/admin/courses/${courseId}/modules/${moduleId}/submodules/${subModuleId}/lessons`,
      { method: "POST", body: JSON.stringify({ title }) },
    );
  }

  await sleep(400);
  throw new Error("Ajout indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).");
}
