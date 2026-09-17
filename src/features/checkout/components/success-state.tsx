import { useState } from "react";
import { BookOpen, Check, Download } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { ClientApiError } from "@/lib/client-fetch";
import { downloadReceipt } from "@/features/checkout/api/download-receipt";

export interface SuccessStateProps {
  orderRef: string;
  amountLabel: string;
  blessing: string;
  title: string;
  body: string;
  startLessonLabel: string;
  startLessonHref: string;
  goDashboardLabel: string;
  getStartedTitle: string;
  tips: { icon: typeof BookOpen; title: string; body: string }[];
  receiptTitle: string;
  paidBadge: string;
  reference: string;
  refValue: string;
  dateLabel: string;
  dateValue: string;
  methodLabel: string;
  methodValue: string;
  amountPaidLabel: string;
  downloadReceiptLabel: string;
  downloadReceiptErrorToast: string;
  emailedToLabel: string;
}

function SuccessState({
  orderRef,
  amountLabel,
  blessing,
  title,
  body,
  startLessonLabel,
  startLessonHref,
  goDashboardLabel,
  getStartedTitle,
  tips,
  receiptTitle,
  paidBadge,
  reference,
  refValue,
  dateLabel,
  dateValue,
  methodLabel,
  methodValue,
  amountPaidLabel,
  downloadReceiptLabel,
  downloadReceiptErrorToast,
  emailedToLabel,
}: SuccessStateProps) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadReceipt(orderRef);
    } catch (error) {
      toast.error(error instanceof ClientApiError ? error.message : downloadReceiptErrorToast);
    } finally {
      setDownloading(false);
    }
  }
  return (
    <div>
      <div className="relative overflow-hidden bg-green-900 px-6 py-14 text-center text-on-dark lg:px-11 lg:py-18">
        <GeometricPattern variant="treillis" opacity={0.4} />
        <div className="relative mx-auto max-w-[560px]">
          <div className="relative mx-auto mb-6 size-19 lg:size-23">
            <div className="motion-safe:[animation:pulse-ring_2.4s_ease-out_infinite] absolute inset-0 rounded-full border-2 border-gold-200" />
            <div className="absolute inset-0 grid place-items-center rounded-full border border-gold-200/55 bg-green-700/35">
              <Check className="size-8.5 text-gold-200 lg:size-9.5" strokeWidth={1.4} />
            </div>
          </div>
          <p
            dir="rtl"
            lang="ar"
            className="motion-safe:[animation:rise_500ms_ease-out_both] mb-3.5 font-serif text-xl text-gold-200 lg:text-2xl"
          >
            {blessing}
          </p>
          <h1
            className="motion-safe:[animation-delay:80ms] motion-safe:[animation:rise_500ms_ease-out_both] mb-3.5 font-serif text-[28px] leading-[1.15] font-medium tracking-[-0.015em] lg:text-[46px] lg:leading-[1.12]"
          >
            {title}
          </h1>
          <p
            className="motion-safe:[animation-delay:160ms] motion-safe:[animation:rise_500ms_ease-out_both] mx-auto mb-7 max-w-[52ch] text-[15px] leading-[1.6] text-on-dark-muted lg:text-lg"
          >
            {body}
          </p>
          <div className="motion-safe:[animation-delay:240ms] motion-safe:[animation:rise_500ms_ease-out_both] flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button variant="gold" size="lg" asChild>
              <Link href={startLessonHref}>
                <BookOpen className="size-[18px]" strokeWidth={1.8} />
                {startLessonLabel}
              </Link>
            </Button>
            <Link
              href="/tableau-de-bord"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-on-dark/40 px-6 py-4 text-[16px] font-semibold transition-colors hover:bg-white/8"
            >
              {goDashboardLabel}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-5 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-8.5 lg:px-11 lg:py-14">
        <div className="border border-border-subtle bg-surface p-6.5 lg:p-7">
          <p className="mb-6 text-xs font-semibold tracking-[0.16em] text-gold-600 uppercase">{getStartedTitle}</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {tips.map((tip) => (
              <div key={tip.title}>
                <tip.icon className="mb-3.5 size-6 text-green-ink" strokeWidth={1.4} />
                <p className="mb-1.5 font-serif text-lg font-semibold">{tip.title}</p>
                <p className="text-sm leading-[1.6] text-text-muted">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border-subtle bg-surface p-6.5 lg:p-7">
          <div className="mb-5 flex items-baseline justify-between">
            <span className="text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">{receiptTitle}</span>
            <span className="rounded-sm bg-success-bg px-2.5 py-1 text-xs font-semibold text-success">
              {paidBadge}
            </span>
          </div>
          <div className="flex flex-col gap-3 border-b border-hairline pb-4.5 text-[15px]">
            <div className="flex justify-between">
              <span className="text-text-muted">{reference}</span>
              <span dir="ltr" className="tabular-nums">
                {refValue}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">{dateLabel}</span>
              <span>{dateValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">{methodLabel}</span>
              <span>{methodValue}</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between py-4.5">
            <span className="text-[15px] font-semibold">{amountPaidLabel}</span>
            <span className="font-serif text-2xl font-semibold">{amountLabel}</span>
          </div>
          <Button variant="secondary" className="w-full" onClick={handleDownload} loading={downloading}>
            <Download className="size-4" strokeWidth={1.7} />
            {downloadReceiptLabel}
          </Button>
          <p className="mt-4 text-[13px] text-text-muted">{emailedToLabel}</p>
        </div>
      </div>
    </div>
  );
}

export { SuccessState };
