"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Clock, Play } from "lucide-react";
import type { LessonPlayback, Locale } from "@/lib/types";
import { youTubeThumbnailUrl } from "@/lib/youtube";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

const PROGRESS_INTERVAL_MS = 5_000;

/* Sous-ensemble de l'API IFrame YouTube réellement utilisé ici. */
interface YouTubePlayer {
  getCurrentTime(): number;
  destroy(): void;
}
interface YouTubeStateChangeEvent {
  data: number;
  target: YouTubePlayer;
}
interface YouTubeNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      host: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onStateChange: (event: YouTubeStateChangeEvent) => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youTubeApiPromise: Promise<YouTubeNamespace> | null = null;

/** Charge l'API IFrame une seule fois par page, et seulement au premier clic sur « Lecture ». */
function loadYouTubeApi(): Promise<YouTubeNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youTubeApiPromise) return youTubeApiPromise;

  youTubeApiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      youTubeApiPromise = null;
      reject(new Error("YouTube IFrame API indisponible"));
    };
    document.head.appendChild(script);
  });
  return youTubeApiPromise;
}

export interface VideoPlayerProps {
  playback: LessonPlayback;
  title: string;
  /** Passage arabe travaillé, affiché sur la vignette avant lecture. */
  passage?: string;
  initialPositionSeconds: number;
  locale: Locale;
  labels: {
    play: string;
    resumeAt: string;
    unavailableTitle: string;
    unavailableBody: string;
    loadError: string;
  };
  onProgress: (seconds: number) => void;
  onComplete: () => void;
}

function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function VideoPlayer(props: VideoPlayerProps) {
  const { playback } = props;
  if (playback.provider === "youtube") {
    return <YouTubeLessonPlayer {...props} videoId={playback.videoId} />;
  }
  if (playback.provider === "file") {
    return (
      <NativeLessonPlayer
        {...props}
        src={playback.url}
        poster={playback.posterUrl}
      />
    );
  }
  if (playback.provider === "stream") {
    return <NativeLessonPlayer {...props} src={playback.url} />;
  }
  return <UnavailablePanel {...props} />;
}

function UnavailablePanel({ passage, labels }: VideoPlayerProps) {
  return (
    <div className="relative grid aspect-video place-items-center overflow-hidden bg-green-900 px-6 text-center text-on-dark">
      <GeometricPattern variant="khatam" opacity={0.22} />
      <div className="relative">
        {passage && (
          <p
            dir="rtl"
            lang="ar"
            className="mb-4 font-arabic-serif text-[30px] leading-[1.6] text-gold-200 lg:text-[40px]"
          >
            {passage}
          </p>
        )}
        <p className="mb-1 inline-flex items-center gap-2 font-serif text-lg">
          <Clock className="size-[18px] text-gold-200" strokeWidth={1.6} />
          {labels.unavailableTitle}
        </p>
        <p className="mx-auto max-w-[46ch] text-sm text-on-dark-muted">
          {labels.unavailableBody}
        </p>
      </div>
    </div>
  );
}

