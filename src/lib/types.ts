export type Locale = "fr" | "en" | "ar";
export type Level = "beginner" | "intermediate" | "advanced";
export type LessonState =
  "completed" | "current" | "upcoming" | "locked" | "free";
export type OrderStatus = "paid" | "pending" | "failed" | "refunded";
export type CourseStatus = "draft" | "published";
export type UserRole = "LEARNER" | "TEACHER" | "ADMIN";

/** Champ traduisible : toujours les 3 langues, la locale manquante retombe sur 'fr'. */
export type I18nText = Record<Locale, string>;

export interface Resource {
  id: string;
  title: I18nText;
  description: I18nText;
  sizeKb: number;
  url: string;
}

/** Erreur de récitation corrigée dans une leçon (2 par vidéo de « Rectifiez votre Fâtiḥah »). */
export interface LessonMistake {
  id: string;
  /** Mot ou passage concerné, en arabe vocalisé. */
  passage: string;
  /** Libellé court, pour la grille « Les 10 erreurs ». */
  title: I18nText;
  /** Ce qu'on entend souvent. */
  mistake: I18nText;
  /** Ce qu'il faut faire. */
  correction: I18nText;
  /** Règle de tajwīd concernée. */
  rule: I18nText;
}

export interface Lesson {
  id: string;
  slug: string;
  title: I18nText;
  description?: I18nText;
  /** Objectif pédagogique, affiché sous la description. */
  objective?: I18nText;
  /** Ce que l'apprenant saura faire, en points courts (liste à puces). */
  keyPoints?: I18nText[];
  /** Passage coranique travaillé, en arabe vocalisé (identique dans les trois langues). */
  passage?: string;
  durationSeconds: number;
  isFreePreview: boolean;
  /** URL d'intégration YouTube — renseignée par le catalogue public pour les aperçus gratuits
   *  uniquement. Les vidéos payantes passent par getLessonPlayback (accès vérifié). */
  videoUrl?: string;
  resources: Resource[];
  mistakes: LessonMistake[];
}

/** Source de lecture d'une leçon, émise après vérification d'accès (GET /me/lessons/:id/playback).
 *  `provider: null` : pas encore de vidéo exploitable. */
export type LessonPlayback =
  | { provider: "youtube"; videoId: string }
  | { provider: "stream"; url: string }
  | { provider: null };

export interface SubModule {
  id: string;
  title: I18nText | null;
  lessons: Lesson[];
}

export interface Module {
  id: string;
  order: number;
  title: I18nText;
  subModules: SubModule[];
}

export interface Course {
  id: string;
  slug: string;
  title: I18nText;
  subtitle: I18nText;
  /** Description courte affichée sur les cards (catalogue, accueil). */
  cardDescription: I18nText;
  /** Chapô de l'en-tête de la page détail. Optionnel : seule Fatiha a un écran détail en Prompt 02. */
  heroTagline?: I18nText;
  /** Version courte du chapô, pour l'en-tête mobile compact. */
  heroTaglineMobile?: I18nText;
  description: I18nText;
  level: Level;
  priceXof: number;
  /** Prix barré optionnel, pour un effet de valorisation ponctuel. */
  compareAtPriceXof?: number;
  coverUrl: string | null;
  /** Chiffres affichés sur les cards (catalogue, accueil) : source de vérité DATA-MODEL.md,
   *  indépendants des leçons détaillées dans `modules` (souvent vide hors Fatiha en Prompt 02). */
  lessonCount: number;
  totalDurationSeconds: number;
  modules: Module[];
  status: CourseStatus;
  isFeatured: boolean;
  hasCertificate: boolean;
  hasVoiceCorrection: boolean;
  translationStatus: Record<Locale, "complete" | "partial" | "empty">;
  /** Ventes réelles des 7 derniers jours — uniquement renseigné sur la page de commande (voir
   *  CoursesService.findBySlug côté API), absent ailleurs (catalogue, accueil). */
  recentPurchasesCount?: number;
}

export interface Enrollment {
  courseId: string;
  completedLessonIds: string[];
  currentLessonId: string;
  resumeAtSeconds: number;
  completedAt: string | null;
  lastActivityAt: string | null;
}

export interface Order {
  ref: string;
  userId: string;
  courseId: string;
  amountXof: number;
  status: OrderStatus;
  createdAt: string;
  waveTransactionId?: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorCity: string;
  courseId: string;
  quote: I18nText;
  kind: "text" | "video";
  videoUrl?: string;
  /** Durée affichée sur la vignette, pour les témoignages vidéo uniquement (ex. "1 min 05"). */
  videoDuration?: string;
  /** Traitement visuel distinct (fond sombre) réservé à un témoignage par mosaïque. */
  highlighted?: boolean;
}

export interface LessonQuestionAnswer {
  authorName: string;
  authorInitials: string;
  timeAgoLabel: I18nText;
  body: I18nText;
}

export interface LessonQuestion {
  id: string;
  lessonId: string;
  authorName: string;
  authorInitials: string;
  timeAgoLabel: I18nText;
  body: I18nText;
  answer?: LessonQuestionAnswer;
}

export interface AdminUser {
  id: string;
  name: string;
  city: string;
  email: string;
  phone: string;
  coursesCount: number;
  joinedAt: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AdminKpi {
  revenueXof: number;
  revenueChangePct: number;
  revenueChangeXof: number;
  salesCount: number;
  salesChange: number;
  learnersCount: number;
  learnersChange: number;
  completionRatePct: number;
  completionRateChangePts: number;
}

export interface AdminCourseSales {
  courseId: string;
  sales: number;
  revenueXof: number;
}

export interface AdminQueue {
  recitationsToReview: number;
  oldestRecitationDaysAgo: number;
  unansweredQuestions: number;
}

export interface AdminStats {
  kpi: AdminKpi;
  salesByCourse: AdminCourseSales[];
  queue: AdminQueue;
  /** Nombre total (fictif, hors jeu de démo) de commandes — pour la pagination et le sous-titre. */
  totalOrdersCount: number;
}

export interface AdminOrderRow {
  ref: string;
  learnerName: string;
  learnerInitials: string;
  courseTitle: string;
  amountXof: number;
  status: OrderStatus;
  createdAt: string;
}

export type AdminUsersFilter = "all" | "withPurchase" | "withoutPurchase";
export type AdminOrdersFilter = "all" | "paid" | "pending" | "failed";

export type LessonVideoStatus = "ready" | "uploading" | "missing";

export interface AdminLessonVideoState {
  status: LessonVideoStatus;
  /** Pourcentage d'envoi en cours, uniquement quand `status === "uploading"`. */
  uploadPct?: number;
  /** Identifiant de la vidéo YouTube rattachée (éditeur admin uniquement). */
  youtubeId?: string;
}
