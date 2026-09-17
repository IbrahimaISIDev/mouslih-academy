import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mouslih Academy";

/**
 * Image de partage (Open Graph) : ce qui s'affiche quand un lien vers le site est collé dans
 * WhatsApp, Facebook ou un aperçu de lien — jusqu'ici absent, donc un aperçu vide ou générique
 * du navigateur. Un seul rendu (pas de texte localisé par langue) : Satori, le moteur derrière
 * ImageResponse, ne rend pas correctement l'arabe sans une police spécifique chargée, et le nom
 * de la marque n'a de toute façon pas besoin de traduction.
 */
export default async function OpengraphImage() {
  const logoPath = join(process.cwd(), "public/images/brand/logo.jpg");
  const logoData = await readFile(logoPath);
  const logoSrc = `data:image/jpeg;base64,${logoData.toString("base64")}`;

  // Satori (le moteur derrière ImageResponse) n'a accès ni aux classes Tailwind ni aux variables
  // CSS (globals.css) : seul du CSS inline avec des couleurs littérales fonctionne ici. Les
  // valeurs reprennent volontairement --color-green-900/700/300 et le ton gold-200 du thème.
  /* eslint-disable no-restricted-syntax */
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#184e20",
          backgroundImage: "radial-gradient(circle at 25% 15%, rgba(56,179,73,0.35), transparent 45%)",
        }}
      >
        <img
          src={logoSrc}
          alt=""
          width={168}
          height={168}
          style={{ borderRadius: "50%", marginBottom: 36, border: "4px solid rgba(232,196,120,0.55)" }}
        />
        <div style={{ display: "flex", fontSize: 68, color: "#ffffff", fontWeight: 600, marginBottom: 18 }}>
          Mouslih Academy
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a9d8ae", maxWidth: 820, textAlign: "center" }}>
          Apprendre le Coran, le Tajwid et les sciences islamiques — à votre rythme
        </div>
      </div>
    ),
    { ...size },
  );
  /* eslint-enable no-restricted-syntax */
}
