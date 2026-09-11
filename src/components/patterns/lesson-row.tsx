import { CheckCircle, Lock, Play, PlayCircle } from "lucide-react";
import type { LessonState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface LessonRowProps {
  id: string;
  title: string;
  duration: string;
  state: LessonState;
  freeLabel?: string;
  lockedTooltipLabel?: string;
  onFreeLessonClick?: () => void;
  /** Si fourni (et l'état n'est pas locked), toute la ligne devient un lien de navigation. */
  href?: string;
  className?: string;
}

function LessonRow({
  title,
  duration,
  state,
  freeLabel,
  lockedTooltipLabel,
  onFreeLessonClick,
  href,
  className,
}: LessonRowProps) {
  const content = (
    <div
      className={cn(
        "flex items-center gap-3 border-s-[3px] border-transparent px-3 py-2.5",
        state === "current" && "border-green-700 bg-green-100",
        state === "locked" && "opacity-55",
        className,
      )}
    >
      {state === "completed" && (
        <CheckCircle
          className="size-[18px] shrink-0 text-success"
          strokeWidth={1.5}
        />
      )}
      {state === "current" && (
        <PlayCircle
          className="size-[18px] shrink-0 text-green-ink"
          strokeWidth={1.5}
        />
      )}
      {(state === "upcoming" || state === "free") && (
        <Play
          className={cn(
            "size-[18px] shrink-0",
            state === "free" ? "text-green-ink" : "text-text-faint",
          )}
          strokeWidth={1.5}
        />
      )}
      {state === "locked" && (
        <Lock
          className="size-[18px] shrink-0 text-text-faint"
          strokeWidth={1.5}
        />
      )}

      <span
        className={cn(
          "flex-1 text-start text-[15px]",
          state === "current" ? "font-semibold text-text" : "text-text",
        )}
      >
        {title}
      </span>

      {state === "free" && freeLabel && (
        <span className="rounded-sm bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-ink">
          {freeLabel}
        </span>
      )}

      <span
        dir="ltr"
        className="shrink-0 text-[13px] tabular-nums text-text-muted"
      >
        {duration}
      </span>
    </div>
  );

  if (state !== "locked" && href) {
    return (
      <Link href={href} className="block w-full text-start">
        {content}
      </Link>
    );
  }

  if (state === "free" && onFreeLessonClick) {
    return (
      <button
        type="button"
        onClick={onFreeLessonClick}
        className="w-full text-start"
      >
        {content}
      </button>
    );
  }

  if (state === "locked" && lockedTooltipLabel) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="w-full cursor-not-allowed text-start"
            onClick={(e) => e.preventDefault()}
          >
            {content}
          </button>
        </TooltipTrigger>
        <TooltipContent>{lockedTooltipLabel}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export { LessonRow };
