import type { Locale } from "@/lib/types";
import { TextWithArabic } from "@/components/patterns/text-with-arabic";

export type DescriptionBlock =
  { kind: "paragraph"; text: string } | { kind: "list"; items: string[] };

/**
 * Découpe un texte éditorial en paragraphes (séparés par une ligne vide) et en listes (lignes
 * commençant par « - »). Convention volontairement minimale, saisissable telle quelle depuis
 * l'éditeur de traduction de l'admin. Exportée pour les tests.
 */
export function parseDescription(text: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  for (const chunk of text.split(/\n\s*\n/)) {
    let paragraph: string[] = [];
    let items: string[] = [];
    const flushParagraph = () => {
      if (paragraph.length)
        blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    };
    const flushList = () => {
      if (items.length) blocks.push({ kind: "list", items });
      items = [];
    };
    for (const rawLine of chunk.split("\n")) {
      const line = rawLine.trim();
      if (!line) continue;
      const item = /^[-•]\s+(.*)$/.exec(line);
      if (item) {
        flushParagraph();
        items.push(item[1]);
      } else {
        flushList();
        paragraph.push(line);
      }
    }
    flushParagraph();
    flushList();
  }
  return blocks;
}

export interface RichDescriptionProps {
  text: string;
  locale: Locale;
}

/** Description de formation : paragraphes et listes à puces, mots arabes mis en valeur. */
function RichDescription({ text, locale }: RichDescriptionProps) {
  const blocks = parseDescription(text);
  return (
    <div className="flex max-w-[62ch] flex-col gap-3.5 text-[15px] leading-[1.7] text-text-soft lg:gap-4 lg:text-[17px] lg:leading-[1.75]">
      {blocks.map((block, i) =>
        block.kind === "paragraph" ? (
          <p key={i}>
            <TextWithArabic text={block.text} locale={locale} />
          </p>
        ) : (
          <ul
            key={i}
            className="-mt-1 flex flex-col gap-2 border-s-2 border-gold-200 ps-5"
          >
            {block.items.map((item) => (
              <li key={item} className="flex gap-3 text-text">
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] size-1.5 shrink-0 rotate-45 bg-gold-600"
                />
                <span>
                  <TextWithArabic text={item} locale={locale} />
                </span>
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

export { RichDescription };
