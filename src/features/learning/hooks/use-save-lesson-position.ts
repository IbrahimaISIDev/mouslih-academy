import { useCallback, useEffect, useRef } from "react";
import { saveLessonPosition } from "@/features/learning/api/save-lesson-position";
import { setStoredPosition } from "@/features/learning/lesson-progress-storage";

const SERVER_SAVE_INTERVAL_MS = 10_000;

function persist(lessonId: string, seconds: number) {
  // Échec réseau sans conséquence : localStorage garde la position, le prochain envoi la rattrape.
  saveLessonPosition(lessonId, Math.floor(seconds)).catch(() => {});
}

/** Écrit dans localStorage immédiatement, envoie au serveur au plus une fois toutes les 10 s
 *  (dernière position connue). Un étranglement plutôt qu'un débounce : le lecteur signale la
 *  position en continu pendant la lecture, un débounce repousserait l'envoi indéfiniment. */
export function useSaveLessonPosition(courseId: string, lessonId: string) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        // Départ de la leçon avant l'échéance : on n'abandonne pas la dernière position.
        persist(lessonId, latestRef.current);
      }
    };
  }, [courseId, lessonId]);

  return useCallback(
    (seconds: number) => {
      setStoredPosition(courseId, lessonId, seconds);
      latestRef.current = seconds;

      if (timeoutRef.current) return;
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        persist(lessonId, latestRef.current);
      }, SERVER_SAVE_INTERVAL_MS);
    },
    [courseId, lessonId],
  );
}
