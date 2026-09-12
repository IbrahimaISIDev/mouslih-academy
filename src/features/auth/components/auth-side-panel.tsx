import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";
import { LanguageSwitcher } from "@/components/patterns/language-switcher";

export interface AuthSidePanelProps {
  mobileTitle: string;
  sideTitle: string;
  sideBody: string;
  bullets: string[];
  statLine: string;
  wordmark?: string;
}

function AuthSidePanel({
  mobileTitle,
  sideTitle,
  sideBody,
  bullets,
  statLine,
  wordmark,
}: AuthSidePanelProps) {
  return (
    <div className="relative flex flex-col overflow-hidden bg-green-900 px-5 py-7.5 text-on-dark lg:justify-between lg:px-13 lg:py-14">
      <GeometricPattern variant="khatam" opacity={0.4} />
      <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(12,36,29,0.7)_0%,var(--color-green-900)_82%)]" />

      <div className="relative flex items-center justify-between lg:justify-start lg:gap-3">
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring-on-dark)]"
        >
          <Logo wordmark={wordmark} variant="dark" />
        </Link>
        <LanguageSwitcher
          variant="compact"
          className="text-on-dark lg:hidden"
        />
      </div>

      <div className="relative mt-6 lg:mt-0">
        <p
          dir="rtl"
          lang="ar"
          className="mb-3 font-serif text-xl text-gold-200 lg:mb-5.5 lg:text-[26px]"
        >
          اقْرَأْ بِاسْمِ رَبِّكَ
        </p>
        <h1 className="font-serif text-[28px] leading-[1.18] font-medium lg:hidden">
          {mobileTitle}
        </h1>
        <h2 className="hidden font-serif text-[38px] leading-[1.18] font-medium tracking-[-0.01em] lg:mb-4.5 lg:block">
          {sideTitle}
        </h2>
        <p className="hidden max-w-[40ch] text-[17px] leading-[1.7] text-on-dark-muted lg:mb-8.5 lg:block">
          {sideBody}
        </p>
        <div className="hidden flex-col gap-3.5 lg:flex">
          {bullets.map((bullet) => (
            <div
              key={bullet}
              className="flex gap-2.5 text-[15px] text-on-dark-soft"
            >
              <Check
                className="mt-0.5 size-[18px] shrink-0 text-gold-200"
                strokeWidth={1.6}
              />
              {bullet}
            </div>
          ))}
        </div>
      </div>

      <p className="relative hidden text-sm text-green-300 lg:block">
        {statLine}
      </p>
    </div>
  );
}

export { AuthSidePanel };
