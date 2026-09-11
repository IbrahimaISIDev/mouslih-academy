# Design tokens — Mouslih Academy

Toutes ces valeurs sont **relevées dans les maquettes**. Elles sont la source de vérité.

## Couleurs

### Primaire — vert académie

```green-ink``` est un vert quasi noir dédié au texte/icône (liens, badges, texte sur un
remplissage vert vif) : il garde un contraste confortable là où ```green-700``` lui-même serait
trop clair pour du texte. Ne jamais l'utiliser comme fond.

| Token | Hex | Usage |
|---|---|---|
| ```green-ink``` | ```#0B230E``` | **texte/icône uniquement** — liens, badges, bouton outline. Jamais un fond. |
| ```green-900``` | ```#09200C``` | hero, sidebar admin, footer — fonds sombres |
| ```green-800``` | ```#113B17``` | second niveau sombre, bandeaux CTA |
| ```green-700``` | ```#1D7228``` | **couleur d'action** : boutons, bordures, état actif |
| ```green-600``` | ```#21832E``` | survol des boutons primaires, barres de progression |
| ```green-300``` | ```#83B98C``` | texte secondaire sur fond sombre |
| ```green-100``` | ```#E6F4E9``` | aplats, badges, ligne de leçon active, avatars |

### Neutres chauds
| Token | Hex | Usage |
|---|---|---|
| ```bg``` | ```#F5F3EE``` | fond de page |
| ```surface``` | ```#FFFFFF``` | cards, panneaux, header clair |
| ```border``` | ```#E7E3DB``` | bordure standard de card |
| ```border-strong``` | ```#CFC9BD``` | bordure de champ de formulaire, cadre de maquette |
| ```hairline``` | ```#F0EDE7``` | filet interne (séparateur dans une card) |
| ```text``` | ```#1C1B18``` | texte principal |
| ```text-soft``` | ```#4A4741``` | paragraphes longs |
| ```text-muted``` | ```#6B6760``` | légendes, métadonnées |
| ```text-faint``` | ```#99948B``` | placeholders, texte désactivé |

### Accent — laiton (avec parcimonie)
| Token | Hex | Usage |
|---|---|---|
| ```gold-600``` | ```#A8823C``` | sur-titres en capitales, filets, numéros de module |
| ```gold-300``` | ```#C9B073``` | bordure des boutons or |
| ```gold-200``` | ```#E5D3A8``` | CTA de valorisation, badge premium, rail actif admin |
| ```gold-50``` | ```#FAF2DF``` | fond de badge premium |

**Règle absolue : l'or ne porte jamais une action de conversion.** Il souligne une valeur
acquise — attestation, formation premium, célébration de paiement, accent sur fond sombre.
Un seul élément doré par écran, maximum deux.

### Sémantique
| Token | Texte | Fond | Bordure |
|---|---|---|---|
| success | ```#2F7D53``` | ```#E8F2EB``` | ```#CFE0D4``` |
| warning | ```#B5761F``` | ```#FBF3E4``` | ```#E8D6AE``` |
| error | ```#A63A2E``` | ```#FAECEA``` | ```#E7C3BC``` |
| whatsapp | ```#FFFFFF``` | ```#1F8A4C``` (survol ```#1A7742```) | — |

### Sur fond sombre
```on-dark``` ```#F1F6F2``` (titres) · ```on-dark-soft``` ```#DCE8E1``` · ```on-dark-muted``` ```#B9CCC1```
(paragraphes) · ```green-300``` ```#7FA894``` (légendes).

## Typographie

| Famille | Rôle | Graisses |
|---|---|---|
| **Spectral** | titres latins | 300, 400, 500, 600, 700 |
| **Work Sans** | corps latin, UI, chiffres | 400, 500, 600, 700 |
| **Amiri** | titres arabes (naskh) | 400, 700 |
| **IBM Plex Sans Arabic** | corps arabe, UI arabe | 400, 500, 600, 700 |

### Échelle desktop
| Niveau | Famille | Taille / interligne | Détail |
|---|---|---|---|
| H1 | Spectral 500 | 56 / 1.05 | ```letter-spacing: -0.015em``` |
| H1 page interne | Spectral 500 | 38–46 / 1.12 | |
| H2 | Spectral 500 | 34–38 / 1.15 | |
| H3 | Spectral 600 | 28 / 1.2 | |
| H4 | Spectral 600 | 22 / 1.35 | titre de card, nom de module |
| H5 | Work Sans 600 | 17 / 1.4 | titre de leçon |
| H6 | Work Sans 600 | 12 / 1.3 | ```uppercase```, ```letter-spacing: 0.18em```, ```gold-600``` |
| Corps | Work Sans 400 | 17 / 1.65 | ```text-wrap: pretty```, max 62ch |
| Corps S | Work Sans 400 | 15 / 1.6 | |
| Légende | Work Sans 400 | 13 / 1.5 | ```text-muted``` |
| Micro | Work Sans 600 | 11–12 | badges |

### Échelle mobile
H1 32 / 1.12 · H1 secondaire 28 · H2 24 / 1.25 · H3 21 · H4 19 · corps 15 / 1.65 ·
légende 12–13. **Jamais moins de 11 px, et 44 px minimum de hauteur pour toute cible tactile.**

