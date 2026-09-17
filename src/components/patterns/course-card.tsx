import Image from "next/image";
import { Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Level } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LevelBadge } from "@/components/patterns/level-badge";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export interface CourseCardProps {
  href: string;
  title: string;
  meta: string;
  price: string;
  level: Level;
  levelLabel: string;
  coverUrl: string | null;
  discoverLabel: string;
  promoLabel?: string;
  locked?: boolean;
  lockedLabel?: string;
  unlockLabel?: string;
  size?: "grid" | "full";
  className?: string;
}

function CourseCard({
  href,
  title,
  meta,
  price,
  level,
  levelLabel,
  coverUrl,
  discoverLabel,
  promoLabel,
  locked = false,
  lockedLabel,
  unlockLabel,
  size = "grid",
  className,
}: CourseCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-sm border border-border-subtle bg-surface transition-[transform,box-shadow,border-color] duration-150",
        "hover:-translate-y-0.5 hover:border-green-700 hover:shadow-card-hover",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-green-900",
          size === "grid" ? "h-[132px]" : "h-[168px]",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
          {coverUrl ? (
            <Image src={coverUrl} alt="" fill className="object-cover object-top" />
          ) : (
            <GeometricPattern variant="khatam" opacity={0.4} />
          )}
        </div>

        {locked && (
          <>
            <div className="absolute inset-0 bg-green-800/35" />
            <GeometricPattern variant="khatam" opacity={0.3} />
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid size-10 place-items-center rounded-full bg-surface/90">
                <Lock
                  className="size-[18px] text-green-ink"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </>
        )}

        <div className="absolute start-3 top-3">
          <LevelBadge level={level} label={levelLabel} variant="overlay" />
        </div>

        {promoLabel && !locked && (
          <div className="absolute end-3 top-3 rounded-sm bg-gold-200 px-2 py-1 text-xs font-semibold text-green-ink">
            {promoLabel}
          </div>
        )}
      </div>

      <div className="p-4">
        <h4
          className={cn(
            "font-serif text-[19px] font-semibold",
            locked ? "text-text-muted" : "text-text",
          )}
        >
          {title}
        </h4>
        <p className="mt-1 text-[13px] text-text-muted">{meta}</p>
      </div>

      <div className="flex items-center justify-between border-t border-hairline px-4 py-3">
        {locked ? (
          <>
            <span className="text-[13px] text-text-muted">{lockedLabel}</span>
            <span className="text-[13px] font-semibold text-green-ink">
              {unlockLabel}
            </span>
          </>
        ) : (
          <>
            <span className="font-serif text-xl font-semibold text-text">
              {price}
            </span>
            <span className="text-[13px] font-semibold text-green-ink">
              {discoverLabel}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}

export { CourseCard };
