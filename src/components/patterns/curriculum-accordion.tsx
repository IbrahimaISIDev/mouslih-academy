"use client";

import { Lock, Minus, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LessonRow,
  type LessonRowProps,
} from "@/components/patterns/lesson-row";
import { TooltipProvider } from "@/components/ui/tooltip";

export interface CurriculumSubModule {
  id: string;
  title: string | null;
  lessons: Omit<
    LessonRowProps,
    "className" | "lockedTooltipLabel" | "onFreeLessonClick"
  >[];
}

export interface CurriculumModule {
  id: string;
  number: string;
  title: string;
  meta: string;
  subModules: CurriculumSubModule[];
}

export interface CurriculumAccordionProps {
  modules: CurriculumModule[];
  defaultOpen?: string[];
  freeBadgeLabel?: string;
  lockedTooltipLabel?: string;
  onFreeLessonClick?: (lesson: {
    id: string;
    title: string;
    duration: string;
  }) => void;
  getLessonHref?: (lesson: {
    id: string;
    title: string;
    duration: string;
  }) => string;
  className?: string;
}

function CurriculumAccordion({
  modules,
  defaultOpen,
  freeBadgeLabel,
  lockedTooltipLabel,
  onFreeLessonClick,
  getLessonHref,
  className,
}: CurriculumAccordionProps) {
  return (
    <TooltipProvider>
      <Accordion
        type="multiple"
        defaultValue={defaultOpen}
        className={className}
      >
        {modules.map((module) => {
          const lessons = module.subModules.flatMap((s) => s.lessons);
          const hasFree = lessons.some((lesson) => lesson.state === "free");

          return (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className="group/trigger [&>svg]:hidden">
                <span className="flex items-baseline gap-3">
                  <span className="font-serif text-xl text-gold-600">
                    {module.number}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[16px] font-semibold text-text">
                      {module.title}
                    </span>
                    <span className="text-xs text-text-muted">
                      {module.meta}
                    </span>
                  </span>
                </span>
                {freeBadgeLabel !== undefined &&
                  (hasFree ? (
                    <span className="rounded-sm bg-success-bg px-2 py-1 text-xs font-semibold text-success uppercase">
                      {freeBadgeLabel}
                    </span>
                  ) : (
                    <Lock
                      className="size-[18px] shrink-0 text-text-faint"
                      strokeWidth={1.5}
                    />
                  ))}
                <Plus
                  className="mt-1 size-4 shrink-0 text-text-muted group-data-[state=open]/trigger:hidden"
                  strokeWidth={1.5}
                />
                <Minus
                  className="mt-1 hidden size-4 shrink-0 text-text-muted group-data-[state=open]/trigger:block"
                  strokeWidth={1.5}
                />
              </AccordionTrigger>
              <AccordionContent>
                {module.subModules.map((subModule) => (
                  <div key={subModule.id}>
                    {subModule.title && (
                      <p className="ps-8 flex items-center gap-2 py-2 text-xs font-semibold text-text-muted uppercase">
                        <span className="text-gold-600">—</span>
                        {subModule.title}
                      </p>
                    )}
                    <div className="ps-8">
                      {subModule.lessons.map((lesson) => (
                        <LessonRow
                          key={lesson.id}
                          {...lesson}
                          lockedTooltipLabel={lockedTooltipLabel}
                          href={getLessonHref?.(lesson)}
                          onFreeLessonClick={
                            onFreeLessonClick
                              ? () =>
                                  onFreeLessonClick({
                                    id: lesson.id,
                                    title: lesson.title,
                                    duration: lesson.duration,
                                  })
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </TooltipProvider>
  );
}

export { CurriculumAccordion };
