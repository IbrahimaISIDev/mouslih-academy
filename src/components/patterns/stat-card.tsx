import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  change?: { direction: "up" | "down"; label: string };
  /** Filet supérieur 2px gold-600, réservé à l'indicateur principal d'une grille de StatCard. */
  primary?: boolean;
  className?: string;
}

function StatCard({ label, value, change, primary, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-sm border border-border-subtle bg-surface p-5",
        primary && "border-t-2 border-t-gold-600",
        className,
      )}
    >
      <p className="text-xs font-semibold tracking-[0.06em] text-text-muted uppercase">
        {label}
      </p>
      <p className="mt-2 font-serif text-[34px] leading-none font-medium text-text">
        {value}
      </p>
      {change && (
        <p
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-[13px] font-semibold",
            change.direction === "up" ? "text-success" : "text-error",
          )}
        >
          {change.direction === "up" ? (
            <ArrowUp className="size-3.5" strokeWidth={2} />
          ) : (
            <ArrowDown className="size-3.5" strokeWidth={2} />
          )}
          {change.label}
        </p>
      )}
    </div>
  );
}

export { StatCard };
