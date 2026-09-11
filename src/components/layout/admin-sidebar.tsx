import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/patterns/language-switcher";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface AdminNavItem {
  label: string;
  /** Omis pour les entrées dont l'écran n'existe pas encore : rendues comme du texte, pas un lien mort. */
  href?: string;
  icon: LucideIcon;
  active?: boolean;
  count?: number;
}

export interface AdminSidebarProps {
  navItems: AdminNavItem[];
  userName: string;
  userRole?: string;
  wordmark?: string;
  subtitle?: string;
  className?: string;
}

function AdminSidebar({
  navItems,
  userName,
  userRole,
  wordmark,
  subtitle,
  className,
}: AdminSidebarProps) {
  const initials = getInitials(userName);

  return (
    <aside
      className={cn(
        "flex h-full w-[248px] flex-col bg-green-900 text-on-dark-muted",
        className,
      )}
    >
      <div className="border-b border-white/10 px-5 py-5">
        <Logo wordmark={wordmark} variant="dark" />
        {subtitle && <p className="mt-1 ps-[38px] text-xs text-green-300">{subtitle}</p>}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const itemClassName = cn(
            "flex items-center gap-3 rounded-sm border-s-[3px] border-transparent px-3 py-2.5 text-[15px] text-on-dark-muted outline-none transition-colors",
            item.href && "focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring-on-dark)]",
            item.active
              ? "border-gold-200 bg-gold-200/12 font-semibold text-on-dark"
              : item.href && "hover:text-on-dark",
          );
          const content = (
            <>
              <item.icon className="size-[18px] shrink-0" strokeWidth={1.5} />
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && (
                <span className="rounded-full bg-gold-200 px-2 py-0.5 text-xs font-semibold text-green-ink">
                  {item.count}
                </span>
              )}
            </>
          );

          return item.href ? (
            <Link key={item.label} href={item.href} className={itemClassName}>
              {content}
            </Link>
          ) : (
            <span key={item.label} className={itemClassName}>
              {content}
            </span>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <LanguageSwitcher tone="onDark" />
      </div>

      <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4">
        <Avatar size="sm">
          <AvatarFallback className="bg-gold-200 text-green-ink">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-[14px] text-on-dark">{userName}</div>
          {userRole && <div className="text-xs text-green-300">{userRole}</div>}
        </div>
      </div>
    </aside>
  );
}

export { AdminSidebar };
