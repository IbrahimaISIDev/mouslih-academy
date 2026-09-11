"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  CurriculumAccordion,
  type CurriculumModule,
} from "@/components/patterns/curriculum-accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export interface CourseCurriculumProps {
  modules: CurriculumModule[];
  defaultOpen?: string[];
}

function CourseCurriculum({ modules, defaultOpen }: CourseCurriculumProps) {
  const t = useTranslations("course.curriculum");
  const [preview, setPreview] = useState<{
    title: string;
    duration: string;
  } | null>(null);

  return (
    <>
      <CurriculumAccordion
        modules={modules}
        defaultOpen={defaultOpen}
        freeBadgeLabel={t("freeLabel")}
        lockedTooltipLabel={t("lockedTooltip")}
        onFreeLessonClick={(lesson) =>
          setPreview({ title: lesson.title, duration: lesson.duration })
        }
      />

      <Dialog
        open={preview !== null}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
          </DialogHeader>
          <div className="relative grid aspect-video place-items-center overflow-hidden bg-green-800">
            <GeometricPattern variant="khatam" opacity={0.3} />
            <div className="relative grid size-14 place-items-center rounded-full border border-gold-200 bg-green-900/55">
              <Play
                className="size-5 text-gold-200"
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
            {preview && (
              <span
                dir="ltr"
                className="absolute bottom-3 start-4 text-xs text-on-dark-muted"
              >
                {preview.duration}
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { CourseCurriculum };
