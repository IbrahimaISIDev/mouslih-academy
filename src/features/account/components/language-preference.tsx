"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const OPTIONS: { value: Locale; label: string; fontClassName: string }[] = [
  { value: "fr", label: "Français", fontClassName: "font-sans" },
  { value: "en", label: "English", fontClassName: "font-sans" },
  { value: "ar", label: "العربية", fontClassName: "font-arabic-sans" },
];

function LanguagePreference({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations("profile.language");
  const [selected, setSelected] = useState<Locale>(currentLocale);

  return (
    <div className="border border-border-subtle bg-surface p-6 lg:p-7.5">
      <h2 className="mb-6 font-serif text-xl font-semibold lg:text-2xl">
        {t("title")}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-3 rounded-sm border p-5.5 text-center transition-colors",
                isSelected
                  ? "border-green-700 bg-green-100"
                  : "border-border-strong",
              )}
            >
              <input
                type="radio"
                name="language-preference"
                value={option.value}
                checked={isSelected}
                onChange={() => setSelected(option.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  "text-2xl",
                  option.fontClassName,
                  isSelected ? "text-green-ink" : "text-text",
                )}
              >
                {option.label}
              </span>
              <span
                className={cn(
                  "size-4.5 rounded-full border-2",
                  isSelected
                    ? "border-green-700 bg-green-700"
                    : "border-border-strong",
                )}
              />
            </label>
          );
        })}
      </div>

      <p className="mt-5 text-[13px] text-text-muted">{t("note")}</p>

      <Button type="button" className="mt-6">
        {t("save")}
      </Button>
    </div>
  );
}

export { LanguagePreference };
