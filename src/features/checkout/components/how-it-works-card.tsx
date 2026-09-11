import { cn } from "@/lib/utils";

export interface HowItWorksCardProps {
  title: string;
  steps: string[];
}

function HowItWorksCard({ title, steps }: HowItWorksCardProps) {
  return (
    <div className="border border-border-subtle bg-surface p-6.5 lg:p-7">
      <p className="mb-5.5 text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase">{title}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step} className="flex items-start gap-3 lg:block">
              <span
                className={cn(
                  "grid size-[30px] shrink-0 place-items-center rounded-full border font-serif text-sm lg:mb-3",
                  isLast ? "border-gold-600 bg-gold-50 text-premium-text" : "border-green-700 text-green-ink",
                )}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-[1.55] text-text-soft">{step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { HowItWorksCard };
