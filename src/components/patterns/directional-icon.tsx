import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DirectionalIconProps {
  icon: LucideIcon;
  className?: string;
  strokeWidth?: number;
}

/**
 * Icône dont le sens visuel doit suivre le sens de lecture — flèches suivant/précédent,
 * chevrons de fil d'Ariane ou de pagination, retour, burger asymétrique.
 *
 * Ne jamais l'utiliser pour : le triangle de lecture vidéo, les icônes de volume, Check,
 * Lock, Clock, ou le logo — ce sont des conventions universelles, pas une direction de
 * lecture. C'est l'erreur la plus fréquente en RTL.
 */
function DirectionalIcon({ icon: Icon, className, strokeWidth }: DirectionalIconProps) {
  return <Icon className={cn("rtl:scale-x-[-1]", className)} strokeWidth={strokeWidth} />;
}

export { DirectionalIcon };
