import { describe, expect, it } from "vitest";
import {
  formatDuration,
  formatPrice,
  formatTotalDuration,
  localizeDigits,
  toArabicDigits,
} from "./format";

const NBSP_NARROW = " ";

describe("toArabicDigits", () => {
  it("convertit les chiffres latins en chiffres arabes-indiens", () => {
    expect(toArabicDigits("1240")).toBe("١٢٤٠");
  });
});

describe("formatPrice", () => {
  it("formate en fr avec espace insécable et suffixe F", () => {
    expect(formatPrice(15000, "fr")).toBe(`15${NBSP_NARROW}000 F`);
  });

  it("formate en en identiquement à fr", () => {
    expect(formatPrice(15000, "en")).toBe(`15${NBSP_NARROW}000 F`);
  });

  it("formate en ar avec chiffres arabes-indiens et فرنك", () => {
    expect(formatPrice(15000, "ar")).toBe("١٥٠٠٠ فرنك");
  });
});

describe("localizeDigits", () => {
  it("convertit les chiffres d'un compteur en arabe", () => {
    expect(localizeDigits("5 / 11 leçons · 45 %", "ar")).toBe("٥ / ١١ leçons · ٤٥ %");
  });

  it("laisse le fr et l'en inchangés", () => {
    expect(localizeDigits("5 / 11 leçons", "fr")).toBe("5 / 11 leçons");
    expect(localizeDigits("5 / 11 lessons", "en")).toBe("5 / 11 lessons");
  });
});

describe("formatDuration", () => {
  it("formate des secondes en mm:ss", () => {
    expect(formatDuration(1090)).toBe("18:10");
  });

  it("complète les secondes sur deux chiffres", () => {
    expect(formatDuration(492)).toBe("08:12");
  });
});

describe("formatTotalDuration", () => {
  it("formate une durée totale en heures et minutes", () => {
    expect(formatTotalDuration(22800)).toBe("6 h 20");
  });

  it("omet les minutes quand la durée tombe juste sur l'heure", () => {
    expect(formatTotalDuration(10800)).toBe("3 h");
  });
});
