import type { Level } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface LevelBadgeProps {
  level: Level;
  label: string;
  variant?: "solid" | "overlay";
  className?: string;
}

const LEVEL_BARS: Record<Level, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

/** Débutant / intermédiaire / avancé, trois barrettes remplies selon le niveau. */
function LevelBadge({
  level,
  label,
  variant = "solid",
  className,
}: LevelBadgeProps) {
  const filled = LEVEL_BARS[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-2.5 py-1",
        variant === "solid"
          ? "bg-green-100 text-green-ink"
          : "bg-white/92 text-green-ink",
        className,
      )}
    >
      <span className="flex items-end gap-0.5">
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            className={cn(
              "h-2.5 w-[3px]",
              bar <= filled ? "bg-green-700" : "bg-green-700/25",
            )}
          />
        ))}
      </span>
      <span className="text-xs font-semibold tracking-[0.06em] uppercase">
        {label}
      </span>
    </span>
  );
}

export { LevelBadge };
