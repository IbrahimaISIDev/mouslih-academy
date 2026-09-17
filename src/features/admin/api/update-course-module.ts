import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { CourseEditorData } from "./get-course-editor";

/** `PATCH /api/admin/courses/:id/modules/:moduleId` — persistance non implémentée côté démo. */
export async function updateCourseModule(courseId: string, moduleId: string, title: string): Promise<CourseEditorData> {
  if (!USE_MOCKS) {
    return clientApiFetch<CourseEditorData>(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    });
  }

  await sleep(400);
  throw new Error("Modification indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).");
}
