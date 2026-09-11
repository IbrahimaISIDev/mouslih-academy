import { GeometricPattern } from "@/components/patterns/geometric-pattern";

export interface TopCourseBannerProps {
  title: string;
  courseTitle: string;
  body: string;
}

function TopCourseBanner({ title, courseTitle, body }: TopCourseBannerProps) {
  return (
    <div className="relative overflow-hidden bg-green-900 p-5.5 text-on-dark-muted">
      <GeometricPattern variant="treillis" opacity={0.3} />
      <div className="relative">
        <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-gold-200 uppercase">{title}</p>
        <p className="mb-1.5 font-serif text-xl text-on-dark">{courseTitle}</p>
        <p className="text-sm leading-[1.6]">{body}</p>
      </div>
    </div>
  );
}

export { TopCourseBanner };
