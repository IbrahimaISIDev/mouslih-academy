import { cn } from "@/lib/utils";

export interface StickyCtaProps {
  priceLabel: string;
  price: string;
  action: React.ReactNode;
  className?: string;
}

/** Barre fixe mobile — prévoir pb-24 sur la page qui l'utilise pour ne pas masquer le contenu. */
function StickyCta({ priceLabel, price, action, className }: StickyCtaProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-border-subtle bg-bg/82 px-4 py-3 backdrop-blur-md lg:hidden",
        className,
      )}
    >
      <div>
        <p className="text-[11px] text-text-muted">{priceLabel}</p>
        <p className="font-serif text-[17px] font-semibold text-text">
          {price}
        </p>
      </div>
      <div className="flex-1">{action}</div>
    </div>
  );
}

export { StickyCta };
