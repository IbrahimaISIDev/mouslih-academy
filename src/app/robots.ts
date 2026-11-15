import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Espaces privés (compte, admin, paiement, désinscription) exclus de l'indexation. */
export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    "admin",
    "tableau-de-bord",
    "profil",
    "commande",
    "desinscription",
  ];
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...privatePaths.map((p) => `/*/${p}`)],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
