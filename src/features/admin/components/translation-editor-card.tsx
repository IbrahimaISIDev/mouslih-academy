"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Course, I18nText, Locale } from "@/lib/types";
import { isRtl } from "@/lib/rtl";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const LANGS: Locale[] = ["fr", "en", "ar"];

const STATUS_DOT: Record<Course["translationStatus"][Locale], string> = {
  complete: "bg-success",
  partial: "bg-warning",
  empty: "bg-border-strong",
};

export interface TranslationEditorValues {
  title: I18nText;
  subtitle: I18nText;
  description: I18nText;
}

export interface TranslationEditorCardProps {
  translationStatus: Course["translationStatus"];
  lessonCount: number;
  translationDoneCounts?: Partial<Record<Locale, number>>;
  values: TranslationEditorValues;
  onChange: (field: keyof TranslationEditorValues, locale: Locale, value: string) => void;
}

function TranslationEditorCard({
  translationStatus,
  lessonCount,
  translationDoneCounts = {},
  values,
  onChange,
}: TranslationEditorCardProps) {
  const t = useTranslations("admin.course.translationCard");
  const [lang, setLang] = useState<Locale>("fr");

  const dir = isRtl(lang) ? "rtl" : "ltr";
  const status = translationStatus[lang];
  const statusNote =
    status === "complete"
      ? t("complete", { count: lessonCount })
      : status === "partial"
        ? t("partial", { done: translationDoneCounts[lang] ?? 0, total: lessonCount })
        : t("empty");
  const statusColor = status === "complete" ? "text-success" : status === "partial" ? "text-warning" : "text-text-faint";

  return (
    <div className="border border-border-subtle bg-surface">
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg px-6 py-4">
        <div className="flex items-center gap-3.5">
          <span className="text-xs font-semibold tracking-[0.14em] text-text-muted uppercase">{t("label")}</span>
          <div className="flex gap-1.5">
            {LANGS.map((value) => {
              const active = value === lang;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  className={cn(
                    "flex items-center gap-2 rounded-sm border px-3.5 py-2 text-sm font-semibold",
                    active ? "border-green-700 bg-green-700 text-green-ink" : "border-border-strong text-text-soft",
                  )}
                >
                  {value.toUpperCase()}
                  <span className={cn("size-[7px] rounded-full", STATUS_DOT[translationStatus[value]])} />
                </button>
              );
            })}
          </div>
        </div>
        <div className={cn("flex items-center gap-2 text-[13px]", statusColor)}>
          <Info className="size-4" strokeWidth={1.7} />
          {statusNote}
        </div>
      </div>

      <div dir={dir} className="p-6">
        <div className="mb-5.5 grid grid-cols-2 gap-5">
          <div>
            <Label htmlFor="course-title" className="mb-2 block">
              {t("titleLabel")}
            </Label>
            <Input
              id="course-title"
              value={values.title[lang]}
              onChange={(e) => onChange("title", lang, e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="course-subtitle" className="mb-2 block">
              {t("subtitleLabel")}
            </Label>
            <Input
              id="course-subtitle"
              value={values.subtitle[lang]}
              onChange={(e) => onChange("subtitle", lang, e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="course-description" className="mb-2 block">
            {t("descriptionLabel")}
          </Label>
          <Textarea
            id="course-description"
            value={values.description[lang]}
            onChange={(e) => onChange("description", lang, e.target.value)}
            className="min-h-21"
          />
        </div>
      </div>
    </div>
  );
}

export { TranslationEditorCard };
