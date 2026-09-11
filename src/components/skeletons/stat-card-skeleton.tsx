import { Skeleton } from "@/components/ui/skeleton";

/** Reprend la géométrie réelle de StatCard : libellé 40 %, valeur 60 % en 34 px, variation 30 %. */
function StatCardSkeleton() {
  return (
    <div className="rounded-sm border border-border-subtle bg-surface p-5">
      <Skeleton className="mb-3.5 h-3 w-[40%]" />
      <Skeleton className="mb-3 h-[34px] w-[60%]" />
      <Skeleton className="h-3.5 w-[30%] bg-skeleton-secondary" />
    </div>
  );
}

export { StatCardSkeleton };
