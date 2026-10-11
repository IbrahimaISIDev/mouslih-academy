import type { FooterColumn } from "@/components/layout/footer";
import { SOCIAL_LINKS, SOCIAL_ORDER } from "@/lib/social";

interface RawFooterColumn {
  title: string;
  items: string[];
}

/**
 * Les colonnes suivent le même ordre dans les 3 locales (voir common.footer.columns) :
 * 0 = la formation, 1 = l'académie, 2 = nos réseaux sociaux (liens dans lib/social.ts ; un
 * réseau sans lien n'est pas affiché). Un libellé sans page dédiée (« À propos », « Questions
 * fréquentes ») reste une ancre de repli volontaire (`href: "/"`). Les pages légales sont dans
 * la barre du bas du pied de page.
 */
const FATIHA_HREF = "/formations/rectification-fatiha";
const COLUMN_HREFS: (string | undefined)[][] = [
  [FATIHA_HREF, `${FATIHA_HREF}#erreurs`, `${FATIHA_HREF}#programme`],
  [undefined, "/temoignages", undefined, "/contact"],
];
const SOCIAL_COLUMN_INDEX = 2;

export function buildFooterColumns(raw: RawFooterColumn[]): FooterColumn[] {
  return raw.map((column, columnIndex) => {
    if (columnIndex === SOCIAL_COLUMN_INDEX) {
      return {
        title: column.title,
        links: column.items.flatMap((label, itemIndex) => {
          const network = SOCIAL_ORDER[itemIndex];
          const href = network ? SOCIAL_LINKS[network] : null;
          return network && href ? [{ label, href, social: network }] : [];
        }),
      };
    }
    return {
      title: column.title,
      links: column.items.map((label, itemIndex) => ({
        label,
        href: COLUMN_HREFS[columnIndex]?.[itemIndex] ?? "/",
      })),
    };
  });
}
