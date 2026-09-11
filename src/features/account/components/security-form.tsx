"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/types";
import { getPasswordStrength } from "@/features/auth/password-strength";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/patterns/password-input";
import { FieldError } from "@/components/patterns/field-error";

interface SecurityFormValues {
  current: string;
  next: string;
  confirm: string;
}

function SecurityForm({
  passwordChangedAt,
  locale,
}: {
  passwordChangedAt: string;
  locale: Locale;
}) {
  const t = useTranslations("profile.security");
  const tStrength = useTranslations("auth.passwordStrength");
  const [nextPassword, setNextPassword] = useState("");

  const { register, handleSubmit, watch } = useForm<SecurityFormValues>({
    defaultValues: { current: "", next: "", confirm: "" },
  });

  const confirm = watch("confirm");
  const mismatch = confirm.length > 0 && confirm !== nextPassword;
  const strength = getPasswordStrength(nextPassword);
  const strengthColor =
    strength.level === "weak"
      ? "bg-error"
      : strength.level === "medium"
        ? "bg-warning"
        : "bg-success";
  const strengthTextColor =
    strength.level === "weak"
      ? "text-error"
      : strength.level === "medium"
        ? "text-warning"
        : "text-success";
  const strengthHint =
    strength.hintKey === "min"
      ? tStrength("hintMin")
      : strength.hintKey === "addDigit"
        ? tStrength("hintAddDigit")
        : tStrength("hintAddUppercase");

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(passwordChangedAt));
  const canSubmit = nextPassword.length >= 8 && !mismatch && confirm.length > 0;

  return (
    <form
      onSubmit={handleSubmit(() => {})}
      className="border border-border-subtle bg-surface p-6 lg:p-7.5"
    >
      <h2 className="mb-2 font-serif text-xl font-semibold lg:text-2xl">
        {t("title")}
      </h2>
      <p className="mb-6 text-sm text-text-muted lg:text-[15px]">
        {t("lastChanged", { date: formattedDate })}
      </p>

      <div className="grid max-w-xl grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="security-current" className="mb-2 block">
            {t("current")}
          </Label>
          <PasswordInput
            id="security-current"
            autoComplete="current-password"
            {...register("current")}
          />
        </div>
        <div>
          <Label htmlFor="security-next" className="mb-2 block">
            {t("new")}
          </Label>
          <PasswordInput
            id="security-next"
            autoComplete="new-password"
            {...register("next", {
              onChange: (e) => setNextPassword(e.target.value),
            })}
          />
          {nextPassword.length > 0 && (
            <>
              <div className="mt-2.5 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-[3px] flex-1",
                      i < strength.segments
                        ? strengthColor
                        : "bg-border-subtle",
                    )}
                  />
                ))}
              </div>
              <p className={cn("mt-1.5 text-[13px]", strengthTextColor)}>
                {tStrength(strength.level as "weak" | "medium" | "strong")} ·{" "}
                {strengthHint}
              </p>
            </>
          )}
        </div>
        <div>
          <Label htmlFor="security-confirm" className="mb-2 block">
            {t("confirm")}
          </Label>
          <PasswordInput
            id="security-confirm"
            autoComplete="new-password"
            aria-invalid={mismatch}
            {...register("confirm")}
          />
          <FieldError message={mismatch ? t("mismatch") : undefined} />
        </div>
      </div>

      <p className="mt-5 max-w-xl text-[13px] text-text-muted">
        {t("otherDevices")}
      </p>

      <Button type="submit" disabled={!canSubmit} className="mt-6">
        {t("update")}
      </Button>
    </form>
  );
}

export { SecurityForm };
