import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "success" | "pending" | "failed";

export interface AlertProps {
  variant: AlertVariant;
  title: string;
  description?: string;
  className?: string;
}

const VARIANT_CONFIG: Record<
  AlertVariant,
  { icon: LucideIcon; classes: string }
> = {
  success: {
    icon: CheckCircle2,
    classes: "border-success-border bg-success-bg text-success",
  },
  pending: {
    icon: Clock,
    classes: "border-warning-border bg-warning-bg text-warning",
  },
  failed: {
    icon: AlertTriangle,
    classes: "border-error-border bg-error-bg text-error",
  },
};

function Alert({ variant, title, description, className }: AlertProps) {
  const { icon: Icon, classes } = VARIANT_CONFIG[variant];

  return (
    <div className={cn("flex gap-3 rounded-sm border p-4", classes, className)}>
      <Icon className="mt-0.5 size-[19px] shrink-0" strokeWidth={1.5} />
      <div>
        <p className="text-[15px] font-semibold">{title}</p>
        {description && (
          <p className="mt-0.5 text-sm text-text-soft">{description}</p>
        )}
      </div>
    </div>
  );
}

export { Alert };
