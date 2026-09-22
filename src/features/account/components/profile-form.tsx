"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { LearnerProfile } from "@/mocks/learner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

function ProfileForm({ profile }: { profile: LearnerProfile }) {
  const t = useTranslations("profile.personal");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone || "",
      city: profile.city,
    },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success(t("savedToast"));
  }

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-border-subtle bg-surface p-6 lg:p-7.5"
    >
      <h2 className="mb-6 font-serif text-xl font-semibold lg:text-2xl">
        {t("title")}
      </h2>

      <div className="mb-6.5 flex items-center gap-5 border-b border-hairline pb-6.5">
        <Avatar className="size-17">
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <Button type="button" variant="secondary" size="sm" className="mb-2">
            {t("changePhoto")}
          </Button>
          <p className="text-[13px] text-text-faint">{t("photoHint")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="profile-firstname" className="mb-2 block">
            {t("firstName")}
          </Label>
          <Input id="profile-firstname" {...register("firstName")} />
        </div>
        <div>
          <Label htmlFor="profile-lastname" className="mb-2 block">
            {t("lastName")}
          </Label>
          <Input id="profile-lastname" {...register("lastName")} />
        </div>
        <div>
          <Label htmlFor="profile-email" className="mb-2 block">
            {t("email")}
          </Label>
          <Input id="profile-email" type="email" {...register("email")} />
        </div>
        <div>
          <Label htmlFor="profile-phone" className="mb-2 block">
            {t("phone")}
          </Label>
          <Input id="profile-phone" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="profile-city" className="mb-2 block">
            {t("city")}
          </Label>
          <Input id="profile-city" {...register("city")} />
        </div>
      </div>

      <div className="mt-7 flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          <span className="lg:hidden">{t("saveMobile")}</span>
          <span className="hidden lg:inline">{t("save")}</span>
        </Button>
        <Button type="button" variant="ghost" onClick={() => reset()}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}

export { ProfileForm };
