"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { ClientApiError } from "@/lib/client-fetch";
import { createCourse } from "../api/create-course";
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

function NewCourseDialog() {
  const t = useTranslations("admin.coursesList.newDialog");
  const tAdd = useTranslations("admin.coursesList");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (title.trim().length < 3) return;
    setCreating(true);
    try {
      const course = await createCourse(title.trim());
      setOpen(false);
      setTitle("");
      router.push(`/admin/formations/${course.id}`);
    } catch (error) {
      toast.error(error instanceof ClientApiError ? error.message : t("creating"));
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">{tAdd("addButton")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <Label htmlFor="new-course-title" className="mb-2 block">
            {t("titleFieldLabel")}
          </Label>
          <Input
            id="new-course-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("titlePlaceholder")}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button type="button" onClick={handleCreate} loading={creating} disabled={title.trim().length < 3}>
            {t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { NewCourseDialog };
