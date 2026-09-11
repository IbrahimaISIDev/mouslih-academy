import { ArrowRight, Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { DirectionalIcon } from "@/components/patterns/directional-icon";

export interface OrderSummaryCardProps {
  summaryTitle: string;
  subtotalLabel: string;
  subtotal: string;
  discountLabel: string;
  discount: string | null;
  waveFeeLabel: string;
  waveFee: string;
  totalLabel: string;
  total: string;
  paymentUniqueLabel: string;
  payButtonLabel: string;
  payHref: string;
  secureTransactionLabel: string;
  refundNoteLabel: string;
  questionLabel: string;
  whatsappHref: string;
}

function OrderSummaryCard({
  summaryTitle,
  subtotalLabel,
  subtotal,
  discountLabel,
  discount,
  waveFeeLabel,
  waveFee,
  totalLabel,
  total,
  paymentUniqueLabel,
  payButtonLabel,
  payHref,
  secureTransactionLabel,
  refundNoteLabel,
  questionLabel,
  whatsappHref,
}: OrderSummaryCardProps) {
  return (
    <div className="border border-gold-600 bg-surface lg:sticky lg:top-5">
      <div className="p-6.5 lg:p-7">
        <p className="mb-5 text-xs font-semibold tracking-[0.16em] text-text-muted uppercase">{summaryTitle}</p>

        <div className="flex flex-col gap-3 border-b border-hairline pb-4.5 text-[15px]">
          <div className="flex justify-between">
            <span className="text-text-soft">{subtotalLabel}</span>
            <span className="tabular-nums">{subtotal}</span>
          </div>
          {discount && (
            <div className="flex justify-between">
              <span className="text-text-soft">{discountLabel}</span>
              <span className="tabular-nums text-success">− {discount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-soft">{waveFeeLabel}</span>
            <span className="tabular-nums text-text-muted">{waveFee}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between py-4.5">
          <span className="text-base font-semibold">{totalLabel}</span>
          <span className="font-serif text-[32px] font-semibold">{total}</span>
        </div>
        <p className="mb-5.5 text-[13px] text-text-muted">{paymentUniqueLabel}</p>

        <Button size="lg" className="w-full" asChild>
          <Link href={payHref}>
            {payButtonLabel}
            <DirectionalIcon icon={ArrowRight} className="size-[18px]" strokeWidth={1.8} />
          </Link>
        </Button>

        <div className="mt-3.5 flex items-center justify-center gap-2 text-[13px] text-text-muted">
          <Shield className="size-[15px] text-success" strokeWidth={1.7} />
          {secureTransactionLabel}
        </div>
      </div>

      <div className="border-t border-hairline bg-bg p-6.5 lg:p-7">
        <p className="mb-3 text-[13px] leading-[1.6] text-text-muted">{refundNoteLabel}</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-success-border px-4 py-3 text-[14px] font-semibold text-whatsapp-hover transition-colors hover:bg-success-bg"
        >
          {questionLabel}
        </a>
      </div>
    </div>
  );
}

export { OrderSummaryCard };
