import { AlertCircle } from "lucide-react";

export interface SectionErrorProps {
  title: string;
  body: string;
  retryLabel: string;
  onRetry: () => void;
}

/** Erreur de chargement d'une section : la page reste utilisable, on relance juste la requête. */
function SectionError({ title, body, retryLabel, onRetry }: SectionErrorProps) {
  return (
    <div className="flex items-start gap-3 border border-error-border bg-error-bg p-4">
      <AlertCircle className="mt-0.5 size-[19px] shrink-0 text-error" strokeWidth={1.7} />
      <div className="flex-1">
        <p className="mb-1 text-[15px] font-semibold text-text">{title}</p>
        <p className="mb-3 text-sm text-text-soft">{body}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-sm border border-error-button-border bg-transparent px-4 py-2 text-sm font-semibold text-error hover:bg-error-button-hover-bg"
        >
          {retryLabel}
        </button>
      </div>
    </div>
  );
}

export { SectionError };
