# Mouslih Academy — frontend

Plateforme e-learning islamique sénégalaise (Coran, Tajwid, sciences islamiques), paiement
Wave, multilingue français / anglais / arabe avec RTL réel.

Ce dépôt contient le **frontend Next.js**, livré avec des données de démonstration
(`src/mocks/`). Le backend n'existe pas encore ; voir [`BACKEND.md`](./BACKEND.md) pour les
contrats d'API attendus et le mécanisme de bascule.

## Installation

Prérequis : Node 22+, [pnpm](https://pnpm.io) 10+.

```bash
pnpm install
pnpm dev
```

L'application démarre sur [http://localhost:3000](http://localhost:3000) et redirige vers
`/fr`. Les locales disponibles sont `/fr`, `/en`, `/ar`.

## Scripts

| Commande | Effet |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production (doit être silencieux, zéro avertissement) |
| `pnpm start` | Sert le build de production |
| `pnpm check` | `tsc --noEmit` + `eslint .` + `vitest run` — à faire passer avant tout commit |
| `pnpm test` | Tests unitaires (Vitest) seuls |
| `pnpm test:e2e` | Tests bout en bout (Playwright) — nécessite `npx playwright install` une fois |
| `pnpm lint` / `pnpm format` | ESLint seul / Prettier (écrit les fichiers) |

## Variables d'environnement

| Variable | Défaut | Effet |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCKS` | `true` (toute valeur ≠ `"false"`) | `false` bascule chaque fonction `features/*/api` sur de vrais appels HTTP au lieu des fixtures |
| `NEXT_PUBLIC_API_BASE_URL` | *(vide)* | Base absolue des appels réels (ex. `https://api.mouslihacademy.sn`) — obligatoire dès que `NEXT_PUBLIC_USE_MOCKS=false` et qu'une fonction est appelée depuis un composant serveur |

Détails complets des contrats d'API dans [`BACKEND.md`](./BACKEND.md).

## Arborescence et conventions

Le détail de l'arborescence (`src/app`, `src/features`, `src/components`, `src/lib`) et des
conventions de code (feature-first, Server Components par défaut, point de bascule unique pour
les données) est documenté dans [`ARCHITECTURE.md`](./ARCHITECTURE.md) — pas dupliqué ici pour
éviter que les deux divergent.

Palette, typographie, espacements et tokens Tailwind : [`DESIGN-TOKENS.md`](./DESIGN-TOKENS.md).
Types de domaine, données de démo et contrats d'API d'origine :
[`DATA-MODEL.md`](./DATA-MODEL.md).

## Avant de contribuer

[`CONTRIBUTING.md`](./CONTRIBUTING.md) — les trois règles non négociables (aucune couleur en
dur, aucune propriété CSS physique, aucune donnée en dur dans un composant) et la marche à
suivre pour ajouter un écran.

## État du projet

Les 17 écrans du périmètre initial sont livrés (desktop et mobile ; accueil, dashboard et
lecteur également en arabe RTL complet). Le détail des écarts constatés lors de la recette
finale et les décisions associées est dans [`FIDELITE.md`](./FIDELITE.md).

Les maquettes de référence (`maquettes/*.dc.html`) restent dans le dépôt à titre de mémoire du
design — ce sont des prototypes HTML statiques, pas du code à réutiliser.