function YouTubeLessonPlayer({
  videoId,
  title,
  passage,
  initialPositionSeconds,
  locale,
  labels,
  onProgress,
  onComplete,
}: VideoPlayerProps & { videoId: string }) {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  // Les callbacks changent d'identité à chaque rendu du parent : on lit toujours la dernière
  // version via une ref plutôt que de recréer le lecteur.
  const callbacksRef = useRef({ onProgress, onComplete });
  callbacksRef.current = { onProgress, onComplete };
  const startAtRef = useRef(initialPositionSeconds);
  startAtRef.current = initialPositionSeconds;

  useEffect(() => {
    if (!started || !mountRef.current) return;

    let player: YouTubePlayer | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;
    const stopTracking = () => {
      if (interval) clearInterval(interval);
      interval = null;
    };

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !mountRef.current) return;
        const target = document.createElement("div");
        mountRef.current.replaceChildren(target);
        player = new YT.Player(target, {
          // Domaine sans cookie, cohérent avec la politique de confidentialité.
          host: "https://www.youtube-nocookie.com",
          videoId,
          playerVars: {
            autoplay: 1,
            start: Math.floor(startAtRef.current),
            rel: 0,
            playsinline: 1,
            hl: locale,
            cc_lang_pref: locale,
          },
          events: {
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                stopTracking();
                interval = setInterval(() => {
                  callbacksRef.current.onProgress(
                    event.target.getCurrentTime(),
                  );
                }, PROGRESS_INTERVAL_MS);
              } else if (event.data === YT.PlayerState.PAUSED) {
                stopTracking();
                callbacksRef.current.onProgress(event.target.getCurrentTime());
              } else if (event.data === YT.PlayerState.ENDED) {
                stopTracking();
                callbacksRef.current.onProgress(0);
                callbacksRef.current.onComplete();
              }
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      stopTracking();
      player?.destroy();
    };
  }, [started, videoId, locale]);

  if (failed) {
    return (
      <UnavailablePanel
        playback={{ provider: null }}
        title={title}
        passage={passage}
        initialPositionSeconds={0}
        locale={locale}
        labels={{ ...labels, unavailableBody: labels.loadError }}
        onProgress={onProgress}
        onComplete={onComplete}
      />
    );
  }

  if (started) {
    return (
      <div
        ref={mountRef}
        className="aspect-video bg-black [&>iframe]:size-full [&>div]:size-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setStarted(true)}
      aria-label={`${labels.play} — ${title}`}
      className="group relative grid aspect-video w-full place-items-center overflow-hidden bg-green-900 text-on-dark"
    >
      <Image
        src={youTubeThumbnailUrl(videoId)}
        alt=""
        fill
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-cover opacity-35"
      />
      <GeometricPattern variant="khatam" opacity={0.18} />
      <div className="relative px-6 text-center">
        <div className="mx-auto mb-4 grid size-17 place-items-center rounded-full border border-gold-200 bg-green-900/60 transition-transform group-hover:scale-105 lg:size-19">
          <Play
            className="size-6 text-gold-200"
            fill="currentColor"
            strokeWidth={0}
          />
        </div>
        {passage && (
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic-serif text-[28px] leading-[1.6] text-on-dark lg:text-[40px]"
          >
            {passage}
          </p>
        )}
      </div>
      {initialPositionSeconds > 5 && (
        <span className="absolute bottom-3 start-4 rounded-sm bg-green-900/70 px-2 py-1 text-xs text-on-dark-soft">
          {labels.resumeAt}{" "}
          <span dir="ltr" className="tabular-nums">
            {formatClock(initialPositionSeconds)}
          </span>
        </span>
      )}
    </button>
  );
}

/** Lecteur du navigateur, pour une vidéo hébergée à URL signée : MP4 Cloudinary (lu partout) ou
 *  HLS Cloudflare Stream (lu nativement par Safari seulement — prévoir hls.js le cas échéant). */
function NativeLessonPlayer({
  src,
  poster,
  title,
  initialPositionSeconds,
  onProgress,
  onComplete,
}: VideoPlayerProps & { src: string; poster?: string }) {
  const lastReportRef = useRef(0);
  return (
    <video
      src={src}
      poster={poster}
      controls
      // Dissuasion simple : pas de bouton de téléchargement ni de menu « Enregistrer la vidéo ».
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      preload="metadata"
      playsInline
      title={title}
      className="aspect-video w-full bg-black"
      onLoadedMetadata={(e) => {
        // Reprise là où l'apprenant s'était arrêté (sauf tout près de la fin).
        const { duration } = e.currentTarget;
        if (
          initialPositionSeconds > 5 &&
          initialPositionSeconds < duration - 5
        ) {
          e.currentTarget.currentTime = initialPositionSeconds;
        }
      }}
      onTimeUpdate={(e) => {
        const now = Date.now();
        if (now - lastReportRef.current < PROGRESS_INTERVAL_MS) return;
        lastReportRef.current = now;
        onProgress(e.currentTarget.currentTime);
      }}
      onPause={(e) => onProgress(e.currentTarget.currentTime)}
      onEnded={() => {
        onProgress(0);
        onComplete();
      }}
    />
  );
}

export { VideoPlayer };
