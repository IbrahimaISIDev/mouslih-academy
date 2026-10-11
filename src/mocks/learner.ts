export interface PendingRecitation {
  courseId: string;
  moduleOrder: number;
  submittedDaysAgo: number;
}

export interface LearnerProfile {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  phone: string;
  joinedAt: string;
  passwordChangedAt: string;
  pendingRecitation: PendingRecitation | null;
  lessonsCompletedThisWeek: number;
}

/** Apprenante de démo : Aminata Diallo. */
export const aminata: LearnerProfile = {
  id: "u-aminata-diallo",
  firstName: "Aminata",
  lastName: "Diallo",
  city: "Dakar",
  email: "aminata.diallo@exemple.sn",
  phone: "+221 77 123 45 67",
  joinedAt: "2026-08-14",
  passwordChangedAt: "2026-03-03",
  // Envoi de récitation masqué pour l'instant (2026-10-10).
  pendingRecitation: null,
  lessonsCompletedThisWeek: 2,
};
