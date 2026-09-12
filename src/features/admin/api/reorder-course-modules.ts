import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";

/** `POST /api/admin/courses/:id/reorder` — persistance non implémentée côté démo. */
export async function reorderCourseModules(
  courseId: string,
  moduleIds: string[],
): Promise<void> {
  if (!USE_MOCKS) {
    await clientApiFetch<void>(`/api/admin/courses/${courseId}/reorder`, {
      method: "POST",
      body: JSON.stringify({ scope: "modules", orderedIds: moduleIds }),
    });
    return;
  }

  await sleep(400);
}

export async function reorderCourseLessons(
  courseId: string,
  subModuleId: string,
  lessonIds: string[],
): Promise<void> {
  if (!USE_MOCKS) {
    await clientApiFetch<void>(`/api/admin/courses/${courseId}/reorder`, {
      method: "POST",
      body: JSON.stringify({ scope: "lessons", subModuleId, orderedIds: lessonIds }),
    });
    return;
  }

  await sleep(400);
}
