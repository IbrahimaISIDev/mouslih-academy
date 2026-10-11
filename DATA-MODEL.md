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

## Catalogue de démo (6 formations, 1 publiée)

Depuis le 2026-10-10, le site se concentre sur une seule formation. Les 5 autres restent dans
les données avec ```status: "draft"``` : invisibles côté public (API et mocks filtrent les
brouillons), visibles et republiables depuis l'admin.

| Slug | Titre FR | Statut | Prix | Vidéos | Durée |
|---|---|---|---|---|---|
| ```rectification-fatiha``` | Rectifiez votre Fâtiḥah | **publiée**, vedette | 10 150 F | 5 | 38 min (vidéos d'exemple) |
| ```initiation-nourania``` | Initiation à la lecture — Nourania | brouillon | 25 000 F | 14 | 6 h 20 |
| ```regles-tajwid``` | Les règles du Tajwid | brouillon | 40 000 F | 22 | 11 h 05 |
| ```fiqh-priere``` | Fiqh de la prière | brouillon | 20 000 F | 12 | 4 h 30 |
| ```memorisation-cinq-lignes``` | Mémorisation — cinq lignes par jour | brouillon | 30 000 F | 16 | 7 h 10 |
| ```sciences-hadith``` | Sciences du hadith | brouillon | 45 000 F | 18 | 9 h 40 |

Avec une seule formation publiée, ```/formations``` redirige vers sa page ; le catalogue
réapparaît automatiquement dès qu'une deuxième formation est publiée.

## Programme de « Rectifiez votre Fâtiḥah »

**Source éditoriale unique : [CONTENU-FATIHA.md](CONTENU-FATIHA.md)** (textes FR/EN/AR, texte
arabe vocalisé, les 10 erreurs). ```src/mocks/curriculum-fatiha.ts``` et
```prisma/fatiha-content.ts``` (backend) en sont la transcription exacte.

Structure : 1 module (« Les 10 erreurs, vidéo par vidéo »), 1 sous-module sans titre,
5 leçons (= 5 vidéos), 2 ```LessonMistake``` par leçon. Chaque leçon porte aussi
```passage``` (arabe vocalisé), ```description``` et ```objective```.

| # | id / slug | Passage | Vidéo d'exemple | Durée |
|---|---|---|---|---|
| 01 | ```fatiha-v01``` / ```corriger-al-hamdu``` | الْحَمْدُ | ```7023DoO7TL4``` | 06:25 |
| 02 | ```fatiha-v02``` / ```al-alamin-et-iyyaka``` | الْعَالَمِينَ — إِيَّاكَ | ```GSCyCtWtj1c``` | 04:24 |
| 03 | ```fatiha-v03``` / ```ihdina-s-sirat``` | اهْدِنَا الصِّرَاطَ | ```dDdqkQ3TAYk``` | 07:42 |
| 04 | ```fatiha-v04``` / ```alladhina-et-maghdubi``` | الَّذِينَ — الْمَغْضُوبِ | ```lquZH_0Fsnk``` | 09:07 |
| 05 | ```fatiha-v05``` / ```wa-la-d-dallin``` | وَلَا الضَّالِّينَ | ```zTHNmEi30Ys``` | 10:17 |

**Phase de test** (paiement Wave non configuré) : les 5 vidéos sont en accès libre
(```DEMO_ALL_FREE``` dans la source de contenu). À l'ouverture des paiements, seule la vidéo 01
restera libre — basculer depuis l'admin (interrupteur « Accès libre » de chaque leçon).
Les vidéos sont des exemples YouTube sans rapport avec le contenu, à remplacer depuis l'admin.

## Apprenant de démo

Aminata Diallo · Dakar · ```aminata.diallo@exemple.sn``` · +221 77 123 45 67 · inscrite le
14 août 2026. Une formation : Fâtiḥah (2/5 vidéos terminées, vidéo courante n°3, reprise à
```04:12```, 40 %). Aucune récitation en attente (envoi de récitation masqué).

## Données admin de démo

**KPI 30 jours :** CA 588 700 F (+26 %, +121 800 F) · 58 ventes (+12) ·
1 240 apprenants (+64) · taux d'achèvement 64 % (−3 pts).

**Ventes par formation :** Fâtiḥah 58 / 588 700 F.

**File à traiter :** 0 récitation, 2 questions sans réponse.

**Commandes** (9 lignes, toutes sur la Fâtiḥah à 10 150 F) et **utilisateurs** (7 lignes) :
voir ```src/mocks/orders.ts``` et le seed backend, références ```TX-88xxxxx``` incluses.

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
