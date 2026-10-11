/**
 * Source unique des réseaux sociaux de l'académie (colonne « Nos réseaux sociaux » du pied de
 * page). Un réseau sans lien (`href: null`) n'est pas affiché : il apparaît dès qu'on renseigne
 * son adresse ici. L'ordre est celui de i18n common.footer.columns[2].items.
 */
export type SocialNetwork = "tiktok" | "youtube" | "whatsappGroup";

export const SOCIAL_LINKS: Record<SocialNetwork, string | null> = {
  tiktok: null, // à renseigner : https://www.tiktok.com/@…
  youtube: "https://www.youtube.com/@mouslihacademiesenegal500",
  whatsappGroup: null, // à renseigner : https://chat.whatsapp.com/…
};

export const SOCIAL_ORDER: SocialNetwork[] = [
  "tiktok",
  "youtube",
  "whatsappGroup",
];
