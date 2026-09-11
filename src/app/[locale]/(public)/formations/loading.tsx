import { Skeleton } from "@/components/ui/skeleton";
import { CourseGridSkeleton } from "@/components/skeletons/course-grid-skeleton";

export default function CatalogueLoading() {
  return (
    <div>
      <div className="h-[60px] border-b border-border-subtle bg-surface lg:h-[76px]" />

      <div className="border-b border-border-subtle px-5 pt-6 pb-6 sm:px-6 lg:px-11 lg:pt-11 lg:pb-7.5">
        <Skeleton className="mb-3.5 h-8 w-56 lg:mb-2.5 lg:h-11 lg:w-80" />
        <Skeleton className="mb-3.5 h-5 w-full max-w-[60ch] lg:mb-7.5" />
        <Skeleton className="h-12 w-full lg:w-[340px]" />
      </div>

      <div className="bg-bg px-5 pt-5 pb-24 sm:px-6 lg:px-11 lg:pt-9 lg:pb-24">
        <CourseGridSkeleton />
      </div>
    </div>
  );
}
