import { cn } from "@/lib/utils";

export interface LogoProps {
  wordmark?: string;
  variant?: "light" | "dark";
  className?: string;
}

/** Logo losange : carré 30 px rotation 45°, lettre م contre-rotée, bordure gold-600. */
function Logo({
  wordmark = "Mouslih Academy",
  variant = "light",
  className,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-[30px] rotate-45 place-items-center border border-gold-600">
        <span
          className={cn(
            "-rotate-45 font-serif text-[15px] leading-none",
            variant === "light" ? "text-green-700" : "text-on-dark",
          )}
        >
          م
        </span>
      </span>
      <span
        className={cn(
          "font-serif text-[19px] font-medium",
          variant === "light" ? "text-text" : "text-on-dark",
        )}
      >
        {wordmark}
      </span>
    </span>
  );
}

export { Logo };
