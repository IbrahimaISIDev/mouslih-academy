import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { Course } from "@/lib/types";
import { courses } from "@/mocks/courses";

export async function getCourse(slug: string): Promise<Course | null> {
  if (USE_MOCKS) {
    await sleep(400);
    return courses.find((course) => course.slug === slug) ?? null;
  }

  try {
    return await apiFetch<Course>(`/api/courses/${slug}`);
  } catch {
    return null;
  }
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (USE_MOCKS) {
    await sleep(400);
    return courses.find((course) => course.id === id) ?? null;
  }

  try {
    return await apiFetch<Course>(`/api/courses/by-id/${id}`);
  } catch {
    return null;
  }
}
