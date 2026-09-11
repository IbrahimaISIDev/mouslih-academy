import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border font-semibold whitespace-nowrap transition-colors outline-none focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-hairline disabled:text-text-faint [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "border-green-700 bg-green-700 text-green-ink hover:bg-green-600",
        secondary:
          "border-green-700 bg-transparent text-green-ink hover:bg-green-100",
        ghost:
          "border-transparent bg-transparent text-green-ink hover:bg-hairline",
        gold: "border-gold-300 bg-gold-200 text-green-ink hover:bg-gold-hover",
        whatsapp:
          "border-transparent bg-whatsapp text-white hover:bg-whatsapp-hover",
        destructive:
          "border-error-button-border bg-transparent text-error hover:bg-error-button-hover-bg",
      },
      size: {
        sm: "gap-1.5 px-3.5 py-2 text-[13px]",
        default: "gap-2 px-6 py-[13px] text-[15px]",
        lg: "h-14 gap-2 px-[30px] py-[17px] text-[17px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingLabel = "Traitement…",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
