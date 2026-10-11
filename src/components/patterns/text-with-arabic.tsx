import { Fragment } from "react";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Blocs Unicode arabes (lettres, voyelles, shadda, formes de présentation). */
const ARABIC_CHARS =
  "\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF";

/** Suite de mots arabes, espaces et tirets internes compris (« اهْدِنَا الصِّرَاطَ »). */
const ARABIC_RUN = new RegExp(
  `[${ARABIC_CHARS}]+(?:[\\s—-]+[${ARABIC_CHARS}]+)*`,
  "g",
);

/** Découpe un texte en segments latins / arabes, dans l'ordre. Exportée pour les tests. */
export function splitArabicRuns(
  text: string,
): { text: string; arabic: boolean }[] {
  const parts: { text: string; arabic: boolean }[] = [];
  let last = 0;
  for (const match of text.matchAll(ARABIC_RUN)) {
    const index = match.index ?? 0;
    if (index > last)
      parts.push({ text: text.slice(last, index), arabic: false });
    parts.push({ text: match[0], arabic: true });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), arabic: false });
  return parts;
}

export interface TextWithArabicProps {
  text: string;
  locale: Locale;
  /** Classes du segment arabe (taille, couleur) — police arabe toujours appliquée. */
  arabicClassName?: string;
}

/**
 * Met en valeur les mots arabes cités dans un texte français ou anglais (« la lettre ح »,
 * « articuler الْحَمْدُ ») : police arabe, corps plus grand, isolement bidirectionnel pour que
 * la ponctuation voisine ne saute pas. En arabe, le texte est rendu tel quel.
 */
function TextWithArabic({
  text,
  locale,
  arabicClassName,
}: TextWithArabicProps) {
  if (locale === "ar") return <>{text}</>;
  return (
    <>
      {splitArabicRuns(text).map((part, i) =>
        part.arabic ? (
          <bdi
            key={i}
            lang="ar"
            dir="rtl"
            className={cn(
              "font-arabic-serif text-[1.3em] leading-none text-green-ink",
              arabicClassName,
            )}
          >
            {part.text}
          </bdi>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}

export { TextWithArabic };
