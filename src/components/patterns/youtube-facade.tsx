"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  caption: string;
  className?: string;
}

/**
 * Vignette cliquable plutôt qu'un <iframe> chargé d'emblée : n'importe l'iframe YouTube (et ses
 * cookies tiers) qu'après un clic explicite — cohérent avec politique-confidentialité, qui
 * annonce qu'aucun cookie de suivi tiers n'est chargé par défaut. youtube-nocookie.com en plus,
 * pour limiter encore le tracking une fois l'iframe chargée.
 */
function YouTubeFacade({ videoId, title, caption, className }: YouTubeFacadeProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className={className}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className={className}
      aria-label={title}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-green-900/25" />
      <div className="relative grid size-13 place-items-center rounded-full border border-gold-200 bg-green-900/55 transition-transform group-hover:scale-105 lg:size-17">
        <Play className="size-5 text-gold-200" fill="currentColor" strokeWidth={0} />
      </div>
      <span className="absolute bottom-2.5 start-3 text-[11px] text-on-dark-muted lg:bottom-3.5 lg:start-4">
        {caption}
      </span>
    </button>
  );
}

export { YouTubeFacade };
