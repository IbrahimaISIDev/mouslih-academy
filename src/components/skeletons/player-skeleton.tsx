import { Skeleton } from "@/components/ui/skeleton";

const SIDEBAR_LINE_HEIGHTS = [10, 11, 9, 10, 12, 10, 11, 9, 10, 10, 11, 9];

/** Reprend la géométrie réelle du lecteur : vidéo 16/9, titre, 3 onglets, 12 lignes de
 *  sidebar à hauteurs légèrement variables (une vraie liste n'est jamais parfaitement régulière). */
function PlayerSkeleton() {
  return (
    <div>
      <div className="h-14 bg-green-900" />
      <div className="h-[3px] bg-white/15" />

      <div className="lg:grid lg:grid-cols-[1fr_380px]">
        <div className="lg:border-e lg:border-border-subtle">
          <Skeleton className="aspect-video w-full rounded-none" />

          <div className="px-5 pt-5 lg:px-7.5 lg:pt-6.5">
            <Skeleton className="mb-2.5 h-3.5 w-56" />
            <Skeleton className="h-8 w-3/4" />
          </div>

          <div className="px-5 lg:px-7.5">
            <div className="mt-6.5 mb-6.5 flex gap-6 border-b border-border-subtle">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="mb-3 h-5 w-24" />
              ))}
            </div>
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="mb-3 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div className="hidden bg-surface p-5 lg:block">
          <Skeleton className="mb-5 h-1.5 w-full" />
          <div className="flex flex-col gap-3.5">
            {SIDEBAR_LINE_HEIGHTS.map((height, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="size-4 shrink-0 rounded-full bg-skeleton-secondary" />
                <Skeleton className="flex-1" style={{ height }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { PlayerSkeleton };