### Arabe
Interligne **1.9 à 2.0** (les diacritiques ont besoin d'air). **Jamais** ```uppercase```,
**jamais** ```letter-spacing```. Titres Amiri 700, corps IBM Plex Sans Arabic 400.
Chiffres arabes-indiens (٠١٢٣٤٥٦٧٨٩) pour les compteurs éditoriaux ; chiffres latins en
```dir="ltr"``` pour les durées vidéo (```04:12```), les références (```TX-8842301```) et les numéros
de téléphone.

## Formes, filets, ombres

- **Rayon : 8 px partout** (```--radius-sm/md/lg```, changé du 2 px d'origine le 2026-09-05 à
  la demande explicite, pour un rendu plus doux). Boutons, cards, champs, badges, images.
  ```--radius-xs``` (4 px) pour les petits éléments (bouton de fermeture, flèche de tooltip).
  Seules exceptions : avatars et boutons de lecture, en cercle parfait (```rounded-full```).
- **Bordures : 1 px.** ```border``` sur les cards, ```border-strong``` sur les champs.
  Accent haut de card : ```border-top: 2px solid``` (```green-700``` ou ```gold-600```).
- **Ombres : aucune**, sauf card de formation survolée : ```0 6px 22px rgba(12,36,29,0.09)```
  avec ```translateY(-2px)``` et bordure qui passe à ```green-700```.
- **Barre CTA mobile fixe :** ```rgba(245,243,238,0.82)``` ou ```rgba(255,255,255,0.85)``` +
  ```backdrop-filter: blur(10–12px)``` + filet supérieur 1 px ```border```.

## Espacements

Échelle 4 px. Valeurs récurrentes des maquettes :

- Padding de section desktop : ```44px``` horizontal, ```52–66px``` vertical.
- Padding de section mobile : ```20px``` horizontal, ```24–32px``` vertical.
- Padding de card : ```18–26px``` (mobile ```15–16px```).
- Gap de grille de cards : ```26px``` desktop, ```16px``` mobile.
- Hauteur de header : ```76px``` desktop, ```60px``` mobile. Barre du lecteur : ```56px``` / ```48px```.
- Sidebar admin : ```248px```. Sidebar du lecteur : ```380px```. Colonne latérale : ```340–380px```.
- Largeur de contenu lisible : ```62ch``` maximum.

## Motifs géométriques

Trois tuiles SVG en ```background-image```, jamais en premier plan, jamais derrière du texte
courant. À implémenter comme composant ```GeometricPattern``` avec ```variant``` et ```opacity```.

1. **Khatam / octogramme** — tuile 72 px, trait ```#4E9077``` 1 px, opacité 0.3–0.5.
   Hero, footer, bandeaux sombres.
2. **Treillis laiton** — tuile 40 px, trait ```#A8823C``` 0.9 px, opacité 0.3–0.35.
   Célébration de paiement, attestation, encart « formation la plus rentable ».
3. **Chevrons** — tuile 48 × 28 px, trait ```#14503E``` opacité 0.22. Séparateurs, états vides.

Les définitions SVG exactes sont dans les maquettes (```data:image/svg+xml``` inline).
Les extraire en fichiers ```public/patterns/*.svg``` et les référencer en CSS.

## Tailwind CSS v4 — configuration

Dans ```globals.css``` :

`````````css
@import "tailwindcss";

@theme {
  --color-green-ink: #0B230E;
  --color-green-900: #09200C;
  --color-green-800: #113B17;
  --color-green-700: #1D7228;
  --color-green-600: #21832E;
  --color-green-300: #83B98C;
  --color-green-100: #E6F4E9;

  --color-bg: #F5F3EE;
  --color-surface: #FFFFFF;
  --color-border-subtle: #E7E3DB;
  --color-border-strong: #CFC9BD;
  --color-hairline: #F0EDE7;
  --color-text: #1C1B18;
  --color-text-soft: #4A4741;
  --color-text-muted: #6B6760;
  --color-text-faint: #99948B;

  --color-gold-600: #A8823C;
  --color-gold-300: #C9B073;
  --color-gold-200: #E5D3A8;
  --color-gold-50: #FAF2DF;

  --color-success: #2F7D53;
  --color-success-bg: #E8F2EB;
  --color-warning: #B5761F;
  --color-warning-bg: #FBF3E4;
  --color-error: #A63A2E;
  --color-error-bg: #FAECEA;
  --color-whatsapp: #1F8A4C;

  --color-on-dark: #F1F6F2;
  --color-on-dark-soft: #DCE8E1;
  --color-on-dark-muted: #B9CCC1;

  --font-serif: var(--font-spectral), Georgia, serif;
  --font-sans: var(--font-work-sans), system-ui, sans-serif;
  --font-arabic-serif: var(--font-amiri), serif;
  --font-arabic-sans: var(--font-plex-arabic), sans-serif;

  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 8px;
  --radius-lg: 8px;

  --shadow-card-hover: 0 6px 22px rgba(12, 36, 29, 0.09);
}

/* En RTL, les familles arabes remplacent les familles latines */
[dir="rtl"] { --font-serif: var(--font-amiri), serif; --font-sans: var(--font-plex-arabic), sans-serif; }
[dir="rtl"] :is(p, li, dd) { line-height: 1.95; }
[dir="rtl"] .uppercase { text-transform: none; letter-spacing: normal; }
`````````

Cette bascule de variables de police en RTL est la clé : aucun composant n'a besoin de
connaître la langue pour utiliser la bonne typographie.
