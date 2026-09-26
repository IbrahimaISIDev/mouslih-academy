import type { Locale } from "@/lib/types";

const ARABIC_INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Convertit les chiffres latins d'une chaîne en chiffres arabes-indiens (compteurs éditoriaux). */
export function toArabicDigits(value: string): string {
  return value.replace(/[0-9]/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)]);
}

/** Convertit les chiffres d'un compteur éditorial ("5 / 11", "45 %") si la locale est l'arabe —
 *  `Intl.NumberFormat('ar')` ne bascule pas seul sur les chiffres arabes-indiens ici. */
export function localizeDigits(value: string, locale: Locale): string {
  return locale === "ar" ? toArabicDigits(value) : value;
}

/** Nombre de jours pleins écoulés depuis une date ISO (0 = aujourd'hui). */
export function daysAgo(dateIso: string): number {
  const elapsedMs = Date.now() - new Date(dateIso).getTime();
  return Math.max(0, Math.floor(elapsedMs / 86_400_000));
}

/** Formate un prix en francs CFA : "15 000 F" (fr/en) ou "١٥٠٠٠ فرنك" (ar). */
export function formatPrice(amountXof: number, locale: Locale): string {
  if (locale === "ar") {
    return `${toArabicDigits(String(amountXof))} فرنك`;
  }
  return `${new Intl.NumberFormat("fr-FR").format(amountXof)} F`;
}

/** Formate un compteur éditorial (ex. nombre d'apprenants) : "1 240" (fr/en) ou "١٢٤٠" (ar). */
export function formatCount(value: number, locale: Locale): string {
  if (locale === "ar") {
    return toArabicDigits(String(value));
  }
  return new Intl.NumberFormat("fr-FR").format(value);
}

/** Formate une durée de leçon en mm:ss : formatDuration(1090) → "18:10". */
export function formatDuration(durationSeconds: number): string {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Formate une durée totale de formation : formatTotalDuration(22800) → "6 h 20". */
export function formatTotalDuration(durationSeconds: number): string {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.round((durationSeconds % 3600) / 60);
  return minutes === 0
    ? `${hours} h`
    : `${hours} h ${String(minutes).padStart(2, "0")}`;
}

/** Initiales d'un nom complet, pour les avatars des tables admin : getInitials("Aminata Diallo") → "AD". */
export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}
