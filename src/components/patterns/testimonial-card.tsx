import { Play, Quote } from "lucide-react";
import type { Locale, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export interface TestimonialCardProps {
  testimonial: Testimonial;
  locale: Locale;
  className?: string;
}

function TestimonialCard({
  testimonial,
  locale,
  className,
}: TestimonialCardProps) {
  const initials = testimonial.authorName.charAt(0);

  if (testimonial.kind === "video") {
    return (
      <div className={cn("border border-border-subtle bg-surface", className)}>
        <div className="relative grid aspect-4/5 place-items-center overflow-hidden bg-green-800 lg:aspect-3/4">
          <GeometricPattern variant="khatam" opacity={0.25} />
          <div className="relative grid size-13 place-items-center rounded-full border border-gold-200 bg-green-900/50">
            <Play
              className="size-[19px] text-gold-200"
              fill="currentColor"
              strokeWidth={0}
            />
          </div>
          {testimonial.videoDuration && (
            <span className="absolute bottom-3 start-3.5 text-xs text-on-dark-muted">
              {testimonial.videoDuration}
            </span>
          )}
        </div>
        <div className="p-5 lg:p-6">
          <p className="mb-3.5 font-serif text-base leading-[1.55] lg:mb-4.5 lg:text-lg">
            « {testimonial.quote[locale]} »
          </p>
          <div className="flex items-center gap-2.5 border-t border-hairline pt-3.5 lg:gap-3 lg:pt-4">
            <Avatar size="sm" className="lg:size-[38px]">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-[13px] font-semibold lg:text-sm">
                {testimonial.authorName}
              </div>
              <div className="text-xs text-text-muted lg:text-[13px]">
                {testimonial.authorCity}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testimonial.highlighted) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-green-900 p-6 text-on-dark lg:p-7",
          className,
        )}
      >
        <GeometricPattern variant="treillis" opacity={0.3} />
        <div className="relative">
          <Quote className="mb-4 size-6 text-gold-200" strokeWidth={1.4} />
          <p className="mb-5.5 font-serif text-lg leading-[1.6] lg:text-xl">
            {testimonial.quote[locale]}
          </p>
          <div className="flex items-center gap-3 border-t border-gold-600/35 pt-4">
            <Avatar>
              <AvatarFallback className="bg-gold-200/18 text-gold-200">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold">
                {testimonial.authorName}
              </div>
              <div className="text-[13px] text-green-300">
                {testimonial.authorCity}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("border border-border-subtle bg-surface p-6.5", className)}
    >
      <Quote className="mb-4 size-6 text-gold-600" strokeWidth={1.4} />
      <p className="mb-5.5 font-serif text-lg leading-[1.6]">
        {testimonial.quote[locale]}
      </p>
      <div className="flex items-center gap-3 border-t border-hairline pt-4">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-semibold">{testimonial.authorName}</div>
          <div className="text-[13px] text-text-muted">
            {testimonial.authorCity}
          </div>
        </div>
      </div>
    </div>
  );
}

export { TestimonialCard };
