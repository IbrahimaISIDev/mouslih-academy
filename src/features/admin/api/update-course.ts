import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/use-mocks";
import { clientApiFetch } from "@/lib/client-fetch";
import type { CourseEditorData } from "./get-course-editor";
import type { Level, Locale } from "@/lib/types";

export interface UpdateCourseInput {
  level?: Level;
  priceXof?: number;
  compareAtPriceXof?: number | null;
  hasCertificate?: boolean;
  hasVoiceCorrection?: boolean;
  status?: "draft" | "published";
  translations?: Partial<Record<Locale, Partial<{ title: string; subtitle: string; description: string }>>>;
}

/** `PATCH /api/admin/courses/:id` — persistance non implémentée côté démo. */
export async function updateCourse(courseId: string, input: UpdateCourseInput): Promise<CourseEditorData> {
  if (!USE_MOCKS) {
    return clientApiFetch<CourseEditorData>(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  await sleep(400);
  throw new Error("Enregistrement indisponible en mode démo (NEXT_PUBLIC_USE_MOCKS=true).");
}
