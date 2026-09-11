import type { AdminCourseSales, Locale } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const BAR_COLORS = ["bg-green-700", "bg-green-600", "bg-green-600", "bg-green-300", "bg-green-300"];

export interface SalesByCourseCardProps {
  title: string;
  subtitle: string;
  salesLabel: (sales: number, amount: string) => string;
  sales: AdminCourseSales[];
  courseTitles: Record<string, string>;
  locale: Locale;
}

function SalesByCourseCard({ title, subtitle, salesLabel, sales, courseTitles, locale }: SalesByCourseCardProps) {
  const max = Math.max(...sales.map((s) => s.sales));

  return (
    <div className="border border-border-subtle bg-surface p-6">
      <div className="mb-5.5 flex items-baseline justify-between">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        <span className="text-[13px] text-text-muted">{subtitle}</span>
      </div>
      <div className="flex flex-col gap-4">
        {sales.map((row, index) => (
          <div key={row.courseId}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium">{courseTitles[row.courseId]}</span>
              <span className="text-text-muted tabular-nums">
                {salesLabel(row.sales, formatPrice(row.revenueXof, locale))}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-sm bg-hairline">
              <div
                className={`h-full ${BAR_COLORS[index % BAR_COLORS.length]}`}
                style={{ width: `${Math.round((row.sales / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { SalesByCourseCard };
