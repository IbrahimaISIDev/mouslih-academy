import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BlockErrorProps {
  icon: LucideIcon;
  title: string;
  body: ReactNode;
  incidentRef?: string;
  actions: ReactNode;
  variant?: "neutral" | "danger";
  className?: string;
}

/** Bloc d'erreur pleine largeur (échec réseau, erreur serveur) — plus appuyé que SectionError,
 *  utilisé quand l'échec empêche un écran entier de fonctionner (pas juste une section). */
function BlockError({
  icon: Icon,
  title,
  body,
  incidentRef,
  actions,
  variant = "neutral",
  className,
}: BlockErrorProps) {
  const danger = variant === "danger";

  return (
    <div
      className={cn(
        "border px-8 py-11 text-center",
        danger ? "border-error-border bg-error-field-bg" : "border-border-subtle bg-surface",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto mb-4.5 grid size-[62px] place-items-center rounded-full border",
          danger ? "border-error-border bg-error-bg" : "border-border-subtle bg-bg",
        )}
      >
        <Icon
          className={cn("size-7", danger ? "text-error" : "text-text-muted")}
          strokeWidth={1.4}
        />
      </div>
      <h3 className="mb-2.5 font-serif text-2xl font-semibold">{title}</h3>
      <p className="mx-auto mb-1 max-w-[48ch] text-[15px] leading-[1.65] text-text-muted">{body}</p>
      {incidentRef && (
        <p dir="ltr" className="mb-6 text-[13px] text-text-faint tabular-nums">
          {incidentRef}
        </p>
      )}
      <div className={cn("flex justify-center gap-2.5", !incidentRef && "mt-6")}>{actions}</div>
    </div>
  );
}

export { BlockError };
