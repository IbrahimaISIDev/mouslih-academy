import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusBadgeStatus =
  "paid" | "pending" | "failed" | "refunded" | "draft" | "premium";

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  label: string;
  className?: string;
}

const STATUS_STYLES: Record<StatusBadgeStatus, string> = {
  paid: "border-success-border bg-success-bg text-success",
  pending: "border-warning-border bg-warning-bg text-warning",
  failed: "border-error-border bg-error-bg text-error",
  refunded: "border-border-strong bg-hairline text-text-muted",
  draft: "border-border-strong bg-hairline text-text-muted",
  premium: "border-gold-200 bg-gold-50 text-premium-text",
};

/** Étiquette d'état sémantique (commande, formation, apprenant). */
function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-[11px] py-1.5 text-xs font-semibold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {status === "premium" && (
        <Star className="size-[13px]" strokeWidth={1.5} fill="currentColor" />
      )}
      {label}
    </span>
  );
}

export { StatusBadge };
