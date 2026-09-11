# Contrats d'API — guide de branchement backend

Ce document reprend les contrats de `DATA-MODEL.md` et les complète avec la forme exacte
attendue par chaque fonction `features/*/api` qui les consomme, les cas d'erreur à couvrir, et
les besoins de temps réel. Tant que le backend n'existe pas, ces fonctions retournent des
fixtures ; voir [« Bascule mocks / backend réel »](#bascule-mocks--backend-réel) pour le
mécanisme de branchement.

## Convention générale

- Toutes les réponses sont en JSON, `Content-Type: application/json`.
- Un cas d'erreur HTTP (`!response.ok`) est traité par `apiFetch` (`src/lib/api-client.ts`) en
  levant une `ApiError(status, message)` — chaque fonction `features/*/api` décide ensuite si
  elle relaie l'erreur (formulaires : message affiché via `Alert`) ou la traite comme un
  résultat vide (`getCourse` → `null`, ce qui déclenche `notFound()` côté page).
- Les identifiants d'apprenant (`userId`) proviendront de la session authentifiée côté backend
  une fois l'auth réelle branchée ; le frontend ne les fabrique pas au-delà de la démo.

## Catalogue

### `GET /api/courses?level=&q=&featured=`
Consommé par `getCourses()` (`features/catalog/api/get-courses.ts`).
- Réponse : `Course[]` (voir `DATA-MODEL.md` pour la forme de `Course`).
- Erreurs : aucun cas d'erreur métier — liste vide si aucun résultat.

### `GET /api/courses/:slug`
Consommé par `getCourse(slug)`.
- Réponse : `Course`.
- Erreurs : `404` → la fonction retourne `null`, la page appelle `notFound()`.

### `GET /api/courses/by-id/:id`
Consommé par `getCourseById(id)` (utilisé par l'admin, qui manipule des `id`, pas des `slug`).
- Réponse : `Course`. Erreurs : idem `getCourse`.

### `GET /api/testimonials`
Consommé par `getTestimonials()`. Réponse : `Testimonial[]`.

## Espace apprenant

### `GET /api/me/profile`
Consommé par `getProfile()`. Réponse : `LearnerProfile` (voir `src/mocks/learner.ts` pour la
forme exacte — `firstName`, `lastName`, `email`, `phone`, `city`, `joinedAt`,
`passwordChangedAt`, `pendingRecitation`).
- Temps réel : `pendingRecitation.correctionStatus` change quand une correction est rendue —
  pas de polling actuellement côté frontend (la page se contente de re-fetcher au chargement) ;
  un webhook ou un polling léger (30–60 s) serait nécessaire pour un statut vraiment live.

### `GET /api/me/orders`
Consommé par `getPurchaseHistory()`. Réponse : `Order[]`, triés date décroissante côté backend
idéalement (le frontend re-trie par sécurité).

### `GET /api/me/enrollments`
Consommé par `getEnrollments()`. Réponse : `Enrollment[]`.

### `POST /api/me/lessons/:id/complete`
Consommé par `completeLesson(lessonId)`.
- Corps : aucun (l'id de leçon est dans l'URL).
- Réponse : `{ progressPct: number }`.
- Erreurs : leçon non trouvée dans une formation possédée → `404` ; la fonction ne gère pas
  encore ce cas côté mock (elle retourne `{ progressPct: 0 }`), à aligner avec un vrai code
  d'erreur distinct côté backend.

### `POST /api/me/lessons/:id/position`
Consommé par `saveLessonPosition(lessonId, positionSeconds)`.
- Corps : `{ positionSeconds: number }`.
- Réponse : `204` (aucun corps).
- Débounce 10 s recommandé côté client avant l'appel (voir `ARCHITECTURE.md`) — pas de temps
  réel nécessaire, cet appel est fire-and-forget.

### `GET /api/lessons/:id/questions`
Consommé par `getLessonQuestions(lessonId)`. Réponse : `LessonQuestion[]`.
- Temps réel souhaitable : quand l'enseignant répond à une question pendant que l'apprenant a
  l'onglet ouvert, un polling léger (60 s) ou un WebSocket serait nécessaire pour faire
  apparaître la réponse sans rechargement — non implémenté côté frontend actuellement (retour
  simple au montage du composant).

## Paiement Wave

### `POST /api/orders`
Consommé par `createOrder(courseId, userId, amountXof)`.
- Corps : `{ courseId, userId, amountXof }`.
- Réponse : `{ ref: string, waveCheckoutUrl: string }` — `waveCheckoutUrl` est l'URL Wave réelle
  vers laquelle `window.location.assign` redirige (domaine externe en production ; le mock
  pointe vers notre propre écran de confirmation faute de bac à sable Wave).
- Erreurs : montant invalide, formation déjà possédée → `4xx` avec un message affichable tel
  quel (le composant appelant n'a pas de gestion d'erreur dédiée aujourd'hui, à ajouter).

### `GET /api/orders/:ref`
Consommé par `getOrder(ref)`. Réponse : `Order`.
- **Temps réel** : c'est le point qui en a le plus besoin. L'écran de confirmation
  (`PaymentResult`) fait du **polling toutes les 3 s, 20 tentatives maximum**, tant que
  `status === "pending"`. Un webhook Wave → backend → notification push (SSE/WebSocket) au
  frontend éviterait ce polling, mais n'est pas requis pour livrer une première version : le
  polling suffit et est déjà implémenté côté composant.
- Erreurs : `404` → `null`, la page affiche « commande introuvable ».

### `POST /api/orders/:ref/retry`
Non consommé aujourd'hui par un composant (le parcours actuel recrée une commande plutôt que de
relancer l'ancienne). À brancher si le parcours de retry évolue ; contrat prévu dans
`DATA-MODEL.md` : réponse `{ waveCheckoutUrl: string }`.

## Administration

### `GET /api/admin/stats?range=30d`
Consommé par `getAdminStats(range)`. Réponse : `AdminStats` (kpi, salesByCourse, queue,
totalOrdersCount).

### `GET /api/admin/orders?status=&q=&page=&locale=`
Consommé par `getAdminOrders({ q, filter, page, locale })`. Réponse : `Paginated<AdminOrderRow>`
— le backend doit déjà joindre apprenant/formation (le frontend ne refait pas cette jointure
quand les mocks sont désactivés). `locale` sert à choisir la langue du titre de formation.

### `GET /api/admin/orders/recent?locale=`
Consommé par `getRecentPayments(locale)` (widget dashboard, 6 dernières commandes). Réponse :
`AdminOrderRow[]`.

### `GET /api/admin/users?filter=&q=&page=`
Consommé par `getAdminUsers({ q, filter, page })`. Réponse : `Paginated<AdminUser>`.

### `GET /api/admin/users/recent-signups`
Consommé par `getRecentSignups()`. Réponse : `{ name, initials, city, hoursAgo?, yesterday? }[]`.

### `GET /api/admin/courses/:id/editor`
Consommé par `getCourseEditor(courseId)`. Réponse : `{ course: Course, videoStatus: Record<lessonId, { status: "ready"|"uploading"|"missing", uploadPct? }> }`.

### `POST /api/admin/courses/:id/reorder`
Consommé par `reorderCourseModules(courseId, moduleIds)` et
`reorderCourseLessons(courseId, subModuleId, lessonIds)`.
- Corps : `{ scope: "modules", orderedIds: string[] }` ou
  `{ scope: "lessons", subModuleId: string, orderedIds: string[] }`.
- Réponse : `204`.
- Le composant (`CurriculumEditor`) applique la réorganisation de façon optimiste et revient en
  arrière si la requête échoue — implémenté côté frontend, à vérifier une fois le vrai endpoint
  branché (le mock ne renvoie jamais d'échec).
- **Temps réel** : l'état d'upload vidéo (`uploadPct`) affiché dans la ligne de la leçon
  nécessitera un flux de progression (SSE ou polling court, 1–2 s) une fois l'upload réel
  branché — non implémenté aujourd'hui (le mock a un pourcentage figé).

### `PATCH /api/admin/courses/:id`
Prévu par `DATA-MODEL.md` (autosave, débounce 2 s) mais **non consommé par un composant
aujourd'hui** — l'éditeur de traduction et les réglages du cours (`TranslationEditorCard`,
`CourseSettingsCard`) ne persistent pas encore leurs modifications. À implémenter avant le
branchement backend si la sauvegarde doit réellement fonctionner.

## Authentification

### `POST /api/auth/login`
Consommé par `login(values)`. Corps : `LoginFormValues` (email, password). Réponse :
`{ userId: string }`. Erreurs : identifiants invalides → message affiché dans l'`Alert` du
formulaire (voir PROMPT-03).

### `POST /api/auth/signup`
Consommé par `signup(values)`. Corps : `SignupFormValues`. Réponse : `{ userId: string }`.

## Bascule mocks / backend réel

Un seul point de bascule, dans `src/lib/api-client.ts` :

```ts
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";
```

- `NEXT_PUBLIC_USE_MOCKS=false` (ou absent en production si vous préférez inverser le défaut)
  bascule chaque fonction `features/*/api` sur `apiFetch`, qui appelle
  `${NEXT_PUBLIC_API_BASE_URL}${path}`.
- **`NEXT_PUBLIC_API_BASE_URL` doit être une URL absolue** (ex.
  `https://api.mouslihacademy.sn`) dès qu'une fonction est appelée depuis un composant serveur
  — `fetch` côté serveur Node ne résout pas les chemins relatifs comme le ferait un navigateur.
- Chaque fonction garde exactement la même signature dans les deux modes : **aucun composant
  n'a besoin d'être modifié** pour brancher le vrai backend, seuls les fichiers de
  `features/*/api` changent de branche en interne. C'est le test de réussite de l'architecture
  (voir `PROMPT-09`, critère d'acceptation).
