import { clientApiFetch } from "@/lib/client-fetch";

/** Témoignage tel que l'admin le gère (citation en français uniquement). */
export interface AdminTestimonial {
  id: string;
  kind: "text" | "video" | "tiktok";
  authorName: string;
  authorCity: string;
  quote: string;
  tiktokId: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface NewTikTokTestimonial {
  tiktokUrl: string;
  authorName: string;
  authorCity?: string;
  quote?: string;
  isPublished: boolean;
}

export type TestimonialChanges = Partial<
  Pick<AdminTestimonial, "authorName" | "authorCity" | "quote" | "isPublished">
>;

export function listAdminTestimonials(): Promise<AdminTestimonial[]> {
  return clientApiFetch<AdminTestimonial[]>("/api/admin/testimonials");
}

export function createTikTokTestimonial(
  input: NewTikTokTestimonial,
): Promise<AdminTestimonial> {
  return clientApiFetch<AdminTestimonial>("/api/admin/testimonials", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTestimonial(
  id: string,
  changes: TestimonialChanges,
): Promise<AdminTestimonial> {
  return clientApiFetch<AdminTestimonial>(
    `/api/admin/testimonials/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(changes) },
  );
}

export function deleteTestimonial(id: string): Promise<void> {
  return clientApiFetch<void>(
    `/api/admin/testimonials/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );
}
