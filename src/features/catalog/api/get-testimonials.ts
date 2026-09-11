import { sleep } from "@/lib/sleep";
import { apiFetch, USE_MOCKS } from "@/lib/api-client";
import type { Testimonial } from "@/lib/types";
import { testimonials } from "@/mocks/testimonials";

export async function getTestimonials(): Promise<Testimonial[]> {
  if (USE_MOCKS) {
    await sleep(400);
    return testimonials;
  }

  return apiFetch<Testimonial[]>("/api/testimonials");
}
