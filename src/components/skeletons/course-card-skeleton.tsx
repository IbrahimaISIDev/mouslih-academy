import { Skeleton } from "@/components/ui/skeleton";

/** Géométrie exacte de CourseCard (size="grid") : image 132 px, 2 lignes de titre, meta, pied prix/lien. */
function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-border-subtle bg-surface">
      <Skeleton className="h-[132px] w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="mb-2 h-[13px] w-full" />
        <Skeleton className="mb-4 h-[13px] w-[64%]" />
        <Skeleton className="h-[10px] w-[46%] bg-skeleton-secondary" />
      </div>
      <div className="flex items-center justify-between border-t border-hairline px-4 py-3">
        <Skeleton className="h-4 w-[62px]" />
        <Skeleton className="h-4 w-11 bg-skeleton-secondary" />
      </div>
    </div>
  );
}

export { CourseCardSkeleton };
