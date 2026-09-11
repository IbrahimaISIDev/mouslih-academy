import { describe, expect, it } from "vitest";
import { findLessonLocation } from "./find-lesson";
import { courses } from "@/mocks/courses";

describe("findLessonLocation", () => {
  const fatiha = courses.find((c) => c.slug === "rectification-fatiha")!;

  it("localise la leçon 6 comme la sixième du programme, dans le module 2", () => {
    const location = findLessonLocation(fatiha, "l6");
    expect(location).not.toBeNull();
    expect(location?.lessonIndex).toBe(6);
    expect(location?.totalLessons).toBe(11);
    expect(location?.moduleIndex).toBe(1);
  });

  it("renvoie null pour une leçon inexistante", () => {
    expect(findLessonLocation(fatiha, "does-not-exist")).toBeNull();
  });
});
