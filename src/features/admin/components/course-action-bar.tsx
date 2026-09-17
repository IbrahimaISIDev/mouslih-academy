import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

export interface CourseActionBarProps {
  saveState: SaveState;
  unsavedLabel: string;
  savingLabel: string;
  savedLabel: string;
  errorLabel: string;
  saveLabel: string;
  onSave: () => void;
  deleteLabel: string;
  onDelete: () => void;
  deleting: boolean;
  previewLabel: string;
  publishLabel: string;
  unpublishLabel: string;
  isPublished: boolean;
  onTogglePublish: () => void;
  publishing: boolean;
}

function CourseActionBar({
  saveState,
  unsavedLabel,
  savingLabel,
  savedLabel,
  errorLabel,
  saveLabel,
  onSave,
  deleteLabel,
  onDelete,
  deleting,
  previewLabel,
  publishLabel,
  unpublishLabel,
  isPublished,
  onTogglePublish,
  publishing,
}: CourseActionBarProps) {
  const statusDisplay = {
    idle: null,
    dirty: (
      <span className="flex items-center gap-2 text-text-muted">
        <AlertTriangle className="size-4 text-warning" strokeWidth={1.8} />
        {unsavedLabel}
      </span>
    ),
    saving: (
      <span className="flex items-center gap-2 text-text-muted">
        <Loader2 className="size-4 animate-spin" strokeWidth={1.8} />
        {savingLabel}
      </span>
    ),
    saved: (
      <span className="flex items-center gap-2 text-text-muted">
        <Check className="size-4 text-success" strokeWidth={1.8} />
        {savedLabel}
      </span>
    ),
    error: (
      <span className="flex items-center gap-2 text-error">
        <AlertTriangle className="size-4" strokeWidth={1.8} />
        {errorLabel}
      </span>
    ),
  }[saveState];

  return (
    <div className="sticky bottom-0 flex items-center justify-between border-t border-border-subtle bg-surface px-8.5 py-4">
      <div className="flex items-center gap-2.5 text-sm">{statusDisplay}</div>
      <div className="flex gap-2.5">
        <Button variant="destructive" onClick={onDelete} loading={deleting}>
          {deleteLabel}
        </Button>
        <button
          type="button"
          className="rounded-sm border border-border-strong px-6 py-[13px] text-[15px] font-semibold text-text-soft"
        >
          {previewLabel}
        </button>
        <Button variant="primary" onClick={onSave} loading={saveState === "saving"}>
          {saveLabel}
        </Button>
        <Button variant="secondary" onClick={onTogglePublish} loading={publishing}>
          {isPublished ? unpublishLabel : publishLabel}
        </Button>
      </div>
    </div>
  );
}

export { CourseActionBar };
