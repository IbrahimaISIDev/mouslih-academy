"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import type { Course, Level, Locale } from "@/lib/types";
import { formatTotalDuration } from "@/lib/format";
import { ClientApiError } from "@/lib/client-fetch";
import { StatusBadge } from "@/components/patterns/status-badge";
import { updateCourse } from "../api/update-course";
import { deleteCourse } from "../api/delete-course";
import { TranslationEditorCard, type TranslationEditorValues } from "./translation-editor-card";
import { CourseSettingsCard } from "./course-settings-card";
import { CoverImageCard } from "./cover-image-card";
import { CurriculumEditor } from "./curriculum-editor";
import { CourseActionBar, type SaveState } from "./course-action-bar";

export interface CourseEditorFormProps {
  courseId: string;
  locale: Locale;
  initialCourse: Course;
  videoStatus: Record<string, { status: "ready" | "uploading" | "missing"; uploadPct?: number }>;
  translationDoneCounts?: Partial<Record<Locale, number>>;
}

function CourseEditorForm({ courseId, locale, initialCourse, videoStatus, translationDoneCounts }: CourseEditorFormProps) {
  const t = useTranslations("admin.course");
  const router = useRouter();

  const [course, setCourse] = useState(initialCourse);
  const [translations, setTranslations] = useState<TranslationEditorValues>({
    title: initialCourse.title,
    subtitle: initialCourse.subtitle,
    description: initialCourse.description,
  });
  const [level, setLevel] = useState<Level>(initialCourse.level);
  const [priceXof, setPriceXof] = useState(initialCourse.priceXof);
  const [hasCertificate, setHasCertificate] = useState(initialCourse.hasCertificate);
  const [hasVoiceCorrection, setHasVoiceCorrection] = useState(initialCourse.hasVoiceCorrection);

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const isDirty = useMemo(() => {
    return (
      (["fr", "en", "ar"] as const).some(
        (l) =>
          translations.title[l] !== course.title[l] ||
          translations.subtitle[l] !== course.subtitle[l] ||
          translations.description[l] !== course.description[l],
      ) ||
      level !== course.level ||
      priceXof !== course.priceXof ||
      hasCertificate !== course.hasCertificate ||
      hasVoiceCorrection !== course.hasVoiceCorrection
    );
  }, [translations, level, priceXof, hasCertificate, hasVoiceCorrection, course]);

  const displaySaveState: SaveState = saveState === "idle" && isDirty ? "dirty" : saveState;

  function updateTranslation(field: keyof TranslationEditorValues, loc: Locale, value: string) {
    setTranslations((prev) => ({ ...prev, [field]: { ...prev[field], [loc]: value } }));
    setSaveState("idle");
  }

  async function handleSave() {
    setSaveState("saving");
    try {
      const { course: updated } = await updateCourse(courseId, {
        level,
        priceXof,
        hasCertificate,
        hasVoiceCorrection,
        translations: {
          fr: { title: translations.title.fr, subtitle: translations.subtitle.fr, description: translations.description.fr },
          en: { title: translations.title.en, subtitle: translations.subtitle.en, description: translations.description.en },
          ar: { title: translations.title.ar, subtitle: translations.subtitle.ar, description: translations.description.ar },
        },
      });
      setCourse(updated);
      setSaveState("saved");
      toast.success(t("actionBar.saved"));
    } catch (error) {
      setSaveState("error");
      toast.error(error instanceof ClientApiError ? error.message : t("actionBar.saveErrorToast"));
    }
  }

  async function handleTogglePublish() {
    setPublishing(true);
    try {
      const nextStatus = course.status === "published" ? "draft" : "published";
      const { course: updated } = await updateCourse(courseId, { status: nextStatus });
      setCourse(updated);
      toast.success(nextStatus === "published" ? t("publishedToast") : t("unpublishedToast"));
    } catch (error) {
      toast.error(error instanceof ClientApiError ? error.message : t("actionBar.saveErrorToast"));
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(t("deleteConfirm", { title: course.title[locale] }))) return;
    setDeleting(true);
    try {
      await deleteCourse(courseId);
      toast.success(t("deletedToast"));
      router.push("/admin/formations");
    } catch (error) {
      toast.error(error instanceof ClientApiError ? error.message : t("actionBar.saveErrorToast"));
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="border-b border-border-subtle bg-surface px-8.5 pt-5.5">
        <p className="mb-3.5 text-[13px] text-text-muted">
          {t("breadcrumb")} <span className="mx-2 inline-block rtl:scale-x-[-1]">›</span>
          <span className="text-text-soft">{translations.title[locale]}</span>
        </p>
        <div className="mb-5.5 flex items-start justify-between gap-7">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="font-serif text-[30px] font-medium">{translations.title[locale]}</h1>
              <StatusBadge
                status={course.status === "draft" ? "draft" : "paid"}
                label={course.status === "draft" ? t("status.draft") : t("status.published")}
              />
            </div>
            <p className="text-sm text-text-muted">
              {t("meta", {
                modules: course.modules.length,
                lessons: course.lessonCount,
                duration: formatTotalDuration(course.totalDurationSeconds),
              })}
            </p>
          </div>
          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              className="rounded-sm border border-border-strong px-4.5 py-2.75 text-sm font-semibold text-text-soft"
            >
              {t("previewLearner")}
            </button>
          </div>
        </div>
        <div className="flex gap-1">
          <span className="border-b-2 border-green-700 px-4 py-3 text-[15px] font-semibold text-green-ink">
            {t("tabs.content")}
          </span>
          <span className="px-4 py-3 text-[15px] text-text-muted">{t("tabs.info")}</span>
          <span className="px-4 py-3 text-[15px] text-text-muted">{t("tabs.pricing")}</span>
          <span className="px-4 py-3 text-[15px] text-text-muted">{t("tabs.learners")}</span>
        </div>
      </div>

      <div className="flex-1 px-8.5 py-7">
        <div className="mb-6">
          <TranslationEditorCard
            translationStatus={course.translationStatus}
            lessonCount={course.lessonCount}
            translationDoneCounts={translationDoneCounts}
            values={translations}
            onChange={updateTranslation}
          />
        </div>

        <div className="grid grid-cols-[1fr_340px] items-start gap-6">
          <CurriculumEditor courseId={course.id} initialModules={course.modules} videoStatus={videoStatus} addModuleLabel={t("curriculum.addModule")} />

          <div className="flex flex-col gap-5">
            <CoverImageCard title={t("cover.title")} replaceLabel={t("cover.replace")} />
            <CourseSettingsCard
              title={t("settings.title")}
              levelLabel={t("settings.level")}
              levelOptions={{
                beginner: t("settings.levels.beginner"),
                intermediate: t("settings.levels.intermediate"),
                advanced: t("settings.levels.advanced"),
              }}
              level={level}
              onLevelChange={(v) => {
                setLevel(v);
                setSaveState("idle");
              }}
              priceLabel={t("settings.price")}
              priceXof={priceXof}
              onPriceChange={(v) => {
                setPriceXof(v);
                setSaveState("idle");
              }}
              certificateLabel={t("settings.certificate")}
              certificateHelp={t("settings.certificateHelp")}
              voiceCorrectionLabel={t("settings.voiceCorrection")}
              voiceCorrectionHelp={t("settings.voiceCorrectionHelp")}
              hasCertificate={hasCertificate}
              onHasCertificateChange={(v) => {
                setHasCertificate(v);
                setSaveState("idle");
              }}
              hasVoiceCorrection={hasVoiceCorrection}
              onHasVoiceCorrectionChange={(v) => {
                setHasVoiceCorrection(v);
                setSaveState("idle");
              }}
            />
          </div>
        </div>
      </div>

      <CourseActionBar
        saveState={displaySaveState}
        unsavedLabel={t("actionBar.unsavedChanges")}
        savingLabel={t("actionBar.saving")}
        savedLabel={t("actionBar.saved")}
        errorLabel={t("actionBar.saveError")}
        saveLabel={t("actionBar.save")}
        onSave={handleSave}
        deleteLabel={t("delete")}
        onDelete={handleDelete}
        deleting={deleting}
        previewLabel={t("previewLearner")}
        publishLabel={t("publish")}
        unpublishLabel={t("unpublish")}
        isPublished={course.status === "published"}
        onTogglePublish={handleTogglePublish}
        publishing={publishing}
      />
    </>
  );
}

export { CourseEditorForm };
