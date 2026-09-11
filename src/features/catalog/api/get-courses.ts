import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { Course, Level } from "@/lib/types";
import { courses } from "@/mocks/courses";

export interface GetCoursesParams {
  level?: Level;
  q?: string;
  featured?: boolean;
}

export async function getCourses(
  params: GetCoursesParams = {},
): Promise<Course[]> {
  if (USE_MOCKS) {
    await sleep(400);

    return courses.filter((course) => {
      if (params.level && course.level !== params.level) return false;
      if (params.featured !== undefined && course.isFeatured !== params.featured)
        return false;
      if (params.q) {
        const query = params.q.toLowerCase();
        const matchesTitle = Object.values(course.title).some((value) =>
          value.toLowerCase().includes(query),
        );
        if (!matchesTitle) return false;
      }
      return true;
    });
  }

  const search = new URLSearchParams();
  if (params.level) search.set("level", params.level);
  if (params.q) search.set("q", params.q);
  if (params.featured !== undefined) search.set("featured", String(params.featured));

  return apiFetch<Course[]>(`/api/courses?${search}`);
}
