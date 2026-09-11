import { cn } from "@/lib/utils";
import { CourseCardSkeleton } from "@/components/skeletons/course-card-skeleton";

const DESKTOP_CARD_COUNT = 6;
const MOBILE_CARD_COUNT = 3;

/** Reprend la grille réelle de CatalogBrowser : 3 cards visibles en mobile, 6 en desktop (3 colonnes). */
function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-[26px]">
      {Array.from({ length: DESKTOP_CARD_COUNT }).map((_, i) => (
        <div key={i} className={cn(i >= MOBILE_CARD_COUNT && "hidden lg:block")}>
          <CourseCardSkeleton />
        </div>
      ))}
    </div>
  );
}

export { CourseGridSkeleton };
