import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface TabItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}

export interface MobileTabBarProps {
  items: TabItem[];
  className?: string;
}

function MobileTabBar({ items, className }: MobileTabBarProps) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex h-14 border-t border-border-subtle bg-surface/90 backdrop-blur-md lg:hidden",
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-1 text-text-muted",
            item.active && "text-green-ink",
          )}
        >
          <item.icon className="size-[21px]" strokeWidth={1.5} />
          <span className="text-[11px] font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export { MobileTabBar };
