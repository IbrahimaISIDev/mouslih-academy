import { describe, expect, it } from "vitest";
import { findLessonLocation } from "./find-lesson";
import { courses } from "@/mocks/courses";

describe("findLessonLocation", () => {
  const fatiha = courses.find((c) => c.slug === "rectification-fatiha")!;

  it("localise la vidéo 3 comme la troisième des cinq vidéos du programme", () => {
    const location = findLessonLocation(fatiha, "fatiha-v03");
    expect(location).not.toBeNull();
    expect(location?.lessonIndex).toBe(3);
    expect(location?.totalLessons).toBe(5);
    expect(location?.moduleIndex).toBe(0);
  });

  it("renvoie null pour une leçon inexistante", () => {
    expect(findLessonLocation(fatiha, "does-not-exist")).toBeNull();
  });
});
