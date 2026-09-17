import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { Course } from "@/lib/types";
import { courses } from "@/mocks/courses";

export async function listAdminCourses(): Promise<Course[]> {
  if (!USE_MOCKS) {
    return apiFetch<Course[]>("/api/admin/courses");
  }

  await sleep(300);
  return courses;
}
