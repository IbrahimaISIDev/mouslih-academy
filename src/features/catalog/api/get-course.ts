import { sleep } from "@/lib/sleep";
import { ApiError, apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { Course } from "@/lib/types";
import { courses } from "@/mocks/courses";

export async function getCourse(slug: string): Promise<Course | null> {
  if (USE_MOCKS) {
    await sleep(400);
    return courses.find((course) => course.slug === slug) ?? null;
  }

  try {
    return await apiFetch<Course>(`/api/courses/${slug}`);
  } catch (error) {
    // Laisse remonter tout ce qui n'est pas une erreur métier attendue (404 introuvable,
    // notamment) — en particulier la redirection interne déclenchée par apiFetch sur un 401.
    if (error instanceof ApiError) return null;
    throw error;
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (USE_MOCKS) {
    await sleep(400);
    return courses.find((course) => course.id === id) ?? null;
  }

  try {
    return await apiFetch<Course>(`/api/courses/by-id/${id}`);
  } catch (error) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}
