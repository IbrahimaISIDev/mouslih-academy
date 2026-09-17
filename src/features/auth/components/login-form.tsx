"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { login } from "@/features/auth/api/login";
import { safeRedirectPath } from "@/lib/safe-redirect";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/patterns/password-input";
import { FieldError } from "@/components/patterns/field-error";
import { Alert } from "@/components/patterns/alert";

export interface LoginFormProps {
  redirectTo?: string;
}

function LoginForm({ redirectTo }: LoginFormProps) {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const [serverError, setServerError] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(false);
    try {
      await login(values);
      router.push(safeRedirectPath(redirectTo) ?? "/tableau-de-bord");
    } catch {
      setServerError(true);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {serverError && (
        <Alert
          variant="failed"
          title={t("errorTitle")}
          description={t("errorDescription")}
        />
      )}

      <div>
        <Label htmlFor="login-email" className="mb-2 block">
          {t("emailLabel")}
        </Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <Label htmlFor="login-password">{t("passwordLabel")}</Label>
          <Link
            href="/mot-de-passe-oublie"
            className="text-[13px] font-semibold text-green-ink"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <Controller
        control={control}
        name="rememberMe"
        render={({ field }) => (
          <label className="flex items-center gap-2.5 text-[15px] text-text-soft">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            {t("rememberMe")}
          </label>
        )}
      />

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        loadingLabel={t("submitLoading")}
        disabled={isSubmitted && !isValid}
      >
        {t("submit")}
      </Button>
    </form>
  );
}

export { LoginForm };
