import { Music2, Users } from "lucide-react";
import type { SocialNetwork } from "@/lib/social";

/** Pictogramme YouTube simplifié (la bibliothèque d'icônes n'inclut pas les logos de marque). */
function YouTubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
      <path d="M10 9.2v5.6l4.8-2.8z" className="fill-green-900" />
    </svg>
  );
}

function SocialIcon({
  network,
  className,
}: {
  network: SocialNetwork;
  className?: string;
}) {
  if (network === "youtube") return <YouTubeGlyph className={className} />;
  if (network === "tiktok")
    return <Music2 className={className} strokeWidth={1.8} />;
  return <Users className={className} strokeWidth={1.8} />;
}

export { SocialIcon };
