import { clientApiFetch } from "@/lib/client-fetch";
import type { CourseEditorData } from "./get-course-editor";

/**
 * Variante client-safe de get-course-editor.ts, pour l'actualisation automatique de l'éditeur
 * pendant la préparation d'une vidéo (composant client). get-course-editor.ts importe apiFetch,
 * qui touche `next/headers` côté serveur — voir lib/client-fetch.ts pour la contrainte.
 */
export async function getCourseEditorClient(
  courseId: string,
): Promise<CourseEditorData> {
  return clientApiFetch<CourseEditorData>(
    `/api/admin/courses/${courseId}/editor`,
  );
}
