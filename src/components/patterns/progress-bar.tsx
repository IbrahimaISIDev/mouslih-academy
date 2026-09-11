import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  percent: number;
  label?: string;
  variant?: "linear" | "circular";
  /** "onDark" : piste blanc translucide + remplissage gold-200, pour un fond sombre (green-900/800). */
  tone?: "default" | "onDark";
  labelClassName?: string;
  className?: string;
}

/**
 * Remplissage via justify-content: flex-start sur un conteneur flex plutôt qu'une largeur
 * positionnée : la barre se remplit depuis le bord logique "start", donc depuis la droite
 * en RTL, sans code spécifique à la direction.
 */
function ProgressBar({
  percent,
  label,
  variant = "linear",
  tone = "default",
  labelClassName,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  if (variant === "circular") {
    return (
      <div
        className={cn(
          "relative grid size-[58px] place-items-center rounded-full",
          className,
        )}
        style={{
          background: `conic-gradient(var(--color-green-700) ${clamped}%, var(--color-border-subtle) 0)`,
        }}
      >
        <div className="grid size-[46px] place-items-center rounded-full bg-surface text-[13px] font-semibold tabular-nums text-text">
          {clamped}%
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex h-1.5 w-full justify-start overflow-hidden rounded-sm",
          tone === "onDark" ? "bg-white/16" : "bg-border-subtle",
        )}
      >
        <div
          className={cn(
            "h-full",
            tone === "onDark"
              ? "bg-gold-200"
              : clamped >= 100
                ? "bg-success"
                : "bg-green-700",
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {label && (
        <span
          className={cn(
            "shrink-0 text-sm tabular-nums",
            tone === "onDark" ? "text-on-dark-soft" : "text-text-muted",
            labelClassName,
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export { ProgressBar };
