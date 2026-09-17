"use client";

import { type ReactNode, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface AddCurriculumItemDialogProps {
  trigger: ReactNode;
  dialogTitle: string;
  fieldLabel: string;
  placeholder: string;
  cancelLabel: string;
  createLabel: string;
  /** Pré-remplit le champ pour un renommage plutôt qu'une création vide. */
  initialValue?: string;
  /** Doit rejeter (après avoir déjà affiché son propre toast d'erreur) pour garder le dialogue ouvert. */
  onSubmit: (title: string) => Promise<void>;
}

function AddCurriculumItemDialog({
  trigger,
  dialogTitle,
  fieldLabel,
  placeholder,
  cancelLabel,
  createLabel,
  initialValue = "",
  onSubmit,
}: AddCurriculumItemDialogProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);

  function handleOpenChange(next: boolean) {
    if (next) setTitle(initialValue);
    setOpen(next);
  }

  async function handleSubmit() {
    if (title.trim().length < 1) return;
    setSubmitting(true);
    try {
      await onSubmit(title.trim());
      setOpen(false);
    } catch {
      // Le onSubmit appelant affiche déjà un toast d'erreur : on garde juste le dialogue ouvert.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <Label htmlFor={inputId} className="mb-2 block">
            {fieldLabel}
          </Label>
          <Input
            id={inputId}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={placeholder}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            {cancelLabel}
          </Button>
          <Button type="button" onClick={handleSubmit} loading={submitting} disabled={title.trim().length < 1}>
            {createLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { AddCurriculumItemDialog };
