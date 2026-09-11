# Architecture frontend — Mouslih Academy

Objectif : une base **évolutive, scalable, maintenable**. Trois principes qui tranchent tous
les arbitrages :

1. **Feature-first, pas type-first.** On regroupe par domaine métier (```features/catalog```),
   pas par nature technique (```components/```, ```hooks/``` géants).
2. **Le serveur rend, le client interagit.** Server Component par défaut ;
   ```"use client"``` seulement sur les feuilles interactives (accordéon, onglets, lecteur).
3. **Aucune donnée en dur dans un composant.** Tout passe par la couche ```features/*/api```,
   aujourd'hui alimentée par des fixtures, demain par le vrai backend. Un seul point de bascule.

## Arborescence

`````````
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/
│   │   │   ├── page.tsx                    # 01 Accueil
│   │   │   ├── formations/page.tsx         # 02 Catalogue
│   │   │   ├── formations/[slug]/page.tsx  # 03 Détail
│   │   │   ├── temoignages/page.tsx        # 05 Témoignages
│   │   │   └── layout.tsx                  # header public + footer
│   │   ├── (auth)/
│   │   │   ├── connexion/page.tsx          # 04
│   │   │   ├── inscription/page.tsx        # 04
│   │   │   └── layout.tsx                  # split 50/50 desktop
│   │   ├── (learner)/
│   │   │   ├── tableau-de-bord/page.tsx    # 06
│   │   │   ├── profil/page.tsx             # 08
│   │   │   ├── formations/[slug]/lecons/[lessonSlug]/page.tsx  # 07 Lecteur
│   │   │   └── layout.tsx                  # header connecté + tab bar mobile
│   │   ├── (checkout)/
│   │   │   ├── commande/[slug]/page.tsx    # 09 Récapitulatif
│   │   │   ├── commande/[slug]/wave/page.tsx        # 09 Redirection
│   │   │   └── commande/[ref]/confirmation/page.tsx # 10 (3 états)
│   │   ├── admin/
│   │   │   ├── page.tsx                              # 11
│   │   │   ├── formations/[id]/page.tsx              # 12
│   │   │   ├── utilisateurs/page.tsx                 # 13
│   │   │   ├── commandes/page.tsx                    # 13
│   │   │   └── layout.tsx                            # sidebar sombre
│   │   ├── layout.tsx        # <html dir> + provider next-intl + fonts
│   │   ├── error.tsx / not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/            # primitives shadcn re-thémées (button, input, dialog, tabs…)
│   ├── layout/        # PublicHeader, LearnerHeader, AdminSidebar, Footer, MobileTabBar
│   ├── patterns/      # LevelBadge, StatusBadge, ProgressBar, LockedRow, StickyCta,
│   │                  # GeometricPattern, WhatsAppButton, LanguageSwitcher, EmptyState
│   └── skeletons/     # un skeleton par type de contenu (voir PROMPT-07)
├── features/
│   ├── catalog/       # api/ hooks/ components/ (CourseCard, CourseFilters, Curriculum)
│   ├── learning/      # api/ hooks/ components/ (VideoPlayer, LessonSidebar, LessonTabs)
│   ├── checkout/      # api/ hooks/ components/ (OrderSummary, WaveRedirect, PaymentResult)
│   ├── account/       # api/ hooks/ components/ (ProfileForm, PasswordForm, PurchaseHistory)
│   └── admin/         # api/ hooks/ components/ (StatCard, DataTable, CurriculumEditor)
├── lib/
│   ├── format.ts      # formatPrice, formatDuration, toArabicDigits
│   ├── rtl.ts         # isRtl(locale), logical helpers
│   └── utils.ts       # cn()
├── i18n/
│   ├── routing.ts     # locales: ['fr','en','ar'], defaultLocale 'fr'
│   ├── request.ts
│   └── messages/{fr,en,ar}.json
└── mocks/             # fixtures de démo (courses, lessons, orders, users)
`````````

## Conventions

**Nommage.** Composants en ```PascalCase.tsx```, hooks en ```useXxx.ts```, fichiers utilitaires en
```kebab-case.ts```. Un composant par fichier, export nommé (pas de ```export default``` hors
pages Next).

**Props.** Interface explicite ```XxxProps``` juste au-dessus du composant. Jamais de ```any```,
jamais de ```React.FC```. Les variantes visuelles passent par ```cva``` (class-variance-authority),
comme shadcn — pas par des ```if``` de classes concaténées.

**Styles.** Uniquement des classes Tailwind pointant sur les tokens sémantiques
(```bg-surface```, ```text-muted```, ```border-hairline```). **Interdit :** valeurs hexadécimales dans
le JSX, ```style={{}}``` (sauf largeur de barre de progression calculée), classes arbitraires
```[#14503E]```.

**Espacement logique obligatoire** — c'est ce qui fait fonctionner le RTL sans réécriture :
```ps-``` / ```pe-``` / ```ms-``` / ```me-``` / ```start-``` / ```end-``` / ```border-s``` / ```border-e``` / ```text-start```.
**Interdit :** ```pl-```, ```pr-```, ```ml-```, ```mr-```, ```left-```, ```right-```, ```text-left```.
Une règle ESLint doit le refuser (voir PROMPT-00).

**État.** Serveur → TanStack Query. URL → nuqs (filtres catalogue, onglet admin, leçon
courante). Local → ```useState```. Aucun store global tant qu'un besoin réel ne l'exige pas.

**Accessibilité.** Cibles tactiles ≥ 44 px sur mobile. Accordéons et onglets construits sur
les primitives Radix de shadcn (clavier + ARIA gratuits). Contraste vérifié : le texte
```text-muted #6B6760``` sur ```bg #F5F3EE``` passe AA en 15 px et plus, jamais en dessous.

**Performance.** ```next/image``` partout, ```next/font``` pour les 4 familles avec ```display: swap```
et sous-ensemble arabe pour Amiri / IBM Plex Sans Arabic. Lecteur vidéo chargé en
```dynamic(() => …, { ssr: false })```. Budget : LCP < 2,5 s en 4G simulée.

## Tests

- **Vitest + Testing Library** : les patterns (LevelBadge, ProgressBar, LockedRow) et la
  logique de progression / formatage de prix.
- **Playwright** : 4 parcours — achat public jusqu'à la redirection Wave, connexion puis
  reprise de leçon, filtrage du catalogue jusqu'à l'état vide, bascule FR → AR avec
  vérification de ```dir="rtl"``` sur ```html```.
- Un test de non-régression visuelle par écran clé est un plus, pas un prérequis.
