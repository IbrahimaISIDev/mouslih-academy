/**
 * Vidéo de présentation de l'accueil, hébergée sur Cloudinary en mode public (vidéo de vitrine,
 * contrairement aux séances, servies par URL signée). Rendu web ≤ 1280 px (≈ 10 Mo) et image
 * d'aperçu préparés à l'envoi. Pour la remplacer : renvoyer un fichier sous le même public_id
 * (mouslih-academy/site/introduction-formation), les URLs restent valables.
 */
const BASE = "https://res.cloudinary.com/muaxmsav/video/upload";
const PUBLIC_ID = "v1/mouslih-academy/site/introduction-formation";

export const INTRO_VIDEO = {
  src: `${BASE}/c_limit,q_auto:good,w_1280/${PUBLIC_ID}.mp4`,
  poster: `${BASE}/c_limit,so_3,w_1280/${PUBLIC_ID}.jpg`,
} as const;
