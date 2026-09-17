"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { signupSchema, type SignupFormValues } from "@/features/auth/schemas";
import { signup } from "@/features/auth/api/signup";
import { getPasswordStrength } from "@/features/auth/password-strength";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/patterns/password-input";
import { FieldError } from "@/components/patterns/field-error";

function SignupForm() {
  const t = useTranslations("auth.signup");
  const tStrength = useTranslations("auth.passwordStrength");
  const router = useRouter();
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted, isValid, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      acceptTerms: false,
    },
  });

  const strength = getPasswordStrength(password);
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

  async function onSubmit(values: SignupFormValues) {
    await signup(signupSchema.parse(values));
    router.push("/tableau-de-bord");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4.5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="signup-firstname" className="mb-2 block">
            {t("firstNameLabel")}
          </Label>
          <Input
            id="signup-firstname"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div>
          <Label htmlFor="signup-lastname" className="mb-2 block">
            {t("lastNameLabel")}
          </Label>
          <Input
            id="signup-lastname"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="signup-email" className="mb-2 block">
          {t("emailLabel")}
        </Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="signup-phone" className="mb-2 block">
          {t("phoneLabel")}
        </Label>
        <div
          className={cn(
            "flex h-11 items-center gap-2.5 rounded-sm border border-border-strong bg-surface px-3.5 transition-colors focus-within:border-green-700 focus-within:shadow-[0_0_0_3px_var(--color-focus-ring)]",
            errors.phone && "border-error bg-error-field-bg",
          )}
        >
          <span className="text-[15px] text-text-muted">+221</span>
          <span className="h-4.5 w-px bg-border-subtle" />
          <input
            id="signup-phone"
            type="tel"
            autoComplete="tel-national"
            placeholder={t("phonePlaceholder")}
            aria-invalid={!!errors.phone}
            className="w-full flex-1 bg-transparent text-[15px] text-text outline-none placeholder:text-text-faint"
            {...register("phone")}
          />
        </div>
        <FieldError message={errors.phone?.message} />
        {!errors.phone && (
          <p className="mt-1.5 text-[13px] text-text-muted">{t("phoneHelp")}</p>
        )}
      </div>

      <div>
        <Label htmlFor="signup-password" className="mb-2 block">
          {t("passwordLabel")}
        </Label>
        <PasswordInput
          id="signup-password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password", {
            onChange: (e) => setPassword(e.target.value),
          })}
        />
        <FieldError message={errors.password?.message} />
        {!errors.password && password.length > 0 && (
          <>
            <div className="mt-2.5 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-[3px] flex-1",
                    i < strength.segments ? strengthColor : "bg-border-subtle",
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

      <Controller
        control={control}
        name="acceptTerms"
        render={({ field }) => (
          <div className="flex items-start gap-2.5">
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-invalid={!!errors.acceptTerms}
              className="mt-0.5"
            />
            <label className="text-sm leading-[1.55] text-text-soft">
              {t("termsPrefix")}{" "}
              <Link
                href="/conditions-utilisation"
                target="_blank"
                className="rounded-sm font-semibold text-green-ink outline-none hover:underline focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]"
              >
                {t("termsLink1")}
              </Link>{" "}
              {t("termsMiddle")}{" "}
              <Link
                href="/confidentialite"
                target="_blank"
                className="rounded-sm font-semibold text-green-ink outline-none hover:underline focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]"
              >
                {t("termsLink2")}
              </Link>
              .
            </label>
          </div>
        )}
      />
      <FieldError message={errors.acceptTerms?.message} />

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        loadingLabel={t("submitLoading")}
        disabled={isSubmitted && !isValid}
      >
        {t("submit")}
      </Button>

      <p className="text-center text-[13px] text-text-muted">
        {t("finalHelp")}
      </p>
    </form>
  );
}

export { SignupForm };
