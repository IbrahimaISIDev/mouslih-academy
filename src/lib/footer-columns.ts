import type { FooterColumn } from "@/components/layout/footer";

interface RawFooterColumn {
  title: string;
  items: string[];
}

/**
 * La colonne "Légal" (index 2, même ordre dans les 3 locales — voir common.footer.columns) est
 * la seule dont les libellés correspondent à de vraies pages ; Formations/Académie restent des
 * ancres de repli volontaires (`href: "/"`), hors scope de ce câblage.
 */
const LEGAL_COLUMN_INDEX = 2;
const LEGAL_HREFS = ["/conditions-utilisation", "/politique-remboursement", "/confidentialite"];

export function buildFooterColumns(raw: RawFooterColumn[]): FooterColumn[] {
  return raw.map((column, columnIndex) => ({
    title: column.title,
    links: column.items.map((label, itemIndex) => ({
      label,
      href: columnIndex === LEGAL_COLUMN_INDEX ? (LEGAL_HREFS[itemIndex] ?? "/") : "/",
    })),
  }));
}
