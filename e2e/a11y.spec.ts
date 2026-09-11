import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** PROMPT-09 — axe sans violation critique sur un échantillon représentatif des 17 écrans. */

const PAGES = [
  "/fr",
  "/fr/formations",
  "/fr/formations/rectification-fatiha",
  "/fr/connexion",
  "/fr/temoignages",
  "/fr/tableau-de-bord",
  "/fr/formations/rectification-fatiha/lecons/pourquoi-rectifier-la-fatiha",
  "/fr/profil",
  "/fr/commande/rectification-fatiha",
  "/fr/admin",
  "/fr/admin/utilisateurs",
];

for (const path of PAGES) {
  test(`axe : aucune violation critique sur ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    // Le critère d'acceptation porte sur les violations "critical" au sens axe. Les
    // contrastes "serious" restants (couleurs de palette DESIGN-TOKENS.md, ex. gold-600 en
    // sur-titre, warning/success des StatusBadge) sont documentés avec décision dans
    // FIDELITE.md plutôt que bloqués ici : ce sont des valeurs de palette verrouillées, pas
    // un bug de code.
    const critical = results.violations.filter((v) => v.impact === "critical");

    expect(
      critical,
      critical.map((v) => `${v.id}: ${v.description}\n${v.nodes.map((n) => n.target.join(" ")).join(", ")}`).join("\n\n"),
    ).toEqual([]);
  });
}
