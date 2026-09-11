const STORAGE_PREFIX = "mouslih:progress:";

function key(courseId: string, lessonId: string): string {
  return `${STORAGE_PREFIX}${courseId}:${lessonId}`;
}

/** Position de lecture restaurée au chargement. Ne touche jamais aux autres clés du storage. */
export function getStoredPosition(
  courseId: string,
  lessonId: string,
): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(courseId, lessonId));
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredPosition(
  courseId: string,
  lessonId: string,
  seconds: number,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      key(courseId, lessonId),
      String(Math.floor(seconds)),
    );
  } catch {
    // Stockage indisponible (navigation privée, quota) : la sauvegarde serveur prend le relais.
  }
}
