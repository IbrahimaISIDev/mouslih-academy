import { describe, expect, it } from "vitest";
import { getPasswordStrength } from "./password-strength";

describe("getPasswordStrength", () => {
  it("renvoie empty pour un champ vide", () => {
    expect(getPasswordStrength("").level).toBe("empty");
  });

  it("renvoie weak sous 8 caractères", () => {
    expect(getPasswordStrength("abc123").level).toBe("weak");
  });

  it("renvoie medium pour un mot de passe simple de 8+ caractères", () => {
    const result = getPasswordStrength("abcdefgh");
    expect(result.level).toBe("medium");
    expect(result.hintKey).toBe("addDigit");
  });

  it("renvoie strong pour un mot de passe long avec chiffre et majuscule", () => {
    expect(getPasswordStrength("Abcdefgh1234").level).toBe("strong");
  });
});
