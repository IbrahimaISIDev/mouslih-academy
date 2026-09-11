# Fidélité — écarts constatés et décisions (PROMPT-09)

## Méthodologie

Cette revue combine deux approches :

1. **Audits de code reproductibles** — `grep` sur les règles du design system (rayon 2 px,
   ombres, or, données en dur), `tsc`/`eslint`/`vitest`/`pnpm build` en conditions réelles, et
   deux suites Playwright (`e2e/rtl.spec.ts`, `e2e/a11y.spec.ts` avec `@axe-core/playwright`)
   exécutées sur les 17 écrans.
2. **Vérification fonctionnelle des 6 contraintes non négociables** du README (section 6),
   contrôlées une à une par lecture de code plutôt que par capture visuelle.

Ce que cette revue **ne couvre pas** : un comparatif pixel-à-pixel de chacune des 17 planches à
1280 px et 375 px face aux maquettes `.dc.html` (nécessiterait des captures visuelles humaines
écran par écran). Les écarts ci-dessous sont ceux détectés par les audits automatisés et par la
relecture du code au fil des 9 prompts — pas une garantie d'absence totale d'écart visuel.

## Écarts corrigés

| # | Écran / zone | Écart constaté | Valeur attendue | Valeur trouvée | Décision |
|---|---|---|---|---|---|
| 1 | Tous (`pnpm build`) | `useSearchParams()` dans `LanguageSwitcher` sans frontière Suspense faisait échouer la génération statique de `/` et `/profil` | Build production réussi | `pnpm build` échouait avec `missing-suspense-with-csr-bailout` | **Corrigé** — `LanguageSwitcher` scindé en un enfant Suspense + un repli de même gabarit (aucun saut de mise en page) |
| 2 | Tous les liens (`<a>`/`Link`) | Règle globale `a { color: green-700 }` hors `@layer`, donc prioritaire sur **toute** classe Tailwind de couleur posée sur un lien, quelle que soit sa spécificité | Un lien avec `text-on-dark-muted`, `text-white`, etc. affiche cette couleur | Le lien retombait sur `green-700` (root cause des deux écarts de contraste ci-dessous) | **Corrigé** — règle déplacée dans `@layer base`, pour qu'un utilitaire Tailwind (`@layer utilities`) la surcharge normalement |
| 3 | Admin — sidebar, items inactifs | Items de nav inactifs sans classe de couleur explicite ; contraste 1,74:1 sur fond `green-900` (axe, critique : nom accessible correct mais contraste insuffisant après le correctif #2) | `text-on-dark-muted` hérité du wrapper | Couleur par défaut du lien (`green-700`) faute de classe explicite sur l'`<a>` | **Corrigé** — `text-on-dark-muted` posé explicitement sur chaque item |
| 4 | Admin — table (utilisateurs/commandes) | Boutons précédent/suivant de pagination = icône seule, sans nom accessible (axe, **critical** : `button-name`) | `aria-label` présent | Absent | **Corrigé** — props `previousLabel`/`nextLabel` traduites (fr/en/ar) ajoutées à `TablePagination` |
| 5 | Page témoignages, nav, footer, admin (AR) | Traduction arabe de « témoignages » | « آراء الطلاب » (avis des apprenants), reprise mot pour mot de la maquette Vague 6 | « الشهادات » (« les diplômes/attestations ») — confusion avec l'attestation de fin de formation | **Corrigé** — 8 occurrences alignées sur la maquette |
| 6 | Footer, bio enseignant (AR), fiche formation (AR) | Nom de marque en arabe | « مصلح » (Mouslih) | « مسلح » (« armé ») — coquille présente depuis PROMPT-02/03 | **Corrigé** — 4 occurrences alignées |
| 7 | Accueil (AR) — CTA hero, bandeau CTA, section « dorées » | Libellés de boutons et titre de section | « تصفّح الدورات », « دورات مختارة » (mot pour mot Vague 6) | « اكتشف الدورات » / « شاهد الدورات », « الدورات المميزة » — paraphrases proches mais non identiques | **Corrigé** |
| 8 | Dashboard, lecteur (AR) | Compteurs éditoriaux (« 5 / 11 leçons · 45 % ») | Chiffres arabes-indiens (« ٥ / ١١ دروس · ٤٥٪ ») | Chiffres latins — ni l'interpolation ICU de next-intl ni `Intl.NumberFormat('ar')` ne basculent seuls sur les chiffres arabes-indiens dans cet environnement | **Corrigé** — helper `localizeDigits`, appliqué à tous les compteurs du dashboard et du lecteur |
| 9 | Dashboard — carte « Continuer » (AR) | Heure de reprise mélangée au texte arabe sans îlot `dir="ltr"` | `المتابعة عند` + `<span dir="ltr">04:12</span>` séparés, comme la maquette | Un seul bloc de texte interpolé, sans isolation bidi | **Corrigé** — `ContinueLearningCard` scindé en `resumeAtPrefix` / `resumeAtTime` |
| 10 | Toutes les icônes directionnelles | Règle « retourner suivant/précédent, jamais le triangle de lecture » codée en dur (`rtl:rotate-180`) répétée à 14 endroits, sans composant qui l'explicite | Composant `DirectionalIcon` dédié | Absent | **Corrigé** — composant créé, 14 usages migrés |
| 11 | Sélecteur de langue | Changement de langue perdait les paramètres d'URL (filtre catalogue, recherche/page admin) | Filtre/page conservés au changement de langue | `usePathname` de next-intl ignore la query string | **Corrigé** — lecture de `useSearchParams` et réinjection dans le `href` |
| 12 | Sélecteur de langue | Cookie `NEXT_LOCALE` sans `maxAge` déclaré → cookie de session, pas persistant un an | Persistance un an | Expirait à la fermeture du navigateur | **Corrigé** — `localeCookie: { maxAge: 31536000 }` dans `routing.ts` |
| 13 | Admin (tous les écrans) | Sélecteur de langue absent de l'admin, contrairement à la contrainte non négociable §1 du README | Présent dans le header/sidebar admin | Absent | **Corrigé** — ajouté dans `AdminSidebar`, variante `onDark` |
| 14 | Base de code | 6 fichiers `features/*/api` orphelins (`get-orders.ts`, `get-stats.ts`, `get-users.ts`, `reorder-course.ts`, `update-course.ts`, `retry-order.ts`) — doublons jamais importés, restes du bootstrap PROMPT-00 supplantés par les vraies implémentations de PROMPT-05/06 | — | Code mort | **Corrigé** — supprimés (vérifié : zéro import réel avant suppression) |
| 15 | Base de code | 3 primitives shadcn/ui jamais consommées (`badge.tsx`, `progress.tsx`, `separator.tsx`) — les patterns maison (`StatusBadge`, `ProgressBar`) les ont remplacées sans que les primitives soient retirées | — | Code mort | **Corrigé** — supprimés |

## Écarts acceptés avec justification

| # | Écran / zone | Écart constaté | Décision |
|---|---|---|---|
| 16 | Toute la charte | Contraste insuffisant (axe, **serious**, pas critique) sur des couleurs de palette **verrouillées par DESIGN-TOKENS.md** :<br>• `gold-600` (#A8823C) en sur-titre `SectionEyebrow`, 3,19:1 à 3,54:1 selon le fond (attendu 4,5:1)<br>• bouton WhatsApp blanc sur `#1F8A4C`, 4,37:1<br>• `StatusBadge` — `warning` texte/fond 3,41:1, `success` texte/fond 4,38:1 | **Accepté avec justification** — ce sont des valeurs hexadécimales explicitement fixées par la maquette et `DESIGN-TOKENS.md` (« aucune couleur nouvelle » est une règle non négociable du README §3). Les corriger changerait la palette partagée dans toute l'app sans validation design. Atténuant : aucun de ces textes n'est le seul porteur d'information (icône ou position accompagnent toujours le `SectionEyebrow` et les `StatusBadge`). À soumettre à la prochaine revue design avant tout backend réel. |
| 17 | 17 écrans | Pas de comparatif visuel pixel-à-pixel (1280 px et 375 px) de chaque écran contre sa planche `.dc.html` | **Accepté avec limitation documentée** — hors de portée d'un audit uniquement outillé (pas de capture d'écran comparée par un humain dans cette passe). Les 9 prompts précédents ont chacun fait l'objet d'une vérification de contenu (curl + grep des libellés exacts) au moment de leur construction ; cette revue finale s'est concentrée sur les régressions transverses (build, a11y, RTL, données en dur) plutôt que de rejouer cette vérification écran par écran. |

## Vérifications qui n'ont rien trouvé à corriger

- **Rayon de bordure** : au moment de cette revue (2026-09-05, avant-midi), `grep` ne trouvait
  aucun `rounded-md|lg|xl` dans `src/` — uniquement `rounded-sm` (2 px) et `rounded-full`
  (avatars, pastilles, points d'état — hors périmètre de la règle qui vise les
  cards/boutons/champs). *Mise à jour du même jour (après-midi) : le rayon de 2 px a été
  changé à 8 px sur tous les composants (```--radius-xs/sm/md/lg``` dans `globals.css`), à la
  demande explicite — voir `DESIGN-TOKENS.md`. Le constat de cohérence ci-dessus reste vrai
  (un seul jeu de tokens, aucune valeur en dur), seule la valeur du rayon a changé.*
- **Palette verte** : rebrandée le même jour (2026-09-05) sur le vert exact du logo Mouslih
  Academie (`#38B349`). Une première passe avait assombri `green-700` pour préserver le
  contraste du texte blanc des boutons (2,72:1 sur `#38B349` contre 4,5:1 requis) ; à la demande
  explicite et réitérée du client, cette passe a été révisée dans la foulée pour que `green-700`
  soit identique au logo. Le contraste a été préservé autrement : texte/icône en `green-ink`
  (~6,1:1) plutôt qu'en blanc sur tout remplissage `green-700`/`green-600`, et le vert n'est plus
  utilisé comme couleur de texte sur fond clair (liens, badges, bouton outline passent aussi à
  `green-ink`).
  *Mise à jour du même jour (soirée) : le client a ensuite demandé que le fond du hero
  (`bg-green-900`, quasi noir) se rapproche davantage du vert du logo. `green-900`/`green-800`
  ont été éclaircis (`#09200C`→`#184E20`, `#113B17`→`#1D5D26`) ; comme `green-900` servait aussi
  de couleur de texte à ce moment-là, il a fallu l'extraire dans un token dédié (`green-ink`,
  resté à l'ancienne valeur très foncée) pour ne pas dégrader le contraste texte/bouton obtenu
  ci-dessus.* Voir `DESIGN-TOKENS.md` pour le détail token par token.
- **Ombres** : aucune ombre en dehors de `shadow-card-hover` (survol de card) et de l'anneau de
  focus ; les deux seules autres occurrences sont des `shadow-none` explicites.
- **Or sans action de conversion** : les 6 usages de `variant="gold"` renvoient tous vers une
  navigation (catalogue, reprise de leçon, file de traitement admin) — jamais vers un bouton de
  paiement, qui reste `primary` (vert) partout, y compris dans le composant de démonstration.
- **Contraintes non négociables (README §6)** : les 6 vérifiées une à une par lecture de code —
  sélecteur de langue partout (admin compris, depuis le correctif #13), contenu verrouillé
  toujours visible (opacité + cadenas, jamais masqué), aucun champ de carte bancaire nulle part
  (`grep` sur `card.?number|cvv|cvc`), bouton WhatsApp sur détail/footer/dashboard, CTA mobile
  sticky avec `backdrop-blur` sur accueil/détail/lecteur, `LevelBadge` à 3 barrettes partagé par
  toutes les cards dans les 3 langues.
- **Aucune donnée en dur dans `components/`** : `grep` des titres de formation et des prix ne
  retourne aucune occurrence dans `src/components/` — tout transite par `features/*/api`.
- **État dans l'URL** : filtres catalogue/témoignages, onglet lecteur, plage admin, et
  recherche/filtre/page des deux tables admin passent tous par `nuqs` (`useQueryState`),
  restaurés au rechargement.
