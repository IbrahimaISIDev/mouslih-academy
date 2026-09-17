import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { ClientApiError } from "@/lib/client-fetch";
import type { CourseEditorData } from "./get-course-editor";

/**
 * `POST /api/admin/courses/:id/cover` — upload multipart, donc pas `clientApiFetch` (qui force
 * Content-Type: application/json) : le navigateur doit fixer lui-même le boundary du FormData.
 */
export async function uploadCourseCover(courseId: string, file: File): Promise<CourseEditorData> {
  if (USE_MOCKS) {
    await sleep(600);
    throw new Error("Téléversement indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/backend/api/admin/courses/${courseId}/cover`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body && typeof body.message === "string" ? body.message : `POST cover → ${response.status}`;
    throw new ClientApiError(response.status, message);
  }

  return (await response.json()) as CourseEditorData;
}
