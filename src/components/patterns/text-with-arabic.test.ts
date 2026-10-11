import { describe, expect, it } from "vitest";
import { splitArabicRuns } from "./text-with-arabic";

describe("splitArabicRuns", () => {
  it("isole un mot arabe vocalisé au milieu d'une phrase française", () => {
    expect(splitArabicRuns("Articuler الْحَمْدُ sans son nasal")).toEqual([
      { text: "Articuler ", arabic: false },
      { text: "الْحَمْدُ", arabic: true },
      { text: " sans son nasal", arabic: false },
    ]);
  });

  it("garde ensemble un passage de plusieurs mots arabes", () => {
    expect(splitArabicRuns("Lier اهْدِنَا الصِّرَاطَ correctement")).toEqual([
      { text: "Lier ", arabic: false },
      { text: "اهْدِنَا الصِّرَاطَ", arabic: true },
      { text: " correctement", arabic: false },
    ]);
  });

  it("sépare deux lettres reliées par « et »", () => {
    const parts = splitArabicRuns("Distinguer ت et ط");
    expect(parts.filter((p) => p.arabic).map((p) => p.text)).toEqual([
      "ت",
      "ط",
    ]);
  });

  it("renvoie un seul segment latin sans arabe", () => {
    expect(splitArabicRuns("Objectif")).toEqual([
      { text: "Objectif", arabic: false },
    ]);
  });
});
