"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.ComponentProps<"input"> & {
  toggleLabel?: string;
};

function PasswordInput({
  className,
  toggleLabel = "Afficher le mot de passe",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pe-11", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={toggleLabel}
        className="absolute end-0 top-0 grid h-11 w-11 place-items-center text-text-muted"
      >
        {visible ? (
          <EyeOff className="size-[18px]" strokeWidth={1.6} />
        ) : (
          <Eye className="size-[18px]" strokeWidth={1.6} />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
