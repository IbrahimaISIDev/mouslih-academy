import { Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { ProgressBar } from "@/components/patterns/progress-bar";

export type CourseRowStatus = "inProgress" | "notStarted" | "completed";

export interface MyCourseRowProps {
  title: string;
  metaLine: string;
  status: CourseRowStatus;
  statusLabel: string;
  progressPct: number;
  progressLabel: string;
  actionLabel: string;
  actionHref: string;
}

function MyCourseRow({
  title,
  metaLine,
  status,
  statusLabel,
  progressPct,
  progressLabel,
  actionLabel,
  actionHref,
}: MyCourseRowProps) {
  const isCompleted = status === "completed";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border bg-surface p-4.5 sm:flex-row sm:items-center lg:p-4.5",
        isCompleted ? "border-gold-200" : "border-border-subtle",
      )}
    >
      <div className="relative hidden aspect-16/11 w-33 shrink-0 overflow-hidden bg-green-800 sm:block">
        <GeometricPattern variant="treillis" opacity={0.5} />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="mb-1 font-serif text-xl font-semibold">{title}</h3>
            <p className="text-[13px] text-text-muted">{metaLine}</p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-sm px-2.5 py-1 text-[11px] font-semibold tracking-[0.06em] uppercase whitespace-nowrap",
              status === "inProgress" && "bg-green-100 text-green-ink",
              status === "notStarted" && "bg-hairline text-text-muted",
              status === "completed" && "bg-success-bg text-success",
            )}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-4.5 sm:flex-row sm:items-center">
          <ProgressBar
            percent={progressPct}
            label={progressLabel}
            className="flex-1"
          />
          <Button
            variant={
              isCompleted
                ? "gold"
                : status === "inProgress"
                  ? "primary"
                  : "secondary"
            }
            asChild
          >
            <Link href={actionHref}>
              {isCompleted && (
                <Shield className="size-[15px]" strokeWidth={1.7} />
              )}
              {actionLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { MyCourseRow };
