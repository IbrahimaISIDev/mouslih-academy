"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ExternalLink, ImageIcon, Pencil, Quote, Trash2 } from "lucide-react";
import { ClientApiError } from "@/lib/client-fetch";
import { cn } from "@/lib/utils";
import {
  createTikTokTestimonial,
  deleteTestimonial,
  listAdminTestimonials,
  removeTestimonialThumbnail,
  updateTestimonial,
  uploadTestimonialThumbnail,
  type AdminTestimonial,
  type TestimonialChanges,
} from "@/features/admin/api/admin-testimonials-client";
import { TikTokEmbed } from "@/components/patterns/tiktok-embed";
import { EmptyState } from "@/components/patterns/empty-state";
import { SectionError } from "@/components/patterns/section-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const QUERY_KEY = ["admin-testimonials"];
const QUOTE_MAX = 400;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ClientApiError ? error.message : fallback;
}

function TestimonialsManager() {
  const t = useTranslations("admin.testimonials");
  const tError = useTranslations("states.sectionError");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: listAdminTestimonials,
  });

  return (
    <div className="grid grid-cols-[400px_1fr] items-start gap-6">
      <AddForm />

      <section className="min-w-0">
        <h2 className="mb-3.5 font-serif text-xl font-medium">
          {t("list.title")}
        </h2>
        {isError ? (
          <SectionError
            title={tError("title")}
            body={tError("body")}
            retryLabel={tError("retry")}
            onRetry={() => refetch()}
          />
        ) : isPending ? (
          <div className="h-40 animate-pulse rounded-sm border border-border-subtle bg-surface" />
        ) : data.length === 0 ? (
          <div className="rounded-sm border border-border-subtle bg-surface">
            <EmptyState
              icon={Quote}
              title={t("list.emptyTitle")}
              description={t("list.emptyBody")}
            />
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {data.map((testimonial) => (
              <TestimonialRow key={testimonial.id} testimonial={testimonial} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AddForm() {
  const t = useTranslations("admin.testimonials");
  const queryClient = useQueryClient();
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorCity, setAuthorCity] = useState("");
  const [quote, setQuote] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [image, setImage] = useState<File | null>(null);

  const create = useMutation({
    // Le témoignage d'abord, puis sa vignette (facultative) : un échec d'image n'empêche pas
    // l'ajout, elle pourra être renvoyée depuis la liste.
    mutationFn: async (
      input: Parameters<typeof createTikTokTestimonial>[0],
    ) => {
      const created = await createTikTokTestimonial(input);
      if (!image) return created;
      try {
        return await uploadTestimonialThumbnail(created.id, image);
      } catch (error) {
        toast.error(errorMessage(error, t("toast.imageError")));
        return created;
      }
    },
    onSuccess: (created) => {
      queryClient.setQueryData<AdminTestimonial[]>(QUERY_KEY, (prev) => [
        created,
        ...(prev ?? []),
      ]);
      setTiktokUrl("");
      setAuthorName("");
      setAuthorCity("");
      setQuote("");
      setImage(null);
      toast.success(
        created.isPublished ? t("toast.published") : t("toast.saved"),
      );
    },
    onError: (error) => toast.error(errorMessage(error, t("toast.error"))),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate({
          tiktokUrl: tiktokUrl.trim(),
          authorName: authorName.trim(),
          authorCity: authorCity.trim() || undefined,
          quote: quote.trim() || undefined,
          isPublished,
        });
      }}
      className="rounded-sm border border-border-subtle bg-surface p-5.5"
    >
      <h2 className="mb-1 font-serif text-xl font-medium">{t("form.title")}</h2>
      <p className="mb-5 text-sm leading-[1.55] text-text-muted">
        {t("form.help")}
      </p>

      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="testimonial-url" className="mb-2 block">
            {t("form.url")}
          </Label>
          <Input
            id="testimonial-url"
            type="url"
            dir="ltr"
            required
            inputMode="url"
            placeholder="https://www.tiktok.com/@mouslih.academie/video/…"
            value={tiktokUrl}
            onChange={(e) => setTiktokUrl(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="testimonial-name" className="mb-2 block">
              {t("form.name")}
            </Label>
            <Input
              id="testimonial-name"
              required
              maxLength={60}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="testimonial-city" className="mb-2 block">
              {t("form.city")}
            </Label>
            <Input
              id="testimonial-city"
              maxLength={60}
              placeholder={t("form.cityPlaceholder")}
              value={authorCity}
              onChange={(e) => setAuthorCity(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="testimonial-quote" className="mb-2 block">
            {t("form.quote")}
          </Label>
          <Textarea
            id="testimonial-quote"
            rows={3}
            maxLength={QUOTE_MAX}
            placeholder={t("form.quotePlaceholder")}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-text-faint">
            {t("form.quoteHelp")}
          </p>
        </div>
        <div>
          <Label htmlFor="testimonial-image" className="mb-2 block">
            {t("form.image")}
          </Label>
          <ImagePicker
            id="testimonial-image"
            file={image}
            onChange={setImage}
          />
          <p className="mt-1.5 text-xs text-text-faint">
            {t("form.imageHelp")}
          </p>
        </div>
        <label className="flex items-center gap-3 text-sm text-text-soft">
          <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          {t("form.publishNow")}
        </label>
        <Button
          type="submit"
          loading={create.isPending}
          loadingLabel={t("form.adding")}
        >
          {t("form.submit")}
        </Button>
      </div>
    </form>
  );
}

function TestimonialRow({ testimonial }: { testimonial: AdminTestimonial }) {
  const t = useTranslations("admin.testimonials");
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const replace = (updated: AdminTestimonial) =>
    queryClient.setQueryData<AdminTestimonial[]>(QUERY_KEY, (prev) =>
      (prev ?? []).map((item) => (item.id === updated.id ? updated : item)),
    );

  const update = useMutation({
    mutationFn: (changes: TestimonialChanges) =>
      updateTestimonial(testimonial.id, changes),
    onSuccess: (updated) => {
      replace(updated);
      setEditing(false);
    },
    onError: (error) => toast.error(errorMessage(error, t("toast.error"))),
  });

  const [previewVideo, setPreviewVideo] = useState(false);
  const thumbnail = useMutation({
    mutationFn: (file: File | null) =>
      file
        ? uploadTestimonialThumbnail(testimonial.id, file)
        : removeTestimonialThumbnail(testimonial.id),
    onSuccess: (updated) => {
      replace(updated);
      toast.success(t("toast.imageSaved"));
    },
    onError: (error) => toast.error(errorMessage(error, t("toast.imageError"))),
  });

  const remove = useMutation({
    mutationFn: () => deleteTestimonial(testimonial.id),
    onSuccess: () => {
      queryClient.setQueryData<AdminTestimonial[]>(QUERY_KEY, (prev) =>
        (prev ?? []).filter((item) => item.id !== testimonial.id),
      );
      toast.success(t("toast.deleted"));
    },
    onError: (error) => toast.error(errorMessage(error, t("toast.error"))),
  });

  return (
    <li className="flex gap-5 rounded-sm border border-border-subtle bg-surface p-4.5">
      <div className="flex w-[150px] shrink-0 flex-col gap-2">
        {testimonial.kind === "tiktok" && testimonial.tiktokId ? (
          <>
            {testimonial.thumbnailUrl && !previewVideo ? (
              <button
                type="button"
                onClick={() => setPreviewVideo(true)}
                className="group relative aspect-9/16 overflow-hidden rounded-sm bg-green-900"
                aria-label={t("row.testVideo")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- aperçu admin, image déjà optimisée par Cloudinary */}
                <img
                  src={testimonial.thumbnailUrl}
                  alt=""
                  className="size-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1.5 text-center text-[11px] font-semibold text-white">
                  {t("row.testVideo")}
                </span>
              </button>
            ) : (
              <TikTokEmbed
                videoId={testimonial.tiktokId}
                title={testimonial.authorName}
              />
            )}
            <label
              className={cn(
                "cursor-pointer rounded-sm border border-border-strong px-2 py-1.5 text-center text-xs font-semibold text-text-soft hover:bg-row-hover",
                thumbnail.isPending && "pointer-events-none opacity-60",
              )}
            >
              {thumbnail.isPending
                ? t("row.imageUploading")
                : testimonial.thumbnailUrl
                  ? t("row.changeImage")
                  : t("row.addImage")}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) thumbnail.mutate(file);
                }}
              />
            </label>
            {testimonial.thumbnailUrl && (
              <button
                type="button"
                disabled={thumbnail.isPending}
                onClick={() => thumbnail.mutate(null)}
                className="text-xs text-text-muted hover:text-error"
              >
                {t("row.removeImage")}
              </button>
            )}
          </>
        ) : (
          <div className="grid aspect-9/16 place-items-center bg-bg px-3 text-center text-xs text-text-muted">
            {t("row.textOnly")}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2 flex items-start justify-between gap-3">
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-xs font-semibold",
              testimonial.isPublished
                ? "border-success-border bg-success-bg text-success"
                : "border-border-subtle bg-bg text-text-muted",
            )}
          >
            {testimonial.isPublished ? t("row.published") : t("row.hidden")}
          </span>
          <label className="flex items-center gap-2.5 text-[13px] text-text-soft">
            {t("row.showOnSite")}
            <Switch
              checked={testimonial.isPublished}
              disabled={update.isPending}
              onCheckedChange={(isPublished) => update.mutate({ isPublished })}
            />
          </label>
        </div>

        {editing ? (
          <EditForm
            testimonial={testimonial}
            saving={update.isPending}
            onCancel={() => setEditing(false)}
            onSave={(changes) => update.mutate(changes)}
          />
        ) : (
          <>
            <p className="font-semibold">{testimonial.authorName}</p>
            {testimonial.authorCity && (
              <p className="text-[13px] text-text-muted">
                {testimonial.authorCity}
              </p>
            )}
            <p
              className={cn(
                "mt-3 font-serif text-[15px] leading-[1.55]",
                !testimonial.quote && "text-text-faint italic",
              )}
            >
              {testimonial.quote
                ? `« ${testimonial.quote} »`
                : t("row.noQuote")}
            </p>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-3.5" />
                {t("row.edit")}
              </Button>
              {testimonial.videoUrl?.startsWith("https://www.tiktok.com/") && (
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={testimonial.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3.5" />
                    {t("row.openTiktok")}
                  </a>
                </Button>
              )}
              {confirmDelete ? (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    loading={remove.isPending}
                    onClick={() => remove.mutate()}
                  >
                    {t("row.confirmDelete")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                  >
                    {t("row.cancel")}
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="size-3.5" />
                  {t("row.delete")}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  );
}

function EditForm({
  testimonial,
  saving,
  onCancel,
  onSave,
}: {
  testimonial: AdminTestimonial;
  saving: boolean;
  onCancel: () => void;
  onSave: (changes: TestimonialChanges) => void;
}) {
  const t = useTranslations("admin.testimonials");
  const [authorName, setAuthorName] = useState(testimonial.authorName);
  const [authorCity, setAuthorCity] = useState(testimonial.authorCity);
  const [quote, setQuote] = useState(testimonial.quote);
  const id = testimonial.id;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          authorName: authorName.trim(),
          authorCity: authorCity.trim(),
          quote: quote.trim(),
        });
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`name-${id}`} className="mb-1.5 block">
            {t("form.name")}
          </Label>
          <Input
            id={`name-${id}`}
            required
            maxLength={60}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={`city-${id}`} className="mb-1.5 block">
            {t("form.city")}
          </Label>
          <Input
            id={`city-${id}`}
            maxLength={60}
            value={authorCity}
            onChange={(e) => setAuthorCity(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`quote-${id}`} className="mb-1.5 block">
          {t("form.quote")}
        </Label>
        <Textarea
          id={`quote-${id}`}
          rows={3}
          maxLength={QUOTE_MAX}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={saving}>
          {t("row.save")}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          {t("row.cancel")}
        </Button>
      </div>
    </form>
  );
}

export { TestimonialsManager };

/** Choix d'une image (aperçu immédiat, 5 Mo max, jpg / png / webp). */
function ImagePicker({
  id,
  file,
  onChange,
}: {
  id: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const t = useTranslations("admin.testimonials");
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="flex items-center gap-3">
      <div className="grid aspect-9/16 w-14 shrink-0 place-items-center overflow-hidden rounded-sm border border-border-subtle bg-bg">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:)
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <ImageIcon className="size-4 text-text-faint" strokeWidth={1.6} />
        )}
      </div>
      <div className="flex flex-col items-start gap-1">
        <label
          htmlFor={id}
          className="cursor-pointer rounded-sm border border-border-strong px-3 py-1.5 text-[13px] font-semibold text-text-soft hover:bg-row-hover"
        >
          {file ? t("row.changeImage") : t("form.chooseImage")}
        </label>
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const next = e.target.files?.[0] ?? null;
            e.target.value = "";
            if (next && next.size > 5 * 1024 * 1024) {
              toast.error(t("toast.imageTooBig"));
              return;
            }
            onChange(next);
          }}
        />
        {file && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-text-muted hover:text-error"
          >
            {t("row.removeImage")}
          </button>
        )}
      </div>
    </div>
  );
}
