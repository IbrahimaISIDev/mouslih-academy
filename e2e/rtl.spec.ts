import { expect, test } from "@playwright/test";

/**
 * PROMPT-08 — vérifie que la bascule arabe est une vraie mise en page miroir,
 * pas seulement du texte inversé : dir="rtl", polices arabes, position de la
 * sidebar du lecteur, et isolement LTR des durées.
 */

test.describe("Bascule FR → AR", () => {
  test("accueil : dir=rtl et police arabe appliquée", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    const heroTitle = page.getByRole("heading", { level: 1 }).first();
    const fontFamily = await heroTitle.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fontFamily.toLowerCase()).toContain("amiri");
  });

  test("dashboard : compteurs en chiffres arabes-indiens, durée isolée en LTR", async ({
    page,
  }) => {
    await page.goto("/ar/tableau-de-bord");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await expect(page.getByText("٥ / ١١ دروس · ٤٥٪").first()).toBeVisible();

    const ltrTime = page.locator('[dir="ltr"]', { hasText: /^\d{2}:\d{2}$/ }).first();
    await expect(ltrTime).toBeVisible();
    await expect(ltrTime).toHaveAttribute("dir", "ltr");
  });

  test("lecteur : la sidebar du programme passe à droite en RTL", async ({ page }) => {
    await page.goto(
      "/ar/formations/rectification-fatiha/lecons/pourquoi-rectifier-la-fatiha",
    );
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await page.setViewportSize({ width: 1440, height: 900 });

    const lessonHeading = page.getByRole("heading", { level: 1 });
    const sidebarLink = page.getByRole("link", { name: "أرسل تلاوتي" });

    const headingBox = await lessonHeading.boundingBox();
    const sidebarBox = await sidebarLink.boundingBox();
    expect(headingBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();
    // En RTL, la colonne "start" (1fr, la vidéo/le contenu) doit se retrouver à droite de
    // la sidebar du programme (380px) — donc son x est plus grand que celui de la sidebar.
    if (headingBox && sidebarBox) {
      expect(headingBox.x).toBeGreaterThan(sidebarBox.x);
    }

    const durationBadge = page.locator('[dir="ltr"]', { hasText: /^\d{2}:\d{2}$/ }).first();
    await expect(durationBadge).toHaveAttribute("dir", "ltr");
  });
});
