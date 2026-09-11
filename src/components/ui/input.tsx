import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-sm border border-border-strong bg-surface px-3.5 text-[15px] text-text outline-none transition-colors placeholder:text-text-faint disabled:cursor-not-allowed disabled:bg-bg disabled:text-text-faint",
        "focus-visible:border-green-700 focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]",
        "aria-invalid:border-error aria-invalid:bg-error-field-bg",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
