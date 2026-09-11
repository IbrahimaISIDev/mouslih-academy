import type { AdminLessonVideoState } from "@/lib/types";

/**
 * État d'envoi vidéo par leçon, pour la démo de l'éditeur de programme admin.
 * Seule Fatiha (le jeu de données de référence) a un état détaillé ; les autres
 * formations sont considérées entièrement prêtes.
 */
export const fatihaLessonVideoStatus: Record<string, AdminLessonVideoState> = {
  l1: { status: "ready" },
  l2: { status: "ready" },
  l3: { status: "ready" },
  l4: { status: "ready" },
  l5: { status: "uploading", uploadPct: 62 },
  l6: { status: "ready" },
  l7: { status: "missing" },
  l8: { status: "ready" },
  l9: { status: "ready" },
  l10: { status: "ready" },
  l11: { status: "missing" },
};
