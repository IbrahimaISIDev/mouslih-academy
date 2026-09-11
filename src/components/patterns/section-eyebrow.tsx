import { cn } from "@/lib/utils";

export interface SectionEyebrowProps {
  children: React.ReactNode;
  className?: string;
}

function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <p
      className={cn(
        "text-xs font-semibold tracking-[0.18em] text-gold-600 uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}

export { SectionEyebrow };
