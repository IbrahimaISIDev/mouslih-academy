import { MessageCircle } from "lucide-react";
import {
  CurriculumAccordion,
  type CurriculumModule,
} from "@/components/patterns/curriculum-accordion";
import { ProgressBar } from "@/components/patterns/progress-bar";

export interface LessonSidebarProps {
  title: string;
  /** Absents sans inscription : aucune progression suivie, on n'affiche pas « 0 / 5 ». */
  progressLabel?: string;
  progressPct?: number;
  modules: CurriculumModule[];
  defaultOpen: string[];
  lockedTooltipLabel: string;
  /** Lien de chaque leçon de la liste (les leçons verrouillées restent non cliquables). */
  getLessonHref?: (lesson: {
    id: string;
    title: string;
    duration: string;
  }) => string;
  /** Absent : bouton masqué (formation sans correction vocale). */
  sendRecitationLabel?: string;
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
  getLessonHref,
  sendRecitationLabel,
  whatsappHref,
  className,
}: LessonSidebarProps) {
  return (
    <div className={className}>
      <div className="border-b border-border-subtle p-5.5">
        <div
          className={
            progressPct !== undefined
              ? "mb-3 flex items-baseline justify-between"
              : "flex items-baseline justify-between"
          }
        >
          <span className="font-serif text-lg font-semibold">{title}</span>
          {progressLabel && (
            <span className="text-[13px] tabular-nums text-text-muted">
              {progressLabel}
            </span>
          )}
        </div>
        {progressPct !== undefined && <ProgressBar percent={progressPct} />}
      </div>

      <CurriculumAccordion
        modules={modules}
        defaultOpen={defaultOpen}
        lockedTooltipLabel={lockedTooltipLabel}
        getLessonHref={getLessonHref}
      />

      {sendRecitationLabel && (
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
      )}
    </div>
  );
}

export { LessonSidebar };
