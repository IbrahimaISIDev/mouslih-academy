# Contribuer

Ce projet suit trois règles non négociables, garanties pour deux d'entre elles par le linter.
Les violer casse la cohérence visuelle (RTL, thème) ou l'architecture de branchement backend
décrite dans `BACKEND.md`.

## Les trois interdits

### 1. Aucune couleur en dur hors de `globals.css`

Toute couleur vit dans `@theme` (`src/app/globals.css`) sous forme de variable
`--color-nom-du-token`, utilisée ensuite via une classe Tailwind (`bg-green-700`,
`text-on-dark-muted`, …). Une couleur hexadécimale ou `rgb()` écrite ailleurs — y compris dans
un `style={{ }}` inline — est bloquée par la règle ESLint `no-restricted-syntax`.

Si une nuance de la maquette n'a pas encore de token, ajoutez-la dans `@theme` avec un
commentaire expliquant sa provenance (voir les entrées existantes comme `--color-row-hover` ou
`--color-skeleton-primary`) plutôt que de l'écrire en dur au point d'usage.

### 2. Aucune propriété CSS physique

`pl-*`, `pr-*`, `ml-*`, `mr-*`, `left-*`, `right-*`, `text-left`, `text-right`, `border-l*`,
`border-r*`, `rounded-l*`, `rounded-r*` sont interdits — l'app doit fonctionner en miroir
complet en arabe (RTL) sans classe conditionnelle par locale. Utilisez toujours l'équivalent
logique : `ps-*`/`pe-*`, `ms-*`/`me-*`, `start-*`/`end-*`, `text-start`/`text-end`,
`border-s*`/`border-e*`. Cette règle est également appliquée par ESLint.

Pour une icône directionnelle (flèche, chevron), passez par le composant
`DirectionalIcon` (`src/components/patterns/directional-icon.tsx`) plutôt que par un
`rtl:scale-x-[-1]` ad hoc — sauf pour les rares cas hors-icône (ex. séparateur de fil
d'Ariane), où `rtl:scale-x-[-1]` directement sur l'élément reste acceptable. Ne jamais
l'appliquer au triangle de lecture vidéo, à `Check`, `Lock`, `Clock` ou au logo : ce sont des
conventions universelles, pas une direction de lecture.

### 3. Aucune donnée en dur dans un composant

Un composant (`components/`, `features/*/components/`) ne connaît jamais un titre de
formation, un prix, une liste d'utilisateurs, etc. Toute donnée transite par
`features/*/api/*.ts`, dont chaque fonction a la même signature en mode fixtures et en mode
backend réel (voir `BACKEND.md`). Un composant reçoit des props déjà traduites/formatées, ou
appelle un hook TanStack Query qui appelle lui-même une fonction `features/*/api`.

Avant d'ouvrir une PR, vérifiez rapidement :

```bash
grep -rn "15 000\|Rectification de la Fatiha" src/components
```

Zéro résultat attendu.

## Ajouter un nouvel écran

1. Relisez `ARCHITECTURE.md` (conventions de dossiers) et `DESIGN-TOKENS.md` (valeurs
   autorisées) avant d'écrire du code.
2. Si l'écran a une maquette (`maquettes/*.dc.html`), ouvrez-la à côté de votre éditeur — elle
   fait foi pour la copie, les espacements et les couleurs, y compris quand elle contredit une
   description en prose ailleurs.
3. Placez les fonctions de données dans `features/<domaine>/api/`, les composants spécifiques
   dans `features/<domaine>/components/`, et seulement les patterns réellement partagés entre
   domaines dans `components/patterns/`.
4. Ajoutez les clés de traduction dans les **trois** fichiers `src/i18n/messages/{fr,en,ar}.json`
   dans le même mouvement — jamais fr seul suivi d'un rattrapage.
5. Si l'écran affiche un état de chargement, un skeleton dédié dans `components/skeletons/`
   reprend la géométrie exacte du contenu final (jamais un spinner générique) ; s'il peut être
   vide, un `EmptyState` avec une action ; s'il peut échouer, un `SectionError` (échec de
   section, page reste utilisable) plutôt qu'un écran d'erreur plein.
6. Avant de committer :

   ```bash
   pnpm check     # tsc --noEmit + eslint + vitest
   pnpm build     # doit être silencieux, y compris les avertissements
   ```

7. Testez visuellement l'écran en `fr`, `en` et `ar` (au moins la version desktop), et en
   mobile pour les écrans publics/apprenant. Pour l'arabe, vérifiez que la mise en page est
   réellement en miroir (pas seulement le texte inversé) et qu'aucun texte arabe n'est en
   capitales ou avec `letter-spacing`.

## Style de code

- Pas de commentaire qui décrit *ce que* fait le code — seulement le *pourquoi*, quand ce n'est
  pas évident (contrainte cachée, contournement d'un bug précis, comportement surprenant).
- Pas d'abstraction pour un usage hypothétique futur — voir les principes de code de
  `ARCHITECTURE.md`.
- `any`, `@ts-ignore`/`@ts-nocheck` et `eslint-disable` non justifiés par un commentaire sont
  interdits (vérifiés par `pnpm check`, et par relecture pour le troisième).
