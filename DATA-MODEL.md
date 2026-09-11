# Modèle de données & contenu de démo

Les composants ne doivent **jamais** contenir de données en dur. Tout vient de
```src/mocks/``` via les fonctions de ```features/*/api```, dont les signatures sont déjà celles
du futur backend (async, paramètres identiques). Le branchement se fera en remplaçant le
corps des fonctions, sans toucher un seul composant.

## Types

`````````ts
export type Locale = 'fr' | 'en' | 'ar';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type LessonState = 'completed' | 'current' | 'upcoming' | 'locked' | 'free';
export type OrderStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type CourseStatus = 'draft' | 'published';

/** Champ traduisible : toujours les 3 langues, la locale manquante retombe sur 'fr'. */
export type I18nText = Record<Locale, string>;

export interface Lesson {
  id: string;
  slug: string;
  title: I18nText;
  durationSeconds: number;   // affiché en mm:ss, jamais stocké en texte
  isFreePreview: boolean;
  videoUrl?: string;
  resources: Resource[];
}

export interface SubModule { id: string; title: I18nText | null; lessons: Lesson[] }
export interface Module { id: string; order: number; title: I18nText; subModules: SubModule[] }

export interface Course {
  id: string;
  slug: string;
  title: I18nText;
  subtitle: I18nText;
  description: I18nText;
  level: Level;
  priceXof: number;          // entier en FCFA, formaté à l'affichage
  coverUrl: string | null;
  modules: Module[];
  status: CourseStatus;
  isFeatured: boolean;
  hasCertificate: boolean;
  hasVoiceCorrection: boolean;
  translationStatus: Record<Locale, 'complete' | 'partial' | 'empty'>;
}

export interface Enrollment {
  courseId: string;
  completedLessonIds: string[];
  currentLessonId: string;
  resumeAtSeconds: number;
  completedAt: string | null;
}

export interface Order {
  ref: string;               // 'TX-8842301'
  userId: string;
  courseId: string;
  amountXof: number;
  status: OrderStatus;
  createdAt: string;         // ISO
  waveTransactionId?: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorCity: string;
  courseId: string;
  quote: I18nText;
  kind: 'text' | 'video';
  videoUrl?: string;
}
`````````

## Dérivations (jamais stockées)

- ```lessonCount``` = somme des leçons de tous les sous-modules.
- ```totalDuration``` = somme des ```durationSeconds```, affichée « 6 h 20 ».
- ```progressPct``` = ```completedLessonIds.length / lessonCount```, arrondi à l'entier.
- ```lessonState``` = calculé par une fonction pure ```getLessonState(lesson, enrollment, isPurchased)```
  testée unitairement — c'est le cœur de la logique de verrouillage.

## Formatage

```formatPrice(15000, locale)``` → ```15 000 F``` (fr/en, espace insécable) · ```١٥٠٠٠ فرنك``` (ar)
```formatDuration(1090)``` → ```18:10``` · ```formatTotalDuration(22800)``` → ```6 h 20```
```toArabicDigits('1240')``` → ```١٢٤٠``` — pour les compteurs éditoriaux arabes uniquement.

## Catalogue de démo (6 formations)

| Slug | Titre FR | Niveau | Prix | Leçons | Durée | Notes |
|---|---|---|---|---|---|---|
| ```rectification-fatiha``` | Rectification de la Fatiha | débutant | 15 000 F | 11 | 3 h | vedette, « Le plus suivi », 2 leçons libres |
| ```initiation-nourania``` | Initiation à la lecture — Nourania | débutant | 25 000 F | 14 | 6 h 20 | vedette |
| ```regles-tajwid``` | Les règles du Tajwid | intermédiaire | 40 000 F | 22 | 11 h 05 | vedette, « Populaire » |
| ```fiqh-priere``` | Fiqh de la prière | débutant | 20 000 F | 12 | 4 h 30 | |
| ```memorisation-cinq-lignes``` | Mémorisation — cinq lignes par jour | intermédiaire | 30 000 F | 16 | 7 h 10 | |
| ```sciences-hadith``` | Sciences du hadith | avancé | 45 000 F | 18 | 9 h 40 | |

