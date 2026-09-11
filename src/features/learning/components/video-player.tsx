"use client";

import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Subtitles,
  Volume2,
} from "lucide-react";
import { formatDuration } from "@/lib/format";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

const SPEEDS = [1, 1.25, 1.5, 0.75] as const;

export interface VideoPlayerProps {
  durationSeconds: number;
  initialPositionSeconds: number;
  verseText?: string;
  onProgress: (seconds: number) => void;
  onComplete: () => void;
}

function VideoPlayer({
  durationSeconds,
  initialPositionSeconds,
  verseText,
  onProgress,
  onComplete,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(
    Math.min(initialPositionSeconds, durationSeconds),
  );
  const [speedIndex, setSpeedIndex] = useState(0);
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSeconds((prev) => {
        const next = Math.min(prev + SPEEDS[speedIndex], durationSeconds);
        onProgress(next);
        if (next >= durationSeconds && !completedRef.current) {
          completedRef.current = true;
          setIsPlaying(false);
          onComplete();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, speedIndex, durationSeconds, onProgress, onComplete]);

  function seekBy(delta: number) {
    setCurrentSeconds((prev) => {
      const next = Math.min(Math.max(prev + delta, 0), durationSeconds);
      onProgress(next);
      return next;
    });
  }

  function seekTo(ratio: number) {
    const next = Math.min(
      Math.max(ratio * durationSeconds, 0),
      durationSeconds,
    );
    setCurrentSeconds(next);
    onProgress(next);
  }

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen?.();
    }
  }

  const progressRatio =
    durationSeconds > 0 ? currentSeconds / durationSeconds : 0;

  return (
    <div
      ref={containerRef}
      className="relative grid aspect-video place-items-center bg-green-900"
    >
      <GeometricPattern variant="khatam" opacity={0.22} />

      <div className="relative text-center">
        <button
          type="button"
          onClick={() => setIsPlaying((v) => !v)}
          aria-label={isPlaying ? "Pause" : "Lecture"}
          className="mx-auto mb-4 grid size-19 place-items-center rounded-full border border-gold-200 bg-green-900/50"
        >
          {isPlaying ? (
            <Pause
              className="size-6 text-gold-200"
              fill="currentColor"
              strokeWidth={0}
            />
          ) : (
            <Play
              className="size-6.5 text-gold-200"
              fill="currentColor"
              strokeWidth={0}
            />
          )}
        </button>
        {verseText && (
          <p
            dir="rtl"
            lang="ar"
            className="font-serif text-[34px] text-on-dark-soft"
          >
            {verseText}
          </p>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(12,36,29,0)_0%,rgba(12,36,29,0.9)_70%)] px-5 pb-3.5 pt-8">
        <button
          type="button"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            seekTo((e.clientX - rect.left) / rect.width);
          }}
          aria-label="Progression de la vidéo"
          className="relative mb-3.5 h-1 w-full rounded-sm bg-white/20"
        >
          <div
            className="h-full rounded-sm bg-gold-200"
            style={{ width: `${progressRatio * 100}%` }}
          />
          <div
            className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-gold-200"
            style={{ insetInlineStart: `calc(${progressRatio * 100}% - 6px)` }}
          />
        </button>

        <div className="flex items-center gap-5 text-on-dark">
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            aria-label={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? (
              <Pause className="size-5" fill="currentColor" strokeWidth={0} />
            ) : (
              <Play className="size-5" fill="currentColor" strokeWidth={0} />
            )}
          </button>
          <button
            type="button"
            onClick={() => seekBy(-10)}
            aria-label="Reculer de 10 secondes"
          >
            <RotateCcw className="size-5" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            onClick={() => seekBy(10)}
            aria-label="Avancer de 10 secondes"
          >
            <RotateCw className="size-5" strokeWidth={1.7} />
          </button>
          <Volume2 className="size-5" strokeWidth={1.7} />
          <span
            dir="ltr"
            className="text-[13px] tabular-nums text-on-dark-soft"
          >
            {formatDuration(currentSeconds)} / {formatDuration(durationSeconds)}
          </span>
          <div className="ms-auto flex items-center gap-4.5">
            <button
              type="button"
              onClick={() => setSpeedIndex((i) => (i + 1) % SPEEDS.length)}
              className="rounded-sm border border-white/35 px-2 py-0.5 text-[13px]"
            >
              {SPEEDS[speedIndex]}×
            </button>
            <button
              type="button"
              onClick={() => setSubtitlesOn((v) => !v)}
              aria-pressed={subtitlesOn}
              className="flex items-center gap-1 rounded-sm border border-white/35 px-2 py-0.5 text-[13px]"
            >
              <Subtitles className="size-3.5" strokeWidth={1.7} />
              FR
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Plein écran"
            >
              <Maximize className="size-[19px]" strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { VideoPlayer };
