import { CourseDetailSkeleton } from "@/components/skeletons/course-detail-skeleton";

export default function CourseDetailLoading() {
  return (
    <div>
      <div className="h-[60px] border-b border-border-subtle bg-surface lg:h-[76px]" />
      <CourseDetailSkeleton />
    </div>
  );
}
