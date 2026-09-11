import { Skeleton } from "@/components/ui/skeleton";

/** Reprend la géométrie réelle du tableau de bord : salutation, carte « Continuer » (la plus
 *  grosse masse de l'écran) à sa taille réelle, puis 3 lignes de formation horizontales. */
function DashboardSkeleton() {
  return (
    <div>
      <div className="h-[60px] border-b border-border-subtle bg-surface lg:h-[76px]" />

      <div className="px-5 py-6 sm:px-6 lg:px-11 lg:py-11">
        <div className="mb-7.5 lg:mb-10">
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-9 w-64 lg:h-11 lg:w-96" />
        </div>

        <div className="relative mb-10 flex flex-col gap-5 overflow-hidden bg-green-900 p-5 lg:flex-row lg:items-center lg:gap-8 lg:p-7.5">
          <Skeleton className="aspect-video shrink-0 bg-white/10 lg:aspect-16/10 lg:w-65" />
          <div className="flex-1">
            <Skeleton className="mb-3 h-3.5 w-40 bg-white/10" />
            <Skeleton className="mb-2 h-8 w-full max-w-[420px] bg-white/10" />
            <Skeleton className="mb-4 h-4 w-2/3 bg-white/10" />
            <Skeleton className="h-1.5 w-full max-w-[520px] bg-white/10" />
          </div>
          <Skeleton className="h-14 w-full bg-white/10 lg:w-48" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <Skeleton className="mb-4.5 h-8 w-48" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 border border-border-subtle bg-surface p-4.5 sm:flex-row sm:items-center"
                >
                  <Skeleton className="hidden aspect-16/11 w-33 shrink-0 sm:block" />
                  <div className="flex-1">
                    <Skeleton className="mb-1 h-5 w-3/4" />
                    <Skeleton className="mb-4 h-3.5 w-1/2 bg-skeleton-secondary" />
                    <Skeleton className="h-1.5 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full bg-skeleton-secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardSkeleton };
