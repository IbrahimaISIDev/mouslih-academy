import { AlertCircle, MessageCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FailedStateProps {
  title: string;
  noDebit: string;
  retryNote: string;
  reasonTitle: string;
  reasonText: string;
  referenceLine: string;
  checklistTitle: string;
  checks: string[];
  retryButtonLabel: string;
  retryHref: string;
  contactSupportLabel: string;
  whatsappHref: string;
}

function FailedState({
  title,
  noDebit,
  retryNote,
  reasonTitle,
  reasonText,
  referenceLine,
  checklistTitle,
  checks,
  retryButtonLabel,
  retryHref,
  contactSupportLabel,
  whatsappHref,
}: FailedStateProps) {
  return (
    <div className="grid min-h-[560px] place-items-center bg-bg px-5 py-14 sm:px-6 lg:px-11">
      <div className="max-w-[560px] text-center">
        <div className="mx-auto mb-6 grid size-18 place-items-center rounded-full border border-error-border bg-error-bg lg:size-21">
          <AlertCircle className="size-8 text-error lg:size-8.5" strokeWidth={1.4} />
        </div>

        <h1 className="mb-3.5 font-serif text-[26px] leading-[1.2] font-medium tracking-[-0.01em] lg:text-[40px] lg:leading-[1.15]">
          {title}
        </h1>
        <p className="mx-auto mb-2 max-w-[52ch] text-base font-medium text-text lg:text-lg">{noDebit}</p>
        <p className="mx-auto mb-7 max-w-[54ch] text-sm text-text-muted lg:text-base">{retryNote}</p>

        <div className="mb-5.5 border border-error-border border-s-[3px] border-s-error bg-surface p-5 text-start">
          <p className="mb-2.5 text-xs font-semibold tracking-[0.16em] text-error uppercase">{reasonTitle}</p>
          <p className="mb-1.5 text-[15px] lg:text-base">{reasonText}</p>
          <p dir="ltr" className="text-[13px] tabular-nums text-text-muted">
            {referenceLine}
          </p>
        </div>

        <div className="mb-7 border border-border-subtle bg-bg p-5 text-start">
          <p className="mb-3.5 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">
            {checklistTitle}
          </p>
          <div className="flex flex-col gap-2.5">
            {checks.map((check) => (
              <div key={check} className="flex gap-2.5 text-[15px] text-text-soft">
                <span className="text-gold-600">·</span>
                {check}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
          <Button size="lg" asChild>
            <a href={retryHref}>
              <RefreshCcw className="size-[17px]" strokeWidth={1.8} />
              {retryButtonLabel}
            </a>
          </Button>
          <Button variant="whatsapp" size="lg" asChild>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-[17px]" strokeWidth={1.8} />
              {contactSupportLabel}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { FailedState };
