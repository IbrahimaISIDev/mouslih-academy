import { describe, expect, it } from "vitest";
import { getLessonState } from "./get-lesson-state";
import type { Enrollment, Lesson } from "@/lib/types";

function makeLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: "l1",
    slug: "l1",
    title: { fr: "Leçon", en: "Lesson", ar: "درس" },
    durationSeconds: 300,
    isFreePreview: false,
    resources: [],
    ...overrides,
  };
}

function makeEnrollment(overrides: Partial<Enrollment> = {}): Enrollment {
  return {
    courseId: "c1",
    completedLessonIds: [],
    currentLessonId: "",
    resumeAtSeconds: 0,
    completedAt: null,
    lastActivityAt: null,
    ...overrides,
  };
}

describe("getLessonState", () => {
  it("verrouille une leçon non gratuite si la formation n'est pas achetée", () => {
    const lesson = makeLesson({ isFreePreview: false });
    expect(getLessonState(lesson, null, false)).toBe("locked");
  });

  it("laisse une leçon en aperçu gratuit accessible sans achat", () => {
    const lesson = makeLesson({ isFreePreview: true });
    expect(getLessonState(lesson, null, false)).toBe("free");
  });

  it("marque une leçon comme terminée si son id est dans completedLessonIds", () => {
    const lesson = makeLesson({ id: "l2" });
    const enrollment = makeEnrollment({ completedLessonIds: ["l2"] });
    expect(getLessonState(lesson, enrollment, true)).toBe("completed");
  });

  it("marque une leçon comme courante si elle correspond à currentLessonId", () => {
    const lesson = makeLesson({ id: "l6" });
    const enrollment = makeEnrollment({ currentLessonId: "l6" });
    expect(getLessonState(lesson, enrollment, true)).toBe("current");
  });

  it("marque une leçon comme à venir sinon, une fois la formation achetée", () => {
    const lesson = makeLesson({ id: "l7" });
    const enrollment = makeEnrollment({
      completedLessonIds: ["l1"],
      currentLessonId: "l6",
    });
    expect(getLessonState(lesson, enrollment, true)).toBe("upcoming");
  });

  it("marque une leçon comme à venir si la formation est achetée sans inscription", () => {
    const lesson = makeLesson({ id: "l1" });
    expect(getLessonState(lesson, null, true)).toBe("upcoming");
  });
});
