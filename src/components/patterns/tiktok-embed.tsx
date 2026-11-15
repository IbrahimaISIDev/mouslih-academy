"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export interface TikTokEmbedProps {
  videoId: string;
  /** Nom de la personne, pour l'étiquette accessible du bouton. */
  title: string;
  className?: string;
}

/**
 * Vidéo TikTok « à la demande » : rien n'est chargé depuis TikTok (ni script, ni cookie) tant
 * que le visiteur n'a pas cliqué. Ensuite seulement, le lecteur officiel est intégré.
 */
function TikTokEmbed({ videoId, title, className }: TikTokEmbedProps) {
  const t = useTranslations("common.tiktok");
  const [active, setActive] = useState(false);

  if (active) {
    const params = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      description: "0",
      music_info: "0",
    });
    return (
      <iframe
        src={`https://www.tiktok.com/player/v1/${encodeURIComponent(videoId)}?${params}`}
        title={t("frameTitle", { name: title })}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className={cn("aspect-9/16 w-full bg-black", className)}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={t("play", { name: title })}
      className={cn(
        "group relative grid aspect-9/16 w-full place-items-center overflow-hidden bg-green-800 text-on-dark",
        className,
      )}
    >
      <GeometricPattern variant="khatam" opacity={0.25} />
      <span className="relative flex flex-col items-center gap-3 px-5 text-center">
        <span className="grid size-14 place-items-center rounded-full border border-gold-200 bg-green-900/50 transition-transform group-hover:scale-105">
          <Play
            className="size-5 text-gold-200"
            fill="currentColor"
            strokeWidth={0}
          />
        </span>
        <span className="text-sm font-semibold">{t("cta")}</span>
      </span>
      <span className="absolute inset-x-0 bottom-0 px-4 pb-3.5 text-center text-[11px] leading-snug text-on-dark-muted">
        {t("notice")}
      </span>
    </button>
  );
}

export { TikTokEmbed };
