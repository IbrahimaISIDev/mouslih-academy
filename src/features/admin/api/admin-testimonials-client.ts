import { ClientApiError, clientApiFetch } from "@/lib/client-fetch";
import { revalidateCatalog } from "@/lib/revalidate-catalog";

/** Témoignage tel que l'admin le gère (citation en français uniquement). */
export interface AdminTestimonial {
  id: string;
  kind: "text" | "video" | "tiktok";
  authorName: string;
  authorCity: string;
  quote: string;
  tiktokId: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
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

/** Vignette verticale (jpg, png ou webp, 5 Mo max) : envoi multipart, hors clientApiFetch. */
export async function uploadTestimonialThumbnail(
  id: string,
  file: File,
): Promise<AdminTestimonial> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(
    `/api/backend/api/admin/testimonials/${encodeURIComponent(id)}/thumbnail`,
    { method: "POST", body: formData },
  );
  const body = (await response.json().catch(() => null)) as
    (AdminTestimonial & { message?: unknown }) | null;
  if (!response.ok || !body) {
    const message =
      body && typeof body.message === "string"
        ? body.message
        : `POST thumbnail → ${response.status}`;
    throw new ClientApiError(response.status, message);
  }
  void revalidateCatalog().catch(() => undefined);
  return body;
}

export function removeTestimonialThumbnail(
  id: string,
): Promise<AdminTestimonial> {
  return clientApiFetch<AdminTestimonial>(
    `/api/admin/testimonials/${encodeURIComponent(id)}/thumbnail`,
    { method: "DELETE" },
  );
}
