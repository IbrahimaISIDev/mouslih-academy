"use client";

import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/patterns/language-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/lib/use-scrolled";
import type { NavItem } from "@/components/layout/public-header";

export interface LearnerHeaderProps {
  navItems: NavItem[];
  userName: string;
  userMenuItems: { label: string; href: string }[];
  logoutLabel: string;
  onLogout: () => void | Promise<void>;
  wordmark?: string;
}

function LearnerHeader({
  navItems,
  userName,
  userMenuItems,
  logoutLabel,
  onLogout,
  wordmark,
}: LearnerHeaderProps) {
  const initial = userName.charAt(0).toUpperCase();
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[60px] items-center gap-6 border-b bg-surface px-4 transition-colors duration-200 lg:h-[76px] lg:px-11",
        scrolled ? "border-border-strong" : "border-border-subtle",
      )}
    >
      <Link
        href="/"
        className="rounded-sm outline-none focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]"
      >
        <Logo wordmark={wordmark} />
      </Link>

      <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-sm px-1 py-1.5 text-[15px] text-text-soft outline-none transition-colors hover:text-green-ink focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]",
              item.active && "border-b-2 border-green-700 text-text",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ms-auto flex items-center gap-4">
        <LanguageSwitcher
          variant="segmented"
          className="hidden lg:inline-flex"
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-sm outline-none focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]">
            <Avatar size="sm" className="size-[34px] bg-green-100">
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
            <span className="hidden text-[15px] text-text sm:inline">
              {userName}
            </span>
            <ChevronDown className="size-4 text-text-muted" strokeWidth={1.5} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {userMenuItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <form action={onLogout} className="w-full">
                <button type="submit" className="w-full text-start">
                  {logoutLabel}
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export { LearnerHeader };
