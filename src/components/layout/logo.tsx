import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoProps {
  wordmark?: string;
  variant?: "light" | "dark";
  className?: string;
}

function Logo({
  wordmark = "Mouslih Academy",
  variant = "light",
  className,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative size-[30px] shrink-0 overflow-hidden rounded-full">
        <Image
          src="/images/brand/logo.jpg"
          alt=""
          fill
          sizes="30px"
          className="object-cover"
        />
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
