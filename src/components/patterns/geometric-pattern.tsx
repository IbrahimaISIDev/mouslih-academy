import { cn } from "@/lib/utils";

export interface GeometricPatternProps {
  variant: "khatam" | "treillis" | "chevrons";
  opacity?: number;
  className?: string;
}

const PATTERN_CONFIG = {
  khatam: { src: "/patterns/khatam.svg", size: "72px 72px" },
  treillis: { src: "/patterns/treillis.svg", size: "40px 40px" },
  chevrons: { src: "/patterns/chevrons.svg", size: "48px 28px" },
} as const;

/** Tuile SVG décorative en fond, jamais au premier plan, jamais derrière du texte courant. */
function GeometricPattern({
  variant,
  opacity = 0.4,
  className,
}: GeometricPatternProps) {
  const { src, size } = PATTERN_CONFIG[variant];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `url("${src}")`,
        backgroundSize: size,
        opacity,
      }}
    />
  );
}

export { GeometricPattern };
