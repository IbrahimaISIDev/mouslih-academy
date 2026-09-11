import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-sm border border-border-strong bg-surface px-3.5 py-3 text-[15px] text-text outline-none transition-colors placeholder:text-text-faint disabled:cursor-not-allowed disabled:bg-bg disabled:text-text-faint",
        "focus-visible:border-green-700 focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]",
        "aria-invalid:border-error aria-invalid:bg-error-field-bg",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
