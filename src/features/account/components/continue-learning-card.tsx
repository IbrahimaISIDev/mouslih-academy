import { Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { ProgressBar } from "@/components/patterns/progress-bar";

export interface ContinueLearningCardProps {
  eyebrow: string;
  lessonTitle: string;
  contextLine: string;
  progressLabel: string;
  progressPct: number;
  resumeAtPrefix: string;
  resumeAtTime: string;
  resumeButtonLabel: string;
  href: string;
}

function ContinueLearningCard({
  eyebrow,
  lessonTitle,
  contextLine,
  progressLabel,
  progressPct,
  resumeAtPrefix,
  resumeAtTime,
  resumeButtonLabel,
  href,
}: ContinueLearningCardProps) {
  return (
    <div className="relative mb-10 overflow-hidden bg-green-900 text-on-dark">
      <GeometricPattern variant="khatam" opacity={0.3} />
      <div className="relative flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-8 lg:p-7.5">
        <div className="relative aspect-video shrink-0 border border-gold-600/40 bg-green-800 lg:aspect-16/10 lg:w-65">
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid size-12 place-items-center rounded-full border border-gold-200 bg-green-900/50">
              <Play
                className="size-[18px] text-gold-200"
                fill="currentColor"
                strokeWidth={0}
              />
            </div>
          </div>
          <span className="absolute bottom-2.5 start-2.5 text-[11px] text-on-dark-muted">
            {resumeAtPrefix} <span dir="ltr">{resumeAtTime}</span>
          </span>
        </div>

        <div className="flex-1">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-gold-200 uppercase">
            {eyebrow}
          </p>
          <h2 className="mb-1.5 font-serif text-2xl font-medium lg:text-[30px]">
            {lessonTitle}
          </h2>
          <p className="mb-4 text-[15px] text-on-dark-muted">{contextLine}</p>
          <ProgressBar
            percent={progressPct}
            label={progressLabel}
            tone="onDark"
            className="max-w-[520px]"
          />
        </div>

        <Button
          variant="gold"
          size="lg"
          asChild
          className="w-full shrink-0 lg:w-auto"
        >
          <Link href={href}>
            <Play className="size-[18px]" fill="currentColor" strokeWidth={0} />
            {resumeButtonLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export { ContinueLearningCard };
