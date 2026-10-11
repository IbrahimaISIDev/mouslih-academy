import type { FooterColumn } from "@/components/layout/footer";

interface RawFooterColumn {
  title: string;
  items: string[];
}

/**
 * Les colonnes suivent le même ordre dans les 3 locales (voir common.footer.columns) :
 * 0 = la formation, 1 = l'académie, 2 = légal. Un libellé sans page dédiée (« À propos »,
 * « Questions fréquentes ») reste une ancre de repli volontaire (`href: "/"`).
 */
const FATIHA_HREF = "/formations/rectification-fatiha";
const COLUMN_HREFS: (string | undefined)[][] = [
  [FATIHA_HREF, `${FATIHA_HREF}#erreurs`, `${FATIHA_HREF}#programme`],
  [undefined, "/temoignages", undefined, "/contact"],
  ["/conditions-utilisation", "/politique-remboursement", "/confidentialite"],
];

export function buildFooterColumns(raw: RawFooterColumn[]): FooterColumn[] {
  return raw.map((column, columnIndex) => ({
    title: column.title,
    links: column.items.map((label, itemIndex) => ({
      label,
      href: COLUMN_HREFS[columnIndex]?.[itemIndex] ?? "/",
    })),
  }));
}
