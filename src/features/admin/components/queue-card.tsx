import { MessageCircleQuestion, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface QueueCardProps {
  title: string;
  count: number;
  recitationsLabel: string;
  recitationsDetail: string;
  questionsLabel: string;
  questionsDetail: string;
  ctaLabel: string;
}

function QueueCard({
  title,
  count,
  recitationsLabel,
  recitationsDetail,
  questionsLabel,
  questionsDetail,
  ctaLabel,
}: QueueCardProps) {
  return (
    <div className="border border-gold-200 bg-surface p-5.5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">{title}</span>
        <span className="rounded-sm bg-gold-200 px-2 py-1 text-[11px] font-semibold text-green-ink">{count}</span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 border-b border-hairline pb-3">
          <Timer className="mt-0.5 size-[18px] shrink-0 text-warning" strokeWidth={1.6} />
          <div>
            <p className="mb-0.5 text-sm font-semibold">{recitationsLabel}</p>
            <p className="text-[13px] leading-[1.5] text-text-muted">{recitationsDetail}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <MessageCircleQuestion className="mt-0.5 size-[18px] shrink-0 text-warning" strokeWidth={1.6} />
          <div>
            <p className="mb-0.5 text-sm font-semibold">{questionsLabel}</p>
            <p className="text-[13px] leading-[1.5] text-text-muted">{questionsDetail}</p>
          </div>
        </div>
      </div>
      <Button variant="gold" className="mt-4.5 w-full">
        {ctaLabel}
      </Button>
    </div>
  );
}

export { QueueCard };
