import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { StickyCta } from "@/components/patterns/sticky-cta";

export interface CheckoutStickyCtaProps {
  payHref: string;
  totalLabel: string;
  total: string;
  payButtonLabel: string;
}

function CheckoutStickyCta({ payHref, totalLabel, total, payButtonLabel }: CheckoutStickyCtaProps) {
  return (
    <StickyCta
      priceLabel={totalLabel}
      price={total}
      action={
        <Button className="w-full" asChild>
          <Link href={payHref}>{payButtonLabel}</Link>
        </Button>
      }
    />
  );
}

export { CheckoutStickyCta };
