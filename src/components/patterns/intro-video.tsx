"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IntroVideoProps {
  src: string;
  poster: string;
  title: string;
  caption: string;
  className?: string;
}

/**
 * Vidéo de présentation : image d'aperçu légère d'abord, la vidéo n'est chargée qu'au clic
 * (aucun téléchargement inutile sur mobile, aucun cookie tiers).
 */
function IntroVideo({
  src,
  poster,
  title,
  caption,
  className,
}: IntroVideoProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={className}>
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          title={title}
          className="size-full bg-black object-contain"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={cn(className)}
      aria-label={title}
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 960px, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-green-900/20 transition-colors group-hover:bg-green-900/10" />
      <div className="relative grid size-14 place-items-center rounded-full border border-gold-200 bg-green-900/60 transition-transform group-hover:scale-105 lg:size-18">
        <Play
          className="size-6 text-gold-200"
          fill="currentColor"
          strokeWidth={0}
        />
      </div>
      <span className="absolute bottom-2.5 start-3 text-[11px] text-on-dark-muted lg:bottom-3.5 lg:start-4">
        {caption}
      </span>
    </button>
  );
}

export { IntroVideo };
