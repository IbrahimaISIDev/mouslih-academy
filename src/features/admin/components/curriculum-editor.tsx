"use client";

import { useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, PlayCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AdminLessonVideoState, Lesson, Module } from "@/lib/types";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import { reorderCourseLessons, reorderCourseModules } from "@/features/admin/api/reorder-course-modules";

export interface CurriculumEditorProps {
  courseId: string;
  initialModules: Module[];
  videoStatus: Record<string, AdminLessonVideoState>;
  addModuleLabel: string;
}

function moduleDndId(moduleId: string) {
  return `module:${moduleId}`;
}
function lessonDndId(lessonId: string) {
  return `lesson:${lessonId}`;
}

function findLessonGroup(modules: Module[], lessonId: string) {
  for (const courseModule of modules) {
    for (const subModule of courseModule.subModules) {
      if (subModule.lessons.some((l) => l.id === lessonId)) {
        return { moduleId: courseModule.id, subModuleId: subModule.id, lessons: subModule.lessons };
      }
    }
  }
  return null;
}

function LessonRow({
  lesson,
  video,
  labels,
}: {
  lesson: Lesson;
  video: AdminLessonVideoState;
  labels: { videoReady: string; videoMissing: string; uploading: (pct: number) => string };
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lessonDndId(lesson.id),
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 border-t border-hairline px-6 py-2.75",
        isDragging && "relative z-10 bg-surface shadow-card-hover",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab text-text-faint focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_var(--color-focus-ring)] active:cursor-grabbing"
      >
        <GripVertical className="size-[14px]" strokeWidth={1.8} />
      </button>
      <PlayCircle className="size-[17px] shrink-0 text-green-ink" strokeWidth={1.6} />
      <span className="flex-1 text-sm">{lesson.title.fr}</span>

      {video.status === "uploading" && (
        <div className="flex w-[200px] items-center gap-2.5">
          <div className="h-[5px] flex-1 overflow-hidden rounded-sm bg-border-subtle">
            <div className="h-full bg-green-700" style={{ width: `${video.uploadPct ?? 0}%` }} />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap text-green-ink tabular-nums">
            {labels.uploading(video.uploadPct ?? 0)}
          </span>
        </div>
      )}
      {video.status === "ready" && (
        <>
          <span dir="ltr" className="text-xs text-text-muted tabular-nums">
            {formatDuration(lesson.durationSeconds)}
          </span>
          <span className="rounded-sm bg-success-bg px-2 py-1 text-[11px] font-semibold text-success">
            {labels.videoReady}
          </span>
        </>
      )}
      {video.status === "missing" && (
        <span className="rounded-sm bg-warning-bg px-2 py-1 text-[11px] font-semibold text-warning">
          {labels.videoMissing}
        </span>
      )}
      <Trash2 className="size-4 shrink-0 text-text-faint" strokeWidth={1.6} />
    </div>
  );
}

