import { sleep } from "@/lib/sleep";
import { USE_MOCKS } from "@/lib/api-client";
import { publicApiFetch } from "@/lib/public-fetch";
import type { Testimonial } from "@/lib/types";
import { testimonials } from "@/mocks/testimonials";

export async function getTestimonials(): Promise<Testimonial[]> {
  if (USE_MOCKS) {
    await sleep(400);
    return testimonials;
  }

  return publicApiFetch<Testimonial[]>("/api/testimonials");
}
