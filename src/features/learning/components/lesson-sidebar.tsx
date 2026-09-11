import { MessageCircle } from "lucide-react";
import {
  CurriculumAccordion,
  type CurriculumModule,
} from "@/components/patterns/curriculum-accordion";
import { ProgressBar } from "@/components/patterns/progress-bar";

export interface LessonSidebarProps {
  title: string;
  progressLabel: string;
  progressPct: number;
  modules: CurriculumModule[];
  defaultOpen: string[];
  lockedTooltipLabel: string;
  sendRecitationLabel: string;
  whatsappHref: string;
  className?: string;
}

function LessonSidebar({
  title,
  progressLabel,
  progressPct,
  modules,
  defaultOpen,
  lockedTooltipLabel,
  sendRecitationLabel,
  whatsappHref,
  className,
}: LessonSidebarProps) {
  return (
    <div className={className}>
      <div className="border-b border-border-subtle p-5.5">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-serif text-lg font-semibold">{title}</span>
          <span className="text-[13px] tabular-nums text-text-muted">
            {progressLabel}
          </span>
        </div>
        <ProgressBar percent={progressPct} />
      </div>

      <CurriculumAccordion
        modules={modules}
        defaultOpen={defaultOpen}
        lockedTooltipLabel={lockedTooltipLabel}
      />

      <div className="p-5.5">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2.5 rounded-sm border border-success-border px-4 py-3.5 text-[14px] font-semibold text-whatsapp-hover transition-colors hover:bg-success-bg"
        >
          <MessageCircle className="size-4" strokeWidth={1.8} />
          {sendRecitationLabel}
        </a>
      </div>
    </div>
  );
}

export { LessonSidebar };
