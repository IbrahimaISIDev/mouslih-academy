import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="grid size-12 place-items-center rounded-full bg-hairline text-text-muted">
        <Icon className="size-6" strokeWidth={1.5} />
      </div>
      <p className="font-serif text-[19px] font-semibold text-text">{title}</p>
      {description && (
        <p className="max-w-[42ch] text-sm text-text-muted">{description}</p>
      )}
      {action}
    </div>
  );
}

export { EmptyState };
