import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CourseActionBarProps {
  autosavedLabel: string;
  deleteLabel: string;
  previewLabel: string;
  publishLabel: string;
}

function CourseActionBar({ autosavedLabel, deleteLabel, previewLabel, publishLabel }: CourseActionBarProps) {
  return (
    <div className="sticky bottom-0 flex items-center justify-between border-t border-border-subtle bg-surface px-8.5 py-4">
      <div className="flex items-center gap-2.5 text-sm text-text-muted">
        <Check className="size-4 text-success" strokeWidth={1.8} />
        {autosavedLabel}
      </div>
      <div className="flex gap-2.5">
        <Button variant="destructive">{deleteLabel}</Button>
        <button
          type="button"
          className="rounded-sm border border-border-strong px-6 py-[13px] text-[15px] font-semibold text-text-soft"
        >
          {previewLabel}
        </button>
        <Button variant="primary">{publishLabel}</Button>
      </div>
    </div>
  );
}

export { CourseActionBar };
