import { Skeleton } from "@/components/ui/skeleton";
import { GeometricPattern } from "@/components/patterns/geometric-pattern";

/** Reprend la géométrie réelle de la page détail : en-tête sombre à hauteur réelle, carte
 *  d'achat, 3 paragraphes de description, 4 lignes de module fermées. */
function CourseDetailSkeleton() {
  return (
    <div>
      <section className="relative overflow-hidden bg-green-900">
        <GeometricPattern variant="khatam" opacity={0.32} />
        <div className="relative px-5 py-8 sm:px-6 lg:px-11 lg:py-11">
          <Skeleton className="mb-5 h-[13px] w-40 bg-white/10 lg:mb-6.5" />
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
            <div>
              <Skeleton className="mb-3.5 h-6 w-24 bg-white/10 lg:mb-5" />
              <Skeleton className="mb-3 h-9 w-full bg-white/10 lg:mb-4.5 lg:h-12" />
              <Skeleton className="mb-4.5 h-9 w-3/4 bg-white/10 lg:mb-7 lg:h-12" />
              <Skeleton className="mb-6 h-5 w-full max-w-[54ch] bg-white/10" />
              <div className="grid grid-cols-2 gap-2.5 lg:flex lg:flex-wrap lg:gap-8.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-24 bg-white/10" />
                ))}
              </div>
            </div>

            <div className="border border-white/15 bg-surface">
              <Skeleton className="aspect-16/10 w-full rounded-none" />
              <div className="p-5 lg:p-6">
                <Skeleton className="mb-5 h-8 w-32" />
                <Skeleton className="mb-2.5 h-14 w-full" />
                <Skeleton className="mb-5 h-14 w-full bg-skeleton-secondary" />
                <div className="flex flex-col gap-2.5 border-t border-hairline pt-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full bg-skeleton-secondary" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 px-5 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-12 lg:px-11 lg:py-16">
        <div>
          <Skeleton className="mb-4 h-8 w-56" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-4 max-w-[62ch]">
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}

          <Skeleton className="mb-5 mt-8 h-8 w-64" />
          <div className="border border-border-subtle bg-surface">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-b border-hairline px-6 py-4 last:border-b-0"
              >
                <Skeleton className="h-5 w-5 bg-skeleton-secondary" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-48 w-full bg-skeleton-secondary" />
        </div>
      </section>
    </div>
  );
}

export { CourseDetailSkeleton };