Titres arabes : تصحيح سورة الفاتحة · القاعدة النورانية · أحكام التجويد · فقه الصلاة ·
الحفظ : خمسة أسطر يوميًا · علوم الحديث

## Programme complet de « Rectification de la Fatiha »

C'est le jeu de données de référence : il alimente le détail formation, le lecteur, l'admin
et les écrans RTL. À reproduire **exactement**, durées incluses.

**Module 1 — Avant de réciter** (قبل التلاوة)
1. Pourquoi la Fatiha doit être rectifiée — 08:12 — *accès libre*
2. Poser sa respiration et son souffle — 11:40 — *accès libre*
3. L'intention, la posture, la concentration — 09:05

**Module 2 — Les lettres qui trahissent** (الحروف التي تخون القارئ)
*Sous-module : Les emphatiques*
4. Le ص, le ض et la mâchoire — 16:20
5. Le ط et le ظ : distinguer sans forcer — 14:55
*Sous-module : Les gutturales*
6. Le ع et le ح : ouvrir la gorge — 18:10 ← **leçon courante de la démo**
7. Le ق et le ك : le point d'appui — 18:35

**Module 3 — Les prolongations et les arrêts** (المدود والوقوف)
8. Compter les temps de prolongation — 19:45
9. Où s'arrêter sans briser le sens — 18:30

**Module 4 — Réciter la sourate en entier** (تلاوة السورة كاملة)
10. Récitation guidée, verset par verset — 24:10
11. Enregistrer et envoyer votre récitation — 17:50

Titres arabes des leçons : voir la maquette Vague 6 (tableau ```MODS``` dans la logique).

## Apprenant de démo

Aminata Diallo · Dakar · ```aminata.diallo@exemple.sn``` · +221 77 123 45 67 · inscrite le
14 août 2026. Trois formations : Fatiha (5/11 terminées, leçon courante n°6, reprise à
```04:12```, 45 %), Nourania (0/14, non commencée), Fiqh de la prière (12/12, terminée le
12 juillet 2026, attestation disponible). Une récitation du module 1 en attente de
correction, envoyée il y a un jour.

## Données admin de démo

**KPI 30 jours :** CA 1 285 000 F (+18 %, +195 000 F) · 58 ventes (+12) ·
1 240 apprenants (+64) · taux d'achèvement 64 % (−3 pts).

**Ventes par formation :** Fatiha 31 / 465 000 F · Tajwid 11 / 440 000 F ·
Nourania 8 / 200 000 F · Fiqh 5 / 100 000 F · Hadith 3 / 135 000 F.

**File à traiter :** 7 récitations à corriger (la plus ancienne depuis 2 jours),
2 questions sans réponse (Tajwid leçons 6 et 11).

**Commandes** (7 lignes) et **utilisateurs** (7 lignes) : reprendre à l'identique les
tableaux ```ORDERS``` et ```USERS``` de la maquette Vague 5, références ```TX-88xxxxx``` incluses.

## Contrats d'API attendus (phase backend)

`````````
GET    /api/courses?level=&q=&featured=       → Course[]
GET    /api/courses/:slug                      → Course
GET    /api/me/enrollments                     → Enrollment[]
POST   /api/me/lessons/:id/complete            → { progressPct }
POST   /api/me/lessons/:id/position            → 204   (débounce 10 s côté client)
POST   /api/orders                             → { ref, waveCheckoutUrl }
GET    /api/orders/:ref                        → Order        (polling 3 s si pending)
POST   /api/orders/:ref/retry                  → { waveCheckoutUrl }
GET    /api/admin/stats?range=30d              → AdminStats
GET    /api/admin/orders?status=&q=&page=      → Paginated<Order>
GET    /api/admin/users?filter=&q=&page=       → Paginated<User>
PATCH  /api/admin/courses/:id                  → Course       (autosave, débounce 2 s)
POST   /api/admin/courses/:id/reorder          → 204          (drag & drop du programme)
`````````

Tant que le backend n'existe pas : ces fonctions vivent dans ```features/*/api```, retournent
les fixtures avec un ```await sleep(400)``` pour rendre les skeletons visibles et testables.
