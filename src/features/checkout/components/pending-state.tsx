import { Clock, RefreshCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export interface PendingStateProps {
  title: string;
  body: string;
  transactionLabel: string;
  statusBadge: string;
  reference: string;
  refValue: string;
  courseLabel: string;
  courseValue: string;
  amountLabel: string;
  amountValue: string;
  refreshLabel: string;
  onRefresh: () => void;
  refreshing: boolean;
  backToDashboardLabel: string;
  timeoutNote?: string;
}

function PendingState({
  title,
  body,
  transactionLabel,
  statusBadge,
  reference,
  refValue,
  courseLabel,
  courseValue,
  amountLabel,
  amountValue,
  refreshLabel,
  onRefresh,
  refreshing,
  backToDashboardLabel,
  timeoutNote,
}: PendingStateProps) {
  return (
    <div className="grid min-h-[560px] place-items-center bg-bg px-5 py-14 sm:px-6 lg:px-11">
      <div className="max-w-[560px] text-center">
        <div className="relative mx-auto mb-6 size-18 lg:size-21">
          <div className="motion-safe:[animation:pulse-ring_2.2s_ease-out_infinite] absolute inset-0 rounded-full border-2 border-warning-border" />
          <div className="absolute inset-0 grid place-items-center rounded-full border border-warning-border bg-warning-bg">
            <Clock className="size-8 text-warning lg:size-8.5" strokeWidth={1.4} />
          </div>
        </div>

        <h1 className="mb-3.5 font-serif text-[26px] leading-[1.2] font-medium tracking-[-0.01em] lg:text-[40px] lg:leading-[1.15]">
          {title}
        </h1>
        <p className="mx-auto mb-7 max-w-[54ch] text-[15px] leading-[1.65] text-text-soft lg:text-[17px]">{body}</p>

        <div className="mb-7 border border-border-subtle bg-surface p-5.5 text-start">
          <div className="mb-4.5 flex items-baseline justify-between">
            <span className="text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
              {transactionLabel}
            </span>
            <span className="rounded-sm border border-warning-border bg-warning-bg px-2.5 py-1 text-xs font-semibold text-warning">
              {statusBadge}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-1 text-[13px] text-text-muted">{reference}</p>
              <p dir="ltr" className="tabular-nums">
                {refValue}
              </p>
            </div>
            <div>
              <p className="mb-1 text-[13px] text-text-muted">{courseLabel}</p>
              <p>{courseValue}</p>
            </div>
            <div>
              <p className="mb-1 text-[13px] text-text-muted">{amountLabel}</p>
              <p className="font-serif text-lg font-semibold">{amountValue}</p>
            </div>
          </div>
        </div>

        {timeoutNote && <p className="mb-6 text-sm text-text-muted">{timeoutNote}</p>}

        <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
          <Button loading={refreshing} onClick={onRefresh}>
            <RefreshCcw className="size-[17px]" strokeWidth={1.8} />
            {refreshLabel}
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/tableau-de-bord">{backToDashboardLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { PendingState };
