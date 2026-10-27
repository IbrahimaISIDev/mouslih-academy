"use client";

import { type ReactNode, useId, useRef, useState } from "react";
import Image from "next/image";
import { FileVideo, Link2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { parseYouTubeVideoId, youTubeThumbnailUrl } from "@/lib/youtube";
import type { LessonVideoInput } from "@/features/admin/api/update-course-lesson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DURATION_PATTERN = /^(\d{1,3}):([0-5]\d)$/;

type Mode = "upload" | "youtube";

function toClock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function toMegabytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(bytes < 10 * 1024 * 1024 ? 1 : 0)} Mo`;
}

export interface LessonVideoDialogProps {
  trigger: ReactNode;
  lessonTitle: string;
  initialYoutubeId?: string;
  initialDurationSeconds: number;
  initialIsFreePreview: boolean;
  /** Hébergeur de la vidéo actuelle (absent : pas encore de vidéo). */
  currentProvider?: "youtube" | "cloudinary" | "stream";
  /** Envoi de fichier disponible (Cloudinary configuré) ; sinon, lien YouTube seulement. */
  uploadEnabled: boolean;
  /** Lien YouTube. Doit rejeter (après son propre toast) pour garder le dialogue ouvert. */
  onSubmit: (input: LessonVideoInput) => Promise<void>;
  /** Envoi d'un fichier vidéo. Même convention de rejet. */
  onUpload: (
    file: File,
    onProgress: (percent: number) => void,
    signal: AbortSignal,
  ) => Promise<void>;
  /** Changement de l'accès libre seul (sans nouvelle vidéo). Même convention de rejet. */
  onAccessChange: (isFreePreview: boolean) => Promise<void>;
}

/** Vidéo d'une leçon : envoi d'un fichier (Cloudinary) ou lien YouTube, et accès libre. */
function LessonVideoDialog({
  trigger,
  lessonTitle,
  initialYoutubeId,
  initialDurationSeconds,
  initialIsFreePreview,
  currentProvider,
  uploadEnabled,
  onSubmit,
  onUpload,
  onAccessChange,
}: LessonVideoDialogProps) {
  const t = useTranslations("admin.course.curriculum.videoDialog");
  const urlId = useId();
  const durationId = useId();
  const freeId = useId();
  const fileId = useId();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("youtube");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isFree, setIsFree] = useState(initialIsFreePreview);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const videoId = url.trim() ? parseYouTubeVideoId(url) : null;
  const durationMatch = DURATION_PATTERN.exec(duration.trim());
  const urlInvalid = url.trim().length > 0 && !videoId;
  const durationInvalid = duration.trim().length > 0 && !durationMatch;
  const accessChanged = isFree !== initialIsFreePreview;
  const uploading = progress !== null;

  const canSubmit =
    !submitting &&
    (mode === "youtube"
      ? !!videoId && !!durationMatch
      : !!file || (accessChanged && !!currentProvider));

  function handleOpenChange(next: boolean) {
    if (!next && uploading) {
      // Fermer pendant un envoi = l'annuler (sinon il continuerait sans retour visible).
      abortRef.current?.abort();
    }
    if (next) {
      setMode(
        uploadEnabled && currentProvider !== "youtube" ? "upload" : "youtube",
      );
      setUrl(initialYoutubeId ? `https://youtu.be/${initialYoutubeId}` : "");
      setDuration(
        initialDurationSeconds > 0 ? toClock(initialDurationSeconds) : "",
      );
      setFile(null);
      setProgress(null);
      setIsFree(initialIsFreePreview);
    }
    setOpen(next);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      if (mode === "youtube") {
        if (!videoId || !durationMatch) return;
        await onSubmit({
          youtubeUrl: videoId,
          durationSeconds:
            Number(durationMatch[1]) * 60 + Number(durationMatch[2]),
          isFreePreview: isFree,
        });
      } else if (file) {
        const controller = new AbortController();
        abortRef.current = controller;
        setProgress(0);
        await onUpload(file, setProgress, controller.signal);
        if (accessChanged) await onAccessChange(isFree);
      } else if (accessChanged) {
        await onAccessChange(isFree);
      }
      setOpen(false);
    } catch {
      // Toast d'erreur déjà affiché par l'appelant : on garde le dialogue ouvert.
    } finally {
      setSubmitting(false);
      setProgress(null);
      abortRef.current = null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{lessonTitle}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {uploadEnabled && (
            <div
              role="tablist"
              className="grid grid-cols-2 gap-1 rounded-sm bg-bg p-1"
            >
              {(
                [
                  ["upload", Upload, t("modeUpload")],
                  ["youtube", Link2, t("modeYoutube")],
                ] as const
              ).map(([value, Icon, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={mode === value}
                  disabled={uploading}
                  onClick={() => setMode(value)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold transition-colors",
                    mode === value
                      ? "bg-surface text-green-ink shadow-sm"
                      : "text-text-muted hover:text-text",
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.8} />
                  {label}
                </button>
              ))}
            </div>
          )}

          {mode === "upload" ? (
            <div className="flex flex-col gap-3">
              {currentProvider === "cloudinary" && !file && (
                <p className="rounded-sm border border-hairline bg-bg px-3.5 py-2.5 text-[13px] text-text-soft">
                  {t("currentHosted", {
                    duration: toClock(initialDurationSeconds),
                  })}
                </p>
              )}
              <Label htmlFor={fileId} className="block">
                {t("fileLabel")}
              </Label>
              <label
                htmlFor={fileId}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-2 rounded-sm border border-dashed border-border-strong bg-bg px-4 py-6 text-center transition-colors hover:border-green-700",
                  uploading && "pointer-events-none opacity-60",
                )}
              >
                <FileVideo
                  className="size-7 text-green-ink"
                  strokeWidth={1.5}
                />
                {file ? (
                  <span className="text-sm font-semibold text-text">
                    {file.name} · {toMegabytes(file.size)}
                  </span>
                ) : (
                  <span className="text-sm text-text-soft">
                    {t("filePick")}
                  </span>
                )}
                <span className="text-xs text-text-muted">{t("fileHelp")}</span>
              </label>
              <input
                id={fileId}
                type="file"
                accept="video/*"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />

              {progress !== null && (
                <div>
                  <div
                    className="h-2 overflow-hidden rounded-sm bg-border-subtle"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full bg-green-700 transition-[width]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[13px]">
                    <span className="text-text-muted">
                      {progress < 100
                        ? t("uploadingLabel", { pct: progress })
                        : t("finalizingLabel")}
                    </span>
                    <button
                      type="button"
                      onClick={() => abortRef.current?.abort()}
                      className="font-semibold text-error hover:underline"
                    >
                      {t("cancelUpload")}
                    </button>
                  </div>
                </div>
              )}
              <p className="text-[13px] text-text-muted">
                {t("processingNote")}
              </p>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor={urlId} className="mb-2 block">
                  {t("urlLabel")}
                </Label>
                <Input
                  id={urlId}
                  dir="ltr"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtu.be/…"
                  aria-invalid={urlInvalid}
                  autoFocus
                />
                <p
                  className={
                    urlInvalid
                      ? "mt-1.5 text-[13px] text-error"
                      : "mt-1.5 text-[13px] text-text-muted"
                  }
                >
                  {urlInvalid ? t("urlInvalid") : t("urlHelp")}
                </p>
              </div>

              {videoId && (
                <div className="relative aspect-video overflow-hidden border border-border-subtle bg-green-900">
                  <Image
                    src={youTubeThumbnailUrl(videoId)}
                    alt={t("previewAlt")}
                    fill
                    sizes="480px"
                    className="object-cover"
                  />
                </div>
              )}

              <div>
                <Label htmlFor={durationId} className="mb-2 block">
                  {t("durationLabel")}
                </Label>
                <Input
                  id={durationId}
                  dir="ltr"
                  inputMode="numeric"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="12:05"
                  aria-invalid={durationInvalid}
                  className="max-w-[140px] tabular-nums"
                />
                <p
                  className={
                    durationInvalid
                      ? "mt-1.5 text-[13px] text-error"
                      : "mt-1.5 text-[13px] text-text-muted"
                  }
                >
                  {durationInvalid ? t("durationInvalid") : t("durationHelp")}
                </p>
              </div>
            </>
          )}

          <div className="flex items-start justify-between gap-4 border-t border-hairline pt-4">
            <div>
              <Label htmlFor={freeId} className="block">
                {t("freePreviewLabel")}
              </Label>
              <p className="mt-1 text-[13px] text-text-muted">
                {t("freePreviewHelp")}
              </p>
            </div>
            <Switch
              id={freeId}
              checked={isFree}
              onCheckedChange={setIsFree}
              disabled={uploading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!canSubmit}
          >
            {mode === "upload" && file ? t("uploadSubmit") : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { LessonVideoDialog };
