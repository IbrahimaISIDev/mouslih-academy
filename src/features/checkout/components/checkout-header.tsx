import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/patterns/language-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type CheckoutStepState = "done" | "active" | "upcoming";

export interface CheckoutStep {
  label: string;
  state: CheckoutStepState;
}

export interface CheckoutHeaderProps {
  steps: CheckoutStep[];
  cancelLabel?: string;
  cancelHref?: string;
  userInitials?: string;
  wordmark?: string;
}

function CheckoutHeader({ steps, cancelLabel, cancelHref, userInitials, wordmark }: CheckoutHeaderProps) {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-border-subtle bg-surface px-5 sm:px-6 lg:px-11">
      <Link
        href="/"
        className="rounded-sm outline-none focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]"
      >
        <Logo wordmark={wordmark} />
      </Link>

      <div className="hidden items-center gap-3.5 text-sm lg:flex">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3.5">
            {i > 0 && <span className="h-px w-7 bg-border-strong" />}
            <span
              className={cn(
                "flex items-center gap-2",
                step.state === "active" ? "font-semibold text-green-ink" : "text-text-faint",
              )}
            >
              <span
                className={cn(
                  "grid size-[22px] place-items-center rounded-full text-xs",
                  step.state === "done" && "bg-green-100 text-green-ink",
                  step.state === "active" && "bg-green-700 text-green-ink",
                  step.state === "upcoming" && "border border-border-strong text-text-faint",
                )}
              >
                {step.state === "done" ? <Check className="size-3" strokeWidth={2.5} /> : i + 1}
              </span>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher variant="compact" className="lg:hidden" />
        <LanguageSwitcher variant="segmented" className="hidden lg:inline-flex" />
        {userInitials && (
          <Avatar size="sm" className="hidden lg:flex">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        )}
        {cancelHref && cancelLabel && (
          <Link
            href={cancelHref}
            className="hidden rounded-sm text-sm text-text-muted outline-none transition-colors hover:text-text focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)] lg:inline"
          >
            {cancelLabel}
          </Link>
        )}
      </div>
    </header>
  );
}

export { CheckoutHeader };
