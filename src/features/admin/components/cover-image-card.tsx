"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ClientApiError } from "@/lib/client-fetch";
import { uploadCourseCover } from "../api/upload-course-cover";
import type { CourseEditorData } from "../api/get-course-editor";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { Button } from "@/components/ui/button";

export interface CoverImageCardProps {
  courseId: string;
  coverUrl: string | null;
  title: string;
  replaceLabel: string;
  hint: string;
  uploadErrorToast: string;
  onUploaded: (data: CourseEditorData) => void;
}

function CoverImageCard({
  courseId,
  coverUrl,
  title,
  replaceLabel,
  hint,
  uploadErrorToast,
  onUploaded,
}: CoverImageCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelected(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadCourseCover(courseId, file);
      onUploaded(data);
    } catch (error) {
      toast.error(error instanceof ClientApiError ? error.message : uploadErrorToast);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="border border-border-subtle bg-surface p-5.5">
      <p className="mb-4 text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">{title}</p>
      <div className="relative mb-3.5 aspect-16/10 overflow-hidden bg-green-700">
        {coverUrl ? (
          <Image src={coverUrl} alt="" fill className="object-cover" sizes="340px" />
        ) : (
          <GeometricPattern variant="khatam" opacity={0.6} />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        loading={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {replaceLabel}
      </Button>
      <p className="mt-2 text-center text-xs text-text-faint">{hint}</p>
    </div>
  );
}

export { CoverImageCard };
