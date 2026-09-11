export type PasswordStrengthLevel = "empty" | "weak" | "medium" | "strong";

export interface PasswordStrength {
  level: PasswordStrengthLevel;
  segments: number;
  hintKey: "min" | "addDigit" | "addUppercase";
}

/** Robustesse illustrative du mot de passe : 4 segments, jamais un blocage à la saisie. */
export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) {
    return { level: "empty", segments: 0, hintKey: "min" };
  }

  if (password.length < 8) {
    return { level: "weak", segments: 1, hintKey: "min" };
  }

  const hasDigit = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLong = password.length >= 12;

  const score = 1 + Number(hasDigit) + Number(hasUppercase) + Number(hasLong);

  if (score <= 2) {
    return {
      level: "medium",
      segments: 2,
      hintKey: hasDigit ? "addUppercase" : "addDigit",
    };
  }

  return { level: "strong", segments: Math.min(score, 4), hintKey: "min" };
}
