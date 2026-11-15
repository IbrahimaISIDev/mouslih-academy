import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCourses } from "@/features/catalog/api/get-courses";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Pages publiques, dans chaque langue, avec leurs équivalents (hreflang) pour Google. */
const STATIC_PATHS = [
  "",
  "/formations",
  "/temoignages",
  "/contact",
  "/confidentialite",
  "/conditions-utilisation",
  "/politique-remboursement",
];

function entry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
  );
  return {
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    changeFrequency: "weekly",
    priority,
    alternates: { languages },
  };
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Une API injoignable ne doit pas casser le sitemap : on garde au moins les pages fixes.
  const courses = await getCourses().catch(() => []);
  return [
    ...STATIC_PATHS.map((path) =>
      entry(path, path === "" ? 1 : path.startsWith("/formations") ? 0.8 : 0.5),
    ),
    ...courses.map((course) => entry(`/formations/${course.slug}`, 0.9)),
  ];
}