function ModuleRow({
  courseModule,
  open,
  onToggle,
  videoStatus,
  labels,
}: {
  courseModule: Module;
  open: boolean;
  onToggle: () => void;
  videoStatus: Record<string, AdminLessonVideoState>;
  labels: {
    subModuleLabel: string;
    addLesson: string;
    videoReady: string;
    videoMissing: string;
    uploading: (pct: number) => string;
    metaWithSubModules: (subModules: number, lessons: number) => string;
    metaLessonsOnly: (lessons: number) => string;
  };
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: moduleDndId(courseModule.id),
  });

  const lessonCount = courseModule.subModules.reduce((acc, sm) => acc + sm.lessons.length, 0);
  const subModuleCount = courseModule.subModules.filter((sm) => sm.title).length;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("border-b border-border-subtle", isDragging && "relative z-10 bg-surface shadow-card-hover")}
    >
      <div className={cn("flex items-center gap-3 px-6 py-3.5", open && "bg-bg")}>
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab text-text-faint focus-visible:outline-none focus-visible:[box-shadow:0_0_0_3px_var(--color-focus-ring)] active:cursor-grabbing"
        >
          <GripVertical className="size-[15px]" strokeWidth={1.8} />
        </button>
        <span className="w-5 shrink-0 font-serif text-[13px] text-gold-600">
          {String(courseModule.order).padStart(2, "0")}
        </span>
        <button type="button" onClick={onToggle} className="flex-1 text-start">
          <p className="text-base font-semibold">{courseModule.title.fr}</p>
          <p className="mt-0.5 text-xs text-text-muted">
            {subModuleCount > 0
              ? labels.metaWithSubModules(subModuleCount, lessonCount)
              : labels.metaLessonsOnly(lessonCount)}
          </p>
        </button>
        <Pencil className="size-[17px] shrink-0 text-text-muted" strokeWidth={1.6} />
        <Trash2 className="size-[17px] shrink-0 text-text-muted" strokeWidth={1.6} />
        <button type="button" onClick={onToggle} className="w-3.5 shrink-0 text-center text-base text-text-muted">
          {open ? "−" : "+"}
        </button>
      </div>

      {open && (
        <div className="bg-row-hover">
          {courseModule.subModules.map((subModule) => (
            <div key={subModule.id}>
              {subModule.title && (
                <div className="flex items-center gap-2.5 border-t border-hairline py-2.75 ps-14 pe-6">
                  <span className="h-px w-3.5 bg-gold-600" />
                  <span className="flex-1 text-xs font-semibold tracking-[0.1em] text-text-muted uppercase">
                    {subModule.title.fr}
                  </span>
                  <span className="text-xs text-text-faint">{labels.subModuleLabel}</span>
                </div>
              )}
              <SortableContext
                items={subModule.lessons.map((l) => lessonDndId(l.id))}
                strategy={verticalListSortingStrategy}
              >
                {subModule.lessons.map((lesson) => (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    video={videoStatus[lesson.id] ?? { status: "ready" }}
                    labels={labels}
                  />
                ))}
              </SortableContext>
              <div className="border-t border-hairline py-2.5 ps-14 pe-6">
                <span className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-green-ink">
                  <Plus className="size-3.5" strokeWidth={2} />
                  {labels.addLesson}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CurriculumEditor({ courseId, initialModules, videoStatus, addModuleLabel }: CurriculumEditorProps) {
  const t = useTranslations("admin.course.curriculum");
  const [modules, setModules] = useState(initialModules);
  const [openModuleId, setOpenModuleId] = useState<string | null>(initialModules[1]?.id ?? initialModules[0]?.id ?? null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId.startsWith("module:")) {
      const oldIndex = modules.findIndex((m) => moduleDndId(m.id) === activeId);
      const newIndex = modules.findIndex((m) => moduleDndId(m.id) === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      const previous = modules;
      const reordered = arrayMove(modules, oldIndex, newIndex);
      setModules(reordered);
      reorderCourseModules(courseId, reordered.map((m) => m.id)).catch(() => setModules(previous));
      return;
    }

    if (activeId.startsWith("lesson:")) {
      const lessonId = activeId.replace("lesson:", "");
      const group = findLessonGroup(modules, lessonId);
      if (!group) return;
      const oldIndex = group.lessons.findIndex((l) => lessonDndId(l.id) === activeId);
      const newIndex = group.lessons.findIndex((l) => lessonDndId(l.id) === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      const previous = modules;
      const reorderedLessons = arrayMove(group.lessons, oldIndex, newIndex);
      setModules(
        modules.map((m) =>
          m.id !== group.moduleId
            ? m
            : {
                ...m,
                subModules: m.subModules.map((sm) =>
                  sm.id !== group.subModuleId ? sm : { ...sm, lessons: reorderedLessons },
                ),
              },
        ),
      );
      reorderCourseLessons(courseId, group.subModuleId, reorderedLessons.map((l) => l.id)).catch(() =>
        setModules(previous),
      );
    }
  }

  const labels = {
    subModuleLabel: t("subModuleLabel"),
    addLesson: t("addLesson"),
    videoReady: t("videoReady"),
    videoMissing: t("videoMissing"),
    uploading: (pct: number) => t("uploading", { pct }),
    metaWithSubModules: (subModules: number, lessons: number) => t("metaWithSubModules", { subModules, lessons }),
    metaLessonsOnly: (lessons: number) => t("metaLessonsOnly", { lessons }),
  };

  return (
    <div className="border border-border-subtle bg-surface">
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4.5">
        <div>
          <h2 className="mb-0.5 font-serif text-xl font-semibold">{t("title")}</h2>
          <p className="text-[13px] text-text-muted">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-sm border border-green-700 px-4 py-2.5 text-sm font-semibold text-green-ink"
        >
          <Plus className="size-[15px]" strokeWidth={2} />
          {addModuleLabel}
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules.map((m) => moduleDndId(m.id))} strategy={verticalListSortingStrategy}>
          {modules.map((courseModule) => (
            <ModuleRow
              key={courseModule.id}
              courseModule={courseModule}
              open={openModuleId === courseModule.id}
              onToggle={() => setOpenModuleId(openModuleId === courseModule.id ? null : courseModule.id)}
              videoStatus={videoStatus}
              labels={labels}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export { CurriculumEditor };
