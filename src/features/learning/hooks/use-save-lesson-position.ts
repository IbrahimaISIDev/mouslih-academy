import { useCallback, useEffect, useRef } from "react";
import { saveLessonPosition } from "@/features/learning/api/save-lesson-position";
import { setStoredPosition } from "@/features/learning/lesson-progress-storage";

const SERVER_SAVE_DEBOUNCE_MS = 10_000;

/** Écrit dans localStorage immédiatement, envoie au serveur avec un débounce de 10 s. */
export function useSaveLessonPosition(courseId: string, lessonId: string) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [courseId, lessonId]);

  return useCallback(
    (seconds: number) => {
      setStoredPosition(courseId, lessonId, seconds);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        saveLessonPosition(lessonId, Math.floor(seconds));
      }, SERVER_SAVE_DEBOUNCE_MS);
    },
    [courseId, lessonId],
  );
}
