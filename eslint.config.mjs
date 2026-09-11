import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Le préfixe (^|[\s:]) exige un vrai début de classe Tailwind (ou après un
// variant "sm:"/"hover:") : évite les faux positifs sur des fragments Radix
// comme "slide-in-from-right-2" ou "data-[side=right]".
const PHYSICAL_PROPERTY_PATTERN =
  "/(^|[\\s:])(pl-|pr-|ml-|mr-|left-|right-|text-left\\b|text-right\\b|border-l\\b|border-r\\b|rounded-l\\b|rounded-r\\b)/";

const HEX_COLOR_PATTERN = "/#[0-9a-fA-F]{3,8}\\b/";

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "maquettes/**",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: `JSXAttribute[name.name="className"] Literal[value=${PHYSICAL_PROPERTY_PATTERN}]`,
          message:
            "Propriété physique interdite : utiliser la propriété logique équivalente (ps/pe/ms/me/start/end/border-s/border-e).",
        },
        {
          selector: `JSXAttribute[name.name="className"] TemplateElement[value.raw=${PHYSICAL_PROPERTY_PATTERN}]`,
          message:
            "Propriété physique interdite : utiliser la propriété logique équivalente (ps/pe/ms/me/start/end/border-s/border-e).",
        },
        {
          selector: `Literal[value=${HEX_COLOR_PATTERN}]`,
          message:
            "Couleur en dur interdite hors globals.css : utiliser un token sémantique Tailwind (bg-surface, text-muted, border-hairline, ...).",
        },
        {
          selector: `TemplateElement[value.raw=${HEX_COLOR_PATTERN}]`,
          message:
            "Couleur en dur interdite hors globals.css : utiliser un token sémantique Tailwind (bg-surface, text-muted, border-hairline, ...).",
        },
      ],
    },
  },
];

export default eslintConfig;
