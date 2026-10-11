"use client";

import { type ReactNode, useId, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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

function toClock(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export interface LessonVideoDialogProps {
  trigger: ReactNode;
  lessonTitle: string;
  initialYoutubeId?: string;
  initialDurationSeconds: number;
  initialIsFreePreview: boolean;
  /** Doit rejeter (après avoir affiché son propre toast) pour garder le dialogue ouvert. */
  onSubmit: (input: LessonVideoInput) => Promise<void>;
}

/** Rattache une vidéo YouTube à une leçon : lien, durée (saisie manuelle) et accès libre. */
function LessonVideoDialog({
  trigger,
  lessonTitle,
  initialYoutubeId,
  initialDurationSeconds,
  initialIsFreePreview,
  onSubmit,
}: LessonVideoDialogProps) {
  const t = useTranslations("admin.course.curriculum.videoDialog");
  const urlId = useId();
  const durationId = useId();
  const freeId = useId();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [isFree, setIsFree] = useState(initialIsFreePreview);
  const [submitting, setSubmitting] = useState(false);

  const videoId = url.trim() ? parseYouTubeVideoId(url) : null;
  const durationMatch = DURATION_PATTERN.exec(duration.trim());
  const urlInvalid = url.trim().length > 0 && !videoId;
  const durationInvalid = duration.trim().length > 0 && !durationMatch;
  const canSubmit = !!videoId && !!durationMatch && !submitting;

  function handleOpenChange(next: boolean) {
    if (next) {
      setUrl(initialYoutubeId ? `https://youtu.be/${initialYoutubeId}` : "");
      setDuration(
        initialDurationSeconds > 0 ? toClock(initialDurationSeconds) : "",
      );
      setIsFree(initialIsFreePreview);
    }
    setOpen(next);
  }

  async function handleSubmit() {
    if (!videoId || !durationMatch) return;
    setSubmitting(true);
    try {
      await onSubmit({
        youtubeUrl: videoId,
        durationSeconds:
          Number(durationMatch[1]) * 60 + Number(durationMatch[2]),
        isFreePreview: isFree,
      });
      setOpen(false);
    } catch {
      // Toast d'erreur déjà affiché par l'appelant : on garde le dialogue ouvert.
    } finally {
      setSubmitting(false);
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

          <div className="flex items-start justify-between gap-4 border-t border-hairline pt-4">
            <div>
              <Label htmlFor={freeId} className="block">
                {t("freePreviewLabel")}
              </Label>
              <p className="mt-1 text-[13px] text-text-muted">
                {t("freePreviewHelp")}
              </p>
            </div>
            <Switch id={freeId} checked={isFree} onCheckedChange={setIsFree} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!canSubmit}
          >
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { LessonVideoDialog };
