"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { LanguageSwitcher } from "@/components/patterns/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useScrolled } from "@/lib/use-scrolled";

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface PublicHeaderProps {
  navItems: NavItem[];
  loginLabel: string;
  loginHref: string;
  signupLabel: string;
  signupHref: string;
  wordmark?: string;
}

function PublicHeader({
  navItems,
  loginLabel,
  loginHref,
  signupLabel,
  signupHref,
  wordmark,
}: PublicHeaderProps) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[60px] items-center border-b bg-surface px-4 transition-colors duration-200 lg:h-[76px] lg:px-11",
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

      <div className="ms-auto hidden items-center gap-5 lg:flex">
        <LanguageSwitcher variant="segmented" />
        <Link
          href={loginHref}
          className="rounded-sm px-1 py-1.5 text-[15px] text-text-soft outline-none transition-colors hover:text-green-ink focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]"
        >
          {loginLabel}
        </Link>
        <Button variant="primary" size="sm" asChild>
          <Link href={signupHref}>{signupLabel}</Link>
        </Button>
      </div>

      <div className="ms-auto flex items-center gap-2 lg:hidden">
        <LanguageSwitcher variant="compact" />
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="grid size-11 place-items-center rounded-sm text-text outline-none focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]"
        >
          <Menu className="size-6" strokeWidth={1.5} />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-none">
          <SheetHeader>
            <SheetTitle>
              <Logo wordmark={wordmark} />
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-3 text-[17px] text-text-soft outline-none transition-colors hover:bg-hairline focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 p-4">
            <Button variant="secondary" asChild>
              <Link href={loginHref}>{loginLabel}</Link>
            </Button>
            <Button variant="primary" asChild>
              <Link href={signupHref}>{signupLabel}</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export { PublicHeader };
